import { useEffect, useState } from 'react'
import {
  addFeedback,
  getUpdates,
  getReports,
  getResponses,
  fetchPostsFromBackend,
  createPostInBackend
} from '../store.js'

export default function Citizen() {
  const [report, setReport] = useState({ title: '', description: '', citizenName: '' })
  const [feedback, setFeedback] = useState({ message: '', citizenName: '' })

  const updates = getUpdates()
  const [reports, setReports] = useState(() => getReports())
  const [responses, setResponses] = useState(() => getResponses())

  // Load reports from backend on mount (optional mapping to your local structure)
  useEffect(() => {
    fetchPostsFromBackend()
      .then(posts => {
        // Map backend posts -> local "reports" shape
        const mapped = posts.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          citizenName: p.citizenName,
          status: 'open',
          createdAt: new Date().toISOString()
        }))
        setReports(mapped)
      })
      .catch(err => {
        console.error('Failed to load reports from backend:', err)
      })
  }, [])

  async function submitReport(e) {
    e.preventDefault()
    if (!report.title || !report.description) return

    try {
      // send to backend
      const created = await createPostInBackend({
        title: report.title,
        description: report.description,
        citizenName: report.citizenName
      })

      // update UI with new report
      setReports(prev => [
        ...prev,
        {
          id: created.id,
          title: created.title,
          description: created.description,
          citizenName: created.citizenName,
          status: 'open',
          createdAt: new Date().toISOString()
        }
      ])

      setReport({ title: '', description: '', citizenName: '' })
      alert('Issue reported (saved in backend)')
    } catch (err) {
      console.error('Error creating report:', err)
      alert('Failed to report issue. Please try again.')
    }
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
          <input
            placeholder="Your name"
            value={report.citizenName}
            onChange={e => setReport(r => ({ ...r, citizenName: e.target.value }))}
          />
          <input
            placeholder="Title"
            value={report.title}
            onChange={e => setReport(r => ({ ...r, title: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            value={report.description}
            onChange={e => setReport(r => ({ ...r, description: e.target.value }))}
          />
          <button type="submit">Submit Issue</button>
        </form>

        <form className="card" onSubmit={submitFeedback}>
          <h3>Provide Feedback</h3>
          <input
            placeholder="Your name"
            value={feedback.citizenName}
            onChange={e => setFeedback(f => ({ ...f, citizenName: e.target.value }))}
          />
          <textarea
            placeholder="Message"
            value={feedback.message}
            onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))}
          />
          <button type="submit">Submit Feedback</button>
        </form>

        <div className="card">
          <h3>Latest Updates from Politicians</h3>
          {updates.length === 0 ? (
            <p>No updates yet.</p>
          ) : (
            <ul>
              {updates.map(u => (
                <li key={u.id}>
                  <strong>{u.title}</strong> — {u.content}{' '}
                  <em>({u.politicianName})</em>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Solved Issues</h3>
          {reports.filter(r => r.status === 'solved').length === 0 ? (
            <p>No solved issues yet.</p>
          ) : (
            <ul>
              {reports
                .filter(r => r.status === 'solved')
                .map(r => {
                  const lastResponse = [...responses]
                    .reverse()
                    .find(x => x.reportId === r.id)
                  return (
                    <li key={r.id}>
                      <strong>{r.title}</strong> — {r.description}
                      {lastResponse ? (
                        <span>
                          {' '}
                          — {lastResponse.message}{' '}
                          <em>({lastResponse.politicianName})</em>
                        </span>
                      ) : null}
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