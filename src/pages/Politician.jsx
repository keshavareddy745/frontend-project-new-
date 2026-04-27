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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Politician Dashboard</h2>
          <p>Manage community issues and post updates.</p>
        </div>
        <div className="dashboard-actions">
          <button className="action-btn btn-primary" onClick={() => document.getElementById('announcement-form').scrollIntoView({ behavior: 'smooth' })}>
            + New Announcement
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Pending Issues</span>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
          </div>
          <span className="stat-value">
            {reports.filter(r => !getLatestResponse(r.id)).length}
          </span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Resolved</span>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
          </div>
          <span className="stat-value">
            {reports.filter(r => getLatestResponse(r.id)?.status === 'resolved').length}
          </span>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Announcements</span>
            <span style={{ fontSize: '1.5rem' }}>📢</span>
          </div>
          <span className="stat-value">{updates.length}</span>
        </div>
      </div>

      <div className="grid">
        <div id="announcement-form" className="card">
          <h3>Post Announcement</h3>
          <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Your name"
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
              placeholder="Announcement content..."
              style={{ minHeight: '120px' }}
              value={announcement.content}
              onChange={e =>
                setAnnouncement(prev => ({ ...prev, content: e.target.value }))
              }
            />
            <button type="submit" className="action-btn btn-primary">Post Announcement</button>
          </form>
        </div>

        <div className="card">
          <h3>Your Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
            {updates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                <p>No announcements posted yet.</p>
              </div>
            ) : (
              updates.map(item => (
                <div key={item.id} style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '4px', 
                    height: '100%', 
                    background: '#3b82f6' 
                  }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '1.05rem' }}>{item.title}</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: 'rgba(15, 23, 42, 0.4)', padding: '2px 8px', borderRadius: '4px' }}>
                      Official
                    </span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: '1.5' }}>{item.content}</div>
                  <div style={{ 
                    marginTop: '1rem', 
                    paddingTop: '0.75rem', 
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    color: '#94a3b8'
                  }}>
                    <span>🖋️</span>
                    <span>{item.politicianName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Review Citizen Issues</h3>
        <div style={{ marginTop: '1rem' }}>
          {loading ? (
            <p>Loading issues...</p>
          ) : reports.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No issues to review.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reports.map(report => {
                const latest = getLatestResponse(report.id)
                const status = latest?.status || 'open'

                return (
                  <div key={report.id} style={{ 
                    padding: '1.5rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: 'rgba(59, 130, 246, 0.2)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          👤
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>{report.title}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>By {report.citizenName}</span>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }}></span>
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>ID: #{report.id.toString().slice(-4)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${status === 'resolved' ? 'badge-success' : 'badge-info'}`} style={{ 
                        padding: '6px 12px', 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '999px',
                        letterSpacing: '0.025em'
                      }}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>{report.description}</p>

                    {latest?.message && (
                      <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Latest Review
                        </div>
                        <div style={{ color: '#f8fafc' }}>{latest.message}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                          Reviewed by {latest.politicianName}
                        </div>
                      </div>
                    )}

                    <form onSubmit={e => submitReview(e, report.id)} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '-0.5rem' }}>
                        Update Issue Status
                      </div>
                      <input
                        type="text"
                        placeholder="Reviewer Name"
                        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
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
                        style={{ background: 'rgba(15, 23, 42, 0.6)' }}
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
                        <option value="">Select Status</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <textarea
                        placeholder="Provide detailed feedback or resolution steps..."
                        style={{ gridColumn: 'span 2', minHeight: '100px', background: 'rgba(15, 23, 42, 0.6)' }}
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

                      <button type="submit" className="action-btn btn-primary" style={{ gridColumn: 'span 2', padding: '0.75rem' }}>
                        Submit Official Review
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}