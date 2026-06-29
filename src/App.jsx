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
  const [verres, setVerres] = useState(0)

  const aujourdhui = new Date().getDay()
  const focusSport = { 1: 'Hamstring', 2: 'Dos', 3: 'Épaules / Fessiers', 4: 'Jambes', 5: 'Poitrine', 6: 'Marche', 0: 'Repos' }
  const kcalSport = { 1: 380, 2: 360, 3: 390, 4: 420, 5: 370, 6: 150, 0: 0 }

  useEffect(() => {
    supabase.from('weights').select('*').order('date', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setDernierPoids(data[0].weight) })
    const saved = localStorage.getItem('eau_' + new Date().toISOString().split('T')[0])
    if (saved) setVerres(parseInt(saved))
  }, [])

  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">Santé & Forme</div>
        <div className="header-date">{date}</div>
      </header>

      {page === 'home' && (
        <div className="home">
          <div className="home-card" onClick={() => setPage('poids')}>
            <div className="home-card-top">
              <div className="home-card-label">Poids</div>
              <div className="home-card-icon">⚖️</div>
            </div>
            <div>
              <div className="home-card-value">{dernierPoids ? `${dernierPoids}` : '--'}<span style={{fontSize:'1.2rem', fontWeight:400}}> kg</span></div>
              <div className="home-card-value-sub">Objectif : 75 kg</div>
            </div>
            <div className="home-card-bottom">
              <div className="home-card-stat">
                <div className="home-card-stat-label">Reste à perdre</div>
                <div className="home-card-stat-value" style={{color:'#fb923c'}}>{dernierPoids ? `${(dernierPoids - 75).toFixed(1)} kg` : '--'}</div>
              </div>
              <div className="home-card-arrow">Voir →</div>
            </div>
          </div>

          <div className="home-card" onClick={() => setPage('sport')}>
            <div className="home-card-top">
              <div className="home-card-label">Sport</div>
              <div className="home-card-icon">🏋️</div>
            </div>
            <div>
              <div className="home-card-value" style={{fontSize:'1.8rem'}}>{focusSport[aujourdhui]}</div>
              <div className="home-card-value-sub">Programme BIGG</div>
            </div>
            <div className="home-card-bottom">
              <div className="home-card-stat">
                <div className="home-card-stat-label">Calories estimées</div>
                <div className="home-card-stat-value" style={{color:'#4ade80'}}>{kcalSport[aujourdhui] > 0 ? `~${kcalSport[aujourdhui]} kcal` : '--'}</div>
              </div>
              <div className="home-card-arrow">Voir →</div>
            </div>
          </div>

          <div className="home-card" onClick={() => setPage('eau')}>
            <div className="home-card-top">
              <div className="home-card-label">Hydratation</div>
              <div className="home-card-icon">💧</div>
            </div>
            <div>
              <div className="home-card-value">{verres}<span style={{fontSize:'1.2rem', fontWeight:400}}> / 8</span></div>
              <div className="home-card-value-sub">verres aujourd'hui</div>
            </div>
            <div className="home-card-bottom">
              <div className="home-card-stat">
                <div className="home-card-stat-label">Objectif</div>
                <div className="home-card-stat-value" style={{color:'#3b82f6'}}>2L / jour</div>
              </div>
              <div className="home-card-arrow">Voir →</div>
            </div>
          </div>

          <div className="home-card" onClick={() => setPage('sommeil')}>
            <div className="home-card-top">
              <div className="home-card-label">Sommeil</div>
              <div className="home-card-icon">😴</div>
            </div>
            <div>
              <div className="home-card-value">--<span style={{fontSize:'1.2rem', fontWeight:400}}> h</span></div>
              <div className="home-card-value-sub">cette nuit</div>
            </div>
            <div className="home-card-bottom">
              <div className="home-card-stat">
                <div className="home-card-stat-label">Objectif</div>
                <div className="home-card-stat-value" style={{color:'#a78bfa'}}>8h / nuit</div>
              </div>
              <div className="home-card-arrow">Voir →</div>
            </div>
          </div>
        </div>
      )}

      {page === 'poids' && <Poids onBack={() => setPage('home')} />}
      {page === 'sport' && <Sport onBack={() => setPage('home')} />}
      {page === 'eau' && <Eau onBack={() => setPage('home')} />}
      {page === 'sommeil' && <Sommeil onBack={() => setPage('home')} />}
    </div>
  )
}