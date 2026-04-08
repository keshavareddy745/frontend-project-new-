import { useEffect, useState } from 'react'
import {
  addFeedback,
  getUpdates,
  getResponses
} from '../store.js'

export default function Citizen() {
  const [report, setReport] = useState({
    title: '',
    description: '',
    citizenName: ''
  })

  const [feedback, setFeedback] = useState({
    message: '',
    citizenName: ''
  })

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const [updates, setUpdates] = useState(() => getUpdates())
  const [responses, setResponses] = useState(() => getResponses())

  const fetchReports = async () => {
    try {
      const res = await fetch('https://backendproject-6-0sai.onrender.com/api/posts')
      const data = await res.json()
      setReports(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(() => {
      setUpdates(getUpdates())
      setResponses(getResponses())
      fetchReports()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  async function submitReport(e) {
    e.preventDefault()

    if (!report.title || !report.description || !report.citizenName) {
      alert('Please fill all fields')
      return
    }

    try {
      const res = await fetch('https://backendproject-6-0sai.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      })

      if (!res.ok) {
        throw new Error('Failed to create report')
      }

      const created = await res.json()
      setReports(prev => [...prev, created])

      setReport({
        title: '',
        description: '',
        citizenName: ''
      })

      alert('Issue submitted successfully')
    } catch (err) {
      console.error('Error creating report:', err)
      alert('Failed to submit issue')
    }
  }

  function submitFeedback(e) {
    e.preventDefault()

    if (!feedback.message || !feedback.citizenName) {
      alert('Please fill all feedback fields')
      return
    }

    addFeedback({
      id: Date.now(),
      message: feedback.message,
      citizenName: feedback.citizenName
    })

    setFeedback({ message: '', citizenName: '' })
    alert('Feedback submitted')
  }

  const getLatestResponse = reportId => {
    return [...responses].reverse().find(r => r.reportId === reportId)
  }

  return (
    <section>
      <h2>Citizen Dashboard</h2>

      <div className="grid">
        <form className="card" onSubmit={submitReport}>
          <h3>Report an Issue</h3>
          <input
            type="text"
            placeholder="Your name"
            value={report.citizenName}
            onChange={e =>
              setReport(prev => ({ ...prev, citizenName: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Issue title"
            value={report.title}
            onChange={e =>
              setReport(prev => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Issue description"
            value={report.description}
            onChange={e =>
              setReport(prev => ({ ...prev, description: e.target.value }))
            }
          />
          <button type="submit">Submit Issue</button>
        </form>

        <form className="card" onSubmit={submitFeedback}>
          <h3>Send Feedback</h3>
          <input
            type="text"
            placeholder="Your name"
            value={feedback.citizenName}
            onChange={e =>
              setFeedback(prev => ({ ...prev, citizenName: e.target.value }))
            }
          />
          <textarea
            placeholder="Your feedback"
            value={feedback.message}
            onChange={e =>
              setFeedback(prev => ({ ...prev, message: e.target.value }))
            }
          />
          <button type="submit">Submit Feedback</button>
        </form>

        <div className="card">
          <h3>Announcements</h3>
          {updates.length === 0 ? (
            <p>No announcements yet.</p>
          ) : (
            <ul>
              {updates.map(item => (
                <li key={item.id}>
                  <strong>{item.title}</strong> — {item.content} <em>({item.politicianName})</em>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Your Submitted Issues</h3>
          {loading ? (
            <p>Loading...</p>
          ) : reports.length === 0 ? (
            <p>No issues submitted yet.</p>
          ) : (
            <ul>
              {reports.map(r => {
                const latest = getLatestResponse(r.id)
                return (
                  <li key={r.id}>
                    <strong>{r.title}</strong> — {r.description} <em>({r.citizenName})</em>
                    <br />
                    <strong>Status:</strong> {latest?.status || 'open'}
                    {latest?.message && (
                      <>
                        <br />
                        <strong>Politician Review:</strong> {latest.message} <em>({latest.politicianName})</em>
                      </>
                    )}
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