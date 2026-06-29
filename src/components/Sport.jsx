import { useState } from 'react'
const PROGRAMME = {
  1: { jour: 'Lundi', focus: 'BIGG – Hamstring', calories: 380, blocs: [
    { nom: 'Strength', type: 'Lower accessory • 8\'', exercices: '3 rounds: Banded Glute Bridge Abduction (15), SKB Single-Leg Hip Thrust (10/10), Banded Good Morning (12)' },
    { nom: 'Strength Barbell', type: 'Barbell • 12\'', exercices: 'Glute Bridge Hold + Abductions, Good Morning, puis Barbell Deadlift 3x6 + 2x5, AMRAP SKB Single-Leg RDL + KB Sumo Deadlift' },
    { nom: 'HRX Training', type: 'Hard work – AMRAP • 12\'', exercices: 'Wall Ball (10), Box Jumps (10), Machine 40", Toes to Bar (10), DDB Thruster (10), DDB Devil Clean (10), Machine 40"' },
    { nom: 'Midline', type: 'Midline stone – AMRAP • 8\'', exercices: 'Bumper Russian Twists (10), Plank Bumper Drag (8/8), MB Hollow Rock (12)' }
  ], midi: 'Bowl avocat-oeufs', soir: 'Poilée poulet-champignons + riz' },
  2: { jour: 'Mardi', focus: 'BIGG – Dos', calories: 360, blocs: [
    { nom: 'Traditional Hypertrophy', type: 'Push accessory • 6\'', exercices: '2 rounds: DDB Lateral Flys (12), DDB Front Flys (10), DDB Reverse Flys (10)' },
    { nom: 'Strength', type: 'Upper strong • 14\'', exercices: 'Front Step + Thoracic Rotation, Superman Hold, puis Weighted Strict Pull Ups 3x6 + 2x5, AMRAP TRX Face Pull + DDB Incline Hammer Biceps Curls' },
    { nom: 'Traditional Hypertrophy', type: 'Upper accessory • 14\'', exercices: '4 rounds: DKB Z-Press (10), DKB High Pull (10), Seated DDB Reverse Flys (12)' },
    { nom: 'Midline', type: 'Asymmetry work – AMRAP • 6\'', exercices: 'Lateral V-Sit Ups (10), KB Russian Twist (12), Banded Dead Bug (10)' }
  ], midi: 'Salade avocat-poulet', soir: 'Omelette champignons + salade' },
  3: { jour: 'Mercredi', focus: 'BIGG – Épaules / Fessiers', calories: 390, blocs: [
    { nom: 'BIGGinners', type: 'Lower strong – AMRAP • 8\'', exercices: 'Goblet Sumo Squat (10), DDB Front Rack Lunges (8/8), Single-Leg Glute Bridge (10/10)' },
    { nom: 'Strength Barbell', type: 'Barbell • 12\'', exercices: 'Glute Bridge Hold + Abductions, Banded Clamshell, puis Barbell Hip Thrust 3x6 + 2x5, AMRAP KB Sumo Deadlift + Platform Deficit Lateral Lunges' },
    { nom: 'Strength', type: 'Upper strong • 12\'', exercices: 'TRX Face Pull, Quadruped Shoulder Taps, puis Barbell Shoulder Press 3x6 + 2x5, AMRAP Seated DDB Arnold Press + SKB Overhead Triceps Extensions' },
    { nom: 'Combined Strength', type: 'Finisher – AMRAP • 8\'', exercices: 'Goblet Thrusters (8), DKB Devil Clean (5), DDB Thrusters (6)' }
  ], midi: 'Boeuf sauté carottes-champignons', soir: 'Burger maison allégé' },
  4: { jour: 'Jeudi', focus: 'BIGG – Jambes', calories: 420, blocs: [
    { nom: 'Strength', type: 'Lower accessory • 7\'', exercices: '3 rounds: Goblet Lateral Box Step Up (8/8), Goblet Lateral Lunges (10/10), Banded Reverse Lunges + Squat (10/10)' },
    { nom: 'Strength Barbell', type: 'Barbell • 13\'', exercices: 'Banded Wall Squat Hold + Abduction, Banded Squat + Lateral Leg Raises, puis DKB Farmer Bulgarian Squat 3x3/3 + 2x2/2, AMRAP Goblet Bulgarian Squat Jump + DKB Split Stance Deadlift' },
    { nom: 'HIIT', type: 'Speed power – 30\'on/30\'off • 13\'', exercices: 'SKB Single-Arm Swing (1\'), Goblet Cossacks (2\'), DKB Renegade Rows (3\'), Goblet Squat Jump (1\')' },
    { nom: 'HIIT', type: 'Bodyweight – 30\'on/30\'off • 7\'', exercices: 'Mountain Climbers (1\'), Tuck Jumps (2\'), Jumping Jacks (3\'), Squat Jump + Lateral Lunges (1\')' }
  ], midi: 'Omelette champignons-fines herbes', soir: 'Poilée poulet + légumes' },
  5: { jour: 'Vendredi', focus: 'BIGG – Poitrine', calories: 370, blocs: [
    { nom: 'Traditional Hypertrophy', type: 'Push accessory • 6\'', exercices: '4 rounds: DDB Chest Press (10), Push Up Hold (5"), Push Ups (10)' },
    { nom: 'Traditional Hypertrophy', type: 'Complete • 13\'', exercices: '3 rounds: DDB Incline Press (12-10-10), DDB Chest Flys (12-12-12), DDB Opener Chest (12/12)' },
    { nom: 'Full Body Hypertrophy', type: 'Upper body • 12\'', exercices: '4 rounds: Barbell Bench Press (10), Tempo Barbell Bench Press Down (5), DDB Chest Flys (15), Push Up Hold (10")' },
    { nom: 'Full Body', type: 'Finisher • 7\'', exercices: '5 rounds: Sprawls (4), Jumping Jacks (20), Jumping Squats (4)' }
  ], midi: 'Bowl avocat-oeufs', soir: 'Boeuf sauté carottes-champignons' },
  6: { jour: 'Samedi', focus: 'Marche active', calories: 150, blocs: [], midi: null, soir: null },
  0: { jour: 'Dimanche', focus: 'Repos', calories: 0, blocs: [], midi: null, soir: null }
}

