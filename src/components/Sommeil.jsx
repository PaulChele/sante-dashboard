import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../lib/supabase'

export default function Sommeil({ onBack }) {
  const [data, setData] = useState([])
  const [coucher, setCoucher] = useState('')
  const [reveil, setReveil] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    const depuis = new Date()
    depuis.setDate(depuis.getDate() - 30)
    const { data: rows } = await supabase
      .from('sleep')
      .select('*')
      .gte('date', depuis.toISOString().split('T')[0])
      .order('date', { ascending: true })
    if (rows) {
      setData(rows.map(r => ({
        date: new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        duree: r.duration,
        notes: r.notes,
        id: r.id
      })))
    }
    setLoading(false)
  }

  const calculerDuree = () => {
    if (!coucher || !reveil) return null
    const [hC, mC] = coucher.split(':').map(Number)
    const [hR, mR] = reveil.split(':').map(Number)
    let minutes = (hR * 60 + mR) - (hC * 60 + mC)
    if (minutes < 0) minutes += 24 * 60
    return Math.round(minutes / 60 * 10) / 10
  }

  const sauvegarder = async () => {
    const duree = calculerDuree()
    if (!duree) return
    setSaving(true)
    await supabase.from('sleep').insert({
      date: new Date().toISOString().split('T')[0],
      duration: duree,
      notes: note || null,
    })
    setCoucher('')
    setReveil('')
    setNote('')
    await fetchData()
    setSaving(false)
  }

  const supprimer = async (id) => {
    await supabase.from('sleep').delete().eq('id', id)
    await fetchData()
  }

  const dureeCalculee = calculerDuree()
  const derniere = data[data.length - 1]
  const moyenne = data.length > 0
    ? (data.reduce((a, b) => a + b.duree, 0) / data.length).toFixed(1)
    : null

  return (
    <div className="module">
      <button className="module-back" onClick={onBack}>← Retour</button>

      <div className="module-header">
        <div className="module-title">😴 Sommeil</div>
        <div className="module-sub">Objectif : 8h par nuit</div>
      </div>

      {!loading && data.length > 0 && (
        <>
          <div className="stats-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
            <div className="stat-box">
              <div className="stat-box-label">Dernière nuit</div>
              <div className="stat-box-value" style={{color: derniere.duree >= 7 ? '#4ade80' : '#fb923c'}}>{derniere.duree}h</div>
              <div className="stat-box-sub">{derniere.duree >= 7 ? 'Bonne nuit' : 'Insuffisant'}</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Moyenne 30j</div>
              <div className="stat-box-value">{moyenne}h</div>
              <div className="stat-box-sub">par nuit</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Objectif</div>
              <div className="stat-box-value">8h</div>
              <div className="stat-box-sub">par nuit</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Évolution du sommeil</div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#444' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[4, 10]} tick={{ fontSize: 11, fill: '#444' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12, color: '#f0f0f0' }} />
                  <Line type="monotone" dataKey="duree" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Historique</div>
            {[...data].reverse().map((entry, i) => (
              <div key={i} className="hist-item">
                <span className="hist-date">{entry.date}</span>
                <span className="hist-value">{entry.duree}h {entry.notes && <span style={{color:'#555', fontWeight:400, fontSize:'0.8rem'}}>— {entry.notes}</span>}</span>
                <button className="btn-danger" onClick={() => supprimer(entry.id)}>Suppr.</button>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && data.length === 0 && (
        <div className="empty">Aucune donnée — enregistrez votre première nuit !</div>
      )}

      <div className="card">
        <div className="card-title">Ajouter cette nuit</div>
        <div className="form-row" style={{marginBottom: '0.75rem'}}>
          <div className="form-group">
            <label className="form-label">Coucher</label>
            <input type="time" value={coucher} onChange={e => setCoucher(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Réveil</label>
            <input type="time" value={reveil} onChange={e => setReveil(e.target.value)} />
          </div>
        </div>

        {dureeCalculee && (
          <div className="duree-badge">⏱️ Durée : <strong>{dureeCalculee}h</strong></div>
        )}

        <div className="form-group" style={{marginTop: '0.75rem', marginBottom: '0.75rem'}}>
          <label className="form-label">Note (optionnel)</label>
          <input type="text" placeholder="ex: nuit agitée..." value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <button className="btn" onClick={sauvegarder} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}