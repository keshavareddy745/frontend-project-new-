import { useState } from 'react'
import { getReports, getFeedback, getUpdates, getResponses, getFlags, addFlag } from '../store.js'

export default function Moderator() {
  const [reason, setReason] = useState('')
  const reports = getReports()
  const feedback = getFeedback()
  const updates = getUpdates()
  const responses = getResponses()
  const flags = getFlags()

  function flagItem(type, id) {
    if (!reason) return
    addFlag({ type, refId: id, reason })
    setReason('')
    alert('Item flagged')
  }

  return (
    <section className="container">
      <h2>Moderator Dashboard</h2>
      <div className="card">
        <input placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
      </div>

      <div className="grid">
        <div className="card">
          <h3>Reports</h3>
          <ul>
            {reports.map(r => (
              <li key={r.id}>
                <strong>{r.title}</strong> — {r.description}
                <button style={{ marginLeft: '0.5rem' }} onClick={() => flagItem('report', r.id)}>Flag</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Feedback</h3>
          <ul>
            {feedback.map(f => (
              <li key={f.id}>
                {f.message} <em>({f.citizenName || 'Anonymous'})</em>
                <button style={{ marginLeft: '0.5rem' }} onClick={() => flagItem('feedback', f.id)}>Flag</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Updates</h3>
          <ul>
            {updates.map(u => (
              <li key={u.id}>
                <strong>{u.title}</strong> — {u.content}
                <button style={{ marginLeft: '0.5rem' }} onClick={() => flagItem('update', u.id)}>Flag</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Responses</h3>
          <ul>
            {responses.map(r => (
              <li key={r.id}>
                {r.message} <em>({r.politicianName || 'Politician'})</em>
                <button style={{ marginLeft: '0.5rem' }} onClick={() => flagItem('response', r.id)}>Flag</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card section">
        <h3>Flags</h3>
        {flags.length === 0 ? <p>No flags.</p> : (
          <ul>
            {flags.map(f => (
              <li key={f.id}>
                [{f.type}] {f.refId} — {f.reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