export default function Sport({ onBack }) {
  const [ouvert, setOuvert] = useState(null)
  const aujourdhui = new Date().getDay()
  const seance = PROGRAMME[aujourdhui]

  return (
    <div className="module">
      <button className="module-back" onClick={onBack}>← Retour</button>

      <div className="module-header">
        <div className="module-title">🏋️ {seance.focus}</div>
        <div className="module-sub">Programme BIGG — {seance.jour}</div>
      </div>

      {seance.calories > 0 && (
        <div className="kcal-banner">~{seance.calories} kcal estimées</div>
      )}

      {seance.blocs.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '3rem', color: '#555'}}>
          {aujourdhui === 6 ? '🚶 Journée marche — profitez de l\'air libre !' : '😴 Journée repos — récupération !'}
        </div>
      ) : (
        <div>
          {seance.blocs.map((bloc, i) => (
            <div key={i} className="bloc-item" onClick={() => setOuvert(ouvert === i ? null : i)}>
              <div className="bloc-header">
                <span className="bloc-num">Bloc {i + 1}</span>
                <span className="bloc-nom">{bloc.nom}</span>
                <span className="bloc-tag">{bloc.type}</span>
              </div>
              {ouvert === i && (
  <div className="bloc-desc">
    {bloc.exercices.split(', ').map((ex, j) => (
      <div key={j} style={{padding: '0.25rem 0', borderBottom: '1px solid #1e1e1e'}}>
        {ex}
      </div>
    ))}
  </div>
)}
            </div>
          ))}
        </div>
      )}

      {(seance.midi || seance.soir) && (
        <div className="card" style={{marginTop: '1rem'}}>
          <div className="card-title">🍽️ Repas du jour</div>
          {seance.midi && (
            <div className="repas-row">
              <span className="repas-label">Midi</span>
              <span>{seance.midi}</span>
            </div>
          )}
          {seance.soir && (
            <div className="repas-row">
              <span className="repas-label">Soir</span>
              <span>{seance.soir}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}