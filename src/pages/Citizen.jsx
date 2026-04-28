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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Citizen Dashboard</h2>
          <p>Welcome back! Here's what's happening in your community.</p>
        </div>
        <div className="dashboard-actions">
          <button className="action-btn btn-primary" onClick={() => document.getElementById('report-form').scrollIntoView({ behavior: 'smooth' })}>
            + Report New Issue
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Your Issues</span>
          <span className="stat-value">{reports.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Announcements</span>
          <span className="stat-value">{updates.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">
            {reports.filter(r => getLatestResponse(r.id)?.status === 'resolved').length}
          </span>
        </div>
      </div>

      <div className="grid">
        <div id="report-form" className="card">
          <h3>Report an Issue</h3>
          <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              placeholder="Describe the issue in detail..."
              style={{ minHeight: '120px' }}
              value={report.description}
              onChange={e =>
                setReport(prev => ({ ...prev, description: e.target.value }))
              }
            />
            <button type="submit" className="action-btn btn-primary">Submit Report</button>
          </form>
        </div>

        <div className="card">
          <h3>Recent Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {updates.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No announcements yet.</p>
            ) : (
              updates.map(item => (
                <div key={item.id} style={{ 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{item.content}</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                    By {item.politicianName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', maxWidth: '600px' }}>
        <h3>Send Direct Feedback</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Your feedback helps us improve the platform and our services.
        </p>
        <form onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Your name"
            value={feedback.citizenName}
            onChange={e =>
              setFeedback(prev => ({ ...prev, citizenName: e.target.value }))
            }
          />
          <textarea
            placeholder="Your thoughts, suggestions, or feedback..."
            style={{ minHeight: '100px' }}
            value={feedback.message}
            onChange={e =>
              setFeedback(prev => ({ ...prev, message: e.target.value }))
            }
          />
          <button type="submit" className="action-btn btn-success">Send Feedback</button>
        </form>
      </div>
    </div>
  )
}