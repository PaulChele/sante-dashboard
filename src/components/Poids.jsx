import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { supabase } from '../lib/supabase'

const OBJECTIF = 75

export default function Poids({ onBack }) {
  const [data, setData] = useState([])
  const [poids, setPoids] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: rows } = await supabase.from('weights').select('*').order('date', { ascending: true })
    if (rows) {
      setData(rows.map(r => ({
        date: new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        poids: r.weight,
        id: r.id
      })))
    }
    setLoading(false)
  }

  const sauvegarder = async () => {
    if (!poids) return
    setSaving(true)
    await supabase.from('weights').insert({ date, weight: parseFloat(poids) })
    setPoids('')
    await fetchData()
    setSaving(false)
  }

  const supprimer = async (id) => {
    await supabase.from('weights').delete().eq('id', id)
    await fetchData()
  }

  const derniere = data[data.length - 1]
  const premiere = data[0]
  const perdu = derniere && premiere ? (derniere.poids - premiere.poids).toFixed(1) : null
  const reste = derniere ? (derniere.poids - OBJECTIF).toFixed(1) : null
  const progression = derniere && premiere && premiere.poids !== OBJECTIF
    ? Math.round(((premiere.poids - derniere.poids) / (premiere.poids - OBJECTIF)) * 100)
    : 0

  return (
    <div className="module">
      <button className="module-back" onClick={onBack}>← Retour</button>

      <div className="module-header">
        <div className="module-title">Poids</div>
        <div className="module-sub">Pesée chaque lundi matin à jeun · Objectif {OBJECTIF} kg</div>
      </div>

      {loading ? (
        <div className="empty">Chargement...</div>
      ) : (
        <>
          {data.length > 0 && (
            <>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-box-label">Départ</div>
                  <div className="stat-box-value">{premiere.poids}</div>
                  <div className="stat-box-sub">kg</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">Actuel</div>
                  <div className="stat-box-value">{derniere.poids}</div>
                  <div className="stat-box-sub">kg</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">Perdu</div>
                  <div className="stat-box-value" style={{color: perdu < 0 ? 'var(--green)' : 'var(--red)'}}>{perdu}</div>
                  <div className="stat-box-sub">kg depuis le début</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-label">Reste</div>
                  <div className="stat-box-value" style={{color: 'var(--orange)'}}>{reste}</div>
                  <div className="stat-box-sub">kg avant objectif</div>
                </div>
              </div>

              <div className="prog-card">
                <div className="prog-header">
                  <div className="prog-label">Progression vers {OBJECTIF} kg</div>
                  <div className="prog-pct">{Math.max(0, progression)}%</div>
                </div>
                <div className="prog-sub">{premiere.poids} kg → {OBJECTIF} kg</div>
                <div className="prog-track">
                  <div className="prog-fill" style={{width: `${Math.min(Math.max(0, progression), 100)}%`}} />
                </div>
              </div>

              <div className="card">
                <div className="card-title">Courbe de poids</div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorPoids" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--green)" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={v => `${v} kg`} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text)' }} formatter={v => [`${v} kg`, 'Poids']} />
                      <ReferenceLine y={OBJECTIF} stroke="var(--orange)" strokeDasharray="4 3" />
                      <Area type="monotone" dataKey="poids" stroke="var(--green)" strokeWidth={2} fill="url(#colorPoids)" dot={{ fill: 'var(--green)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div className="card-title">Historique</div>
                {[...data].reverse().map((entry, i) => (
                  <div key={i} className="hist-item">
                    <span className="hist-date">{entry.date}</span>
                    <span className="hist-value">{entry.poids} kg</span>
                    <button className="btn-danger" onClick={() => supprimer(entry.id)}>Suppr.</button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="card">
            <div className="card-title">Ajouter une pesée</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Poids (kg)</label>
                <input type="number" placeholder="90.0" value={poids} onChange={e => setPoids(e.target.value)} />
              </div>
              <button className="btn" onClick={sauvegarder} disabled={saving}>
                {saving ? '...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}