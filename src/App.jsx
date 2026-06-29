import { useState, useEffect } from 'react'
import Poids from './components/Poids'
import Sport from './components/Sport'
import Eau from './components/Eau'
import Sommeil from './components/Sommeil'
import { supabase } from './lib/supabase'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [dernierPoids, setDernierPoids] = useState(null)
  const [poidsDepart, setPoidsDepart] = useState(null)
  const [verres, setVerres] = useState(0)
  const [seanceFaite, setSeanceFaite] = useState(false)

  const aujourdhui = new Date().getDay()
  const today = new Date().toISOString().split('T')[0]
  const focusSport = { 1: 'Hamstring', 2: 'Dos', 3: 'Épaules / Fessiers', 4: 'Jambes', 5: 'Poitrine', 6: 'Marche', 0: 'Repos' }
  const kcalSport = { 1: 380, 2: 360, 3: 390, 4: 420, 5: 370, 6: 150, 0: 0 }
  const OBJECTIF = 75

  useEffect(() => {
    supabase.from('weights').select('*').order('date', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setDernierPoids(data[0].weight) })
    supabase.from('weights').select('*').order('date', { ascending: true }).limit(1)
      .then(({ data }) => { if (data?.[0]) setPoidsDepart(data[0].weight) })
    const eau = localStorage.getItem('eau_' + today)
    if (eau) setVerres(parseInt(eau))
    const seance = localStorage.getItem('seance_' + today)
    if (seance) setSeanceFaite(true)
  }, [])

  const toggleSeance = (e) => {
    e.stopPropagation()
    if (seanceFaite) {
      localStorage.removeItem('seance_' + today)
      setSeanceFaite(false)
    } else {
      localStorage.setItem('seance_' + today, 'true')
      setSeanceFaite(true)
    }
  }

  const perdu = dernierPoids && poidsDepart ? (dernierPoids - poidsDepart).toFixed(1) : null
  const reste = dernierPoids ? (dernierPoids - OBJECTIF).toFixed(1) : null
  const progression = dernierPoids && poidsDepart && poidsDepart !== OBJECTIF
    ? Math.round(((poidsDepart - dernierPoids) / (poidsDepart - OBJECTIF)) * 100)
    : 0

  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  if (page === 'poids') return <Poids onBack={() => setPage('home')} />
  if (page === 'sport') return <Sport onBack={() => setPage('home')} />
  if (page === 'eau') return <Eau onBack={() => setPage('home')} />
  if (page === 'sommeil') return <Sommeil onBack={() => setPage('home')} />

  return (
    <div className="app">
      <header className="header">
        <span className="header-brand">Santé & Forme</span>
        <span className="header-date">{date}</span>
      </header>

      <div className="hero" onClick={() => setPage('poids')}>
        <div className="hero-label">Poids actuel</div>
        <div className="hero-value">
          {dernierPoids ? dernierPoids : '—'}
          <span className="hero-unit"> kg</span>
        </div>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Objectif</span>
            <span className="hero-meta-value">{OBJECTIF} kg</span>
          </div>
          {perdu && (
            <div className="hero-meta-item">
              <span className="hero-meta-label">Perdu</span>
              <span className="hero-meta-value" style={{color: perdu < 0 ? 'var(--green)' : 'var(--red)'}}>{perdu} kg</span>
            </div>
          )}
          {reste && (
            <div className="hero-meta-item">
              <span className="hero-meta-label">Reste</span>
              <span className="hero-meta-value" style={{color: 'var(--orange)'}}>{reste} kg</span>
            </div>
          )}
        </div>
        {poidsDepart && (
          <div className="hero-prog">
            <div className="hero-prog-track">
              <div className="hero-prog-fill" style={{width: `${Math.min(Math.max(0, progression), 100)}%`}} />
            </div>
            <div className="hero-prog-labels">
              <span>{poidsDepart} kg — départ</span>
              <span>{Math.max(0, progression)}% · {OBJECTIF} kg</span>
            </div>
          </div>
        )}
      </div>

      <div className="sport-row" onClick={() => setPage('sport')}>
        <div className="sport-row-left">
          <span className="sport-label">Programme BIGG · {new Date().toLocaleDateString('fr-FR', {weekday: 'long'})}</span>
          <span className="sport-name">{focusSport[aujourdhui]}</span>
          <span className="sport-meta">4 blocs · voir la séance</span>
        </div>
        <span className="sport-kcal">{kcalSport[aujourdhui] > 0 ? `~${kcalSport[aujourdhui]} kcal` : 'Repos'} →</span>
      </div>

      <div className="bottom-grid">
        <div className="bottom-cell" onClick={() => setPage('eau')}>
          <div className="bottom-cell-label">Hydratation</div>
          <div className="bottom-cell-value">{verres} <span className="bottom-cell-unit">/ 8</span></div>
          <div className="bottom-cell-sub">verres aujourd'hui</div>
          <div className="bottom-cell-arrow">Ajouter →</div>
        </div>

        <div className="bottom-cell" onClick={() => setPage('sommeil')}>
          <div className="bottom-cell-label">Sommeil</div>
          <div className="bottom-cell-value">— <span className="bottom-cell-unit">h</span></div>
          <div className="bottom-cell-sub">cette nuit</div>
          <div className="bottom-cell-arrow">Enregistrer →</div>
        </div>

        <div className="bottom-cell">
  <div className="bottom-cell-label">Cette semaine</div>
  <div className="bottom-cell-days">
    {['L', 'M', 'M', 'J', 'V'].map((j, i) => {
      const jourIndex = i + 1
      const estAujourdhui = aujourdhui === jourIndex
      const estFait = estAujourdhui ? seanceFaite : false
      return (
        <div key={i} className={`bottom-cell-day ${estFait ? 'done' : ''}`}>
          {j}
        </div>
      )
    })}
  </div>
  <div className="bottom-cell-sub" style={{color: seanceFaite ? 'var(--green)' : 'var(--text3)'}}>
    {seanceFaite ? 'Séance du jour validée' : 'Séance non validée'}
  </div>
  <button
    className="btn"
    style={{marginTop: '1rem', fontSize: '10px', padding: '0.5rem 1rem'}}
    onClick={toggleSeance}
  >
    {seanceFaite ? 'Annuler' : 'Valider la séance'}
  </button>
</div>
      </div>
    </div>
  )
}