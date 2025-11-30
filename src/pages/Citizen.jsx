import { useState } from 'react'
import { addReport, addFeedback, getUpdates, getReports, getResponses } from '../store.js'

export default function Citizen() {
  const [report, setReport] = useState({ title: '', description: '', citizenName: '' })
  const [feedback, setFeedback] = useState({ message: '', citizenName: '' })
  const updates = getUpdates()
  const [reports, setReports] = useState(() => getReports())
  const [responses, setResponses] = useState(() => getResponses())

  function submitReport(e) {
    e.preventDefault()
    if (!report.title || !report.description) return
    addReport(report)
    setReport({ title: '', description: '', citizenName: '' })
    alert('Issue reported')
    setReports(getReports())
  }

  function submitFeedback(e) {
    e.preventDefault()
    if (!feedback.message) return
    addFeedback(feedback)
    setFeedback({ message: '', citizenName: '' })
    alert('Feedback submitted')
    setResponses(getResponses())
  }

  return (
    <section>
      <h2>Citizen Portal</h2>
      <div className="grid">
        <form className="card" onSubmit={submitReport}>
          <h3>Report an Issue</h3>
          <input placeholder="Your name" value={report.citizenName} onChange={e=>setReport(r=>({ ...r, citizenName: e.target.value }))} />
          <input placeholder="Title" value={report.title} onChange={e=>setReport(r=>({ ...r, title: e.target.value }))} />
          <textarea placeholder="Description" value={report.description} onChange={e=>setReport(r=>({ ...r, description: e.target.value }))} />
          <button type="submit">Submit Issue</button>
        </form>

        <form className="card" onSubmit={submitFeedback}>
          <h3>Provide Feedback</h3>
          <input placeholder="Your name" value={feedback.citizenName} onChange={e=>setFeedback(f=>({ ...f, citizenName: e.target.value }))} />
          <textarea placeholder="Message" value={feedback.message} onChange={e=>setFeedback(f=>({ ...f, message: e.target.value }))} />
          <button type="submit">Submit Feedback</button>
        </form>

        <div className="card">
          <h3>Latest Updates from Politicians</h3>
          {updates.length === 0 ? <p>No updates yet.</p> : (
            <ul>
              {updates.map(u => (
                <li key={u.id}>
                  <strong>{u.title}</strong> — {u.content} <em>({u.politicianName})</em>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Solved Issues</h3>
          {reports.filter(r=>r.status==='solved').length === 0 ? <p>No solved issues yet.</p> : (
            <ul>
              {reports.filter(r=>r.status==='solved').map(r => {
                const lastResponse = [...responses].reverse().find(x => x.reportId === r.id)
                return (
                  <li key={r.id}>
                    <strong>{r.title}</strong> — {r.description}
                    {lastResponse ? <span> — {lastResponse.message} <em>({lastResponse.politicianName})</em></span> : null}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
