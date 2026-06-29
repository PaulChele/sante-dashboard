import { useState, useEffect } from 'react'

const OBJECTIF = 8
const TODAY = new Date().toISOString().split('T')[0]

export default function Eau({ onBack }) {
  const [verres, setVerres] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('eau_' + TODAY)
    if (saved) setVerres(parseInt(saved))
  }, [])

  const toggle = (i) => {
    const nouveau = i < verres ? i : i + 1
    setVerres(nouveau)
    localStorage.setItem('eau_' + TODAY, nouveau)
  }

  const pct = Math.round((verres / OBJECTIF) * 100)

  return (
    <div className="module">
      <button className="module-back" onClick={onBack}>← Retour</button>

      <div className="module-header">
        <div className="module-title">Hydratation</div>
        <div className="module-sub">Objectif : {OBJECTIF} verres (2L) par jour</div>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
        <div className="stat-box">
          <div className="stat-box-label">Aujourd'hui</div>
          <div className="stat-box-value" style={{color: 'var(--blue)'}}>{verres}</div>
          <div className="stat-box-sub">verres</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Objectif</div>
          <div className="stat-box-value">{OBJECTIF}</div>
          <div className="stat-box-sub">verres / jour</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">Progression</div>
          <div className="stat-box-value" style={{color: verres >= OBJECTIF ? 'var(--green)' : 'var(--orange)'}}>{pct}%</div>
          <div className="stat-box-sub">{verres >= OBJECTIF ? 'Objectif atteint' : `${OBJECTIF - verres} restants`}</div>
        </div>
      </div>

      <div className="prog-card">
        <div className="prog-header">
          <div className="prog-label">Progression du jour</div>
          <div className="prog-pct" style={{color: 'var(--blue)'}}>{pct}%</div>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{width: `${Math.min(pct, 100)}%`, background: 'var(--blue)'}} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Cliquez pour ajouter un verre</div>
        <div className="eau-grid">
          {Array.from({length: OBJECTIF}).map((_, i) => (
            <div key={i} className={`eau-verre ${i < verres ? 'plein' : ''}`} onClick={() => toggle(i)}>
              {i < verres ? '💧' : ''}
            </div>
          ))}
        </div>
        <div style={{marginTop: '1rem'}}>
          <button className="btn" onClick={() => { setVerres(0); localStorage.setItem('eau_' + TODAY, 0) }}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}