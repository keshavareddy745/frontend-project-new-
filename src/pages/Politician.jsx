import { useEffect, useState } from 'react'
import {
  addUpdate,
  addResponse,
  getUpdates,
  getResponses
} from '../store.js'

export default function PoliticianDashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    politicianName: ''
  })

  const [review, setReview] = useState({})

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
    const interval = setInterval(fetchReports, 3000)
    return () => clearInterval(interval)
  }, [])

  function submitAnnouncement(e) {
    e.preventDefault()
    if (!announcement.title || !announcement.content || !announcement.politicianName) {
      alert('Please fill all announcement fields')
      return
    }

    addUpdate({
      id: Date.now(),
      title: announcement.title,
      content: announcement.content,
      politicianName: announcement.politicianName
    })

    setUpdates(getUpdates())
    setAnnouncement({ title: '', content: '', politicianName: '' })
    alert('Announcement posted')
  }

  function submitReview(e, reportId) {
    e.preventDefault()

    const current = review[reportId]
    if (!current?.message || !current?.politicianName || !current?.status) {
      alert('Please fill all review fields')
      return
    }

    addResponse({
      id: Date.now(),
      reportId,
      message: current.message,
      politicianName: current.politicianName,
      status: current.status
    })

    setResponses(getResponses())
    setReview(prev => ({
      ...prev,
      [reportId]: { message: '', politicianName: '', status: '' }
    }))

    alert('Review submitted')
  }

  const getLatestResponse = reportId => {
    return [...responses].reverse().find(r => r.reportId === reportId)
  }

  return (
    <section>
      <h2>Politician Dashboard</h2>

      <div className="grid">
        <form className="card" onSubmit={submitAnnouncement}>
          <h3>Post Announcement</h3>
          <input
            type="text"
            placeholder="Politician name"
            value={announcement.politicianName}
            onChange={e =>
              setAnnouncement(prev => ({ ...prev, politicianName: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Announcement title"
            value={announcement.title}
            onChange={e =>
              setAnnouncement(prev => ({ ...prev, title: e.target.value }))
            }
          />
          <textarea
            placeholder="Announcement content"
            value={announcement.content}
            onChange={e =>
              setAnnouncement(prev => ({ ...prev, content: e.target.value }))
            }
          />
          <button type="submit">Post Announcement</button>
        </form>

        <div className="card">
          <h3>Citizen Issues</h3>

          {loading ? (
            <p>Loading...</p>
          ) : reports.length === 0 ? (
            <p>No reports yet.</p>
          ) : (
            reports.map(report => {
              const latest = getLatestResponse(report.id)

              return (
                <div key={report.id} className="issue-box">
                  <h4>{report.title}</h4>
                  <p>{report.description}</p>
                  <p><strong>Citizen:</strong> {report.citizenName}</p>
                  <p>
                    <strong>Status:</strong> {latest?.status || 'open'}
                  </p>
                  {latest?.message && (
                    <p>
                      <strong>Latest Review:</strong> {latest.message} <em>({latest.politicianName})</em>
                    </p>
                  )}

                  <form onSubmit={e => submitReview(e, report.id)}>
                    <input
                      type="text"
                      placeholder="Politician name"
                      value={review[report.id]?.politicianName || ''}
                      onChange={e =>
                        setReview(prev => ({
                          ...prev,
                          [report.id]: {
                            ...prev[report.id],
                            politicianName: e.target.value
                          }
                        }))
                      }
                    />

                    <select
                      value={review[report.id]?.status || ''}
                      onChange={e =>
                        setReview(prev => ({
                          ...prev,
                          [report.id]: {
                            ...prev[report.id],
                            status: e.target.value
                          }
                        }))
                      }
                    >
                      <option value="">Select status</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <textarea
                      placeholder="Review message"
                      value={review[report.id]?.message || ''}
                      onChange={e =>
                        setReview(prev => ({
                          ...prev,
                          [report.id]: {
                            ...prev[report.id],
                            message: e.target.value
                          }
                        }))
                      }
                    />

                    <button type="submit">Submit Review</button>
                  </form>
                </div>
              )
            })
          )}
        </div>

        <div className="card">
          <h3>Posted Announcements</h3>
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
      </div>
    </section>
  )
}