import { useEffect, useState } from 'react'
import {
  addFeedback,
  getUpdates,
  fetchPostsFromBackend,
  createPostInBackend
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
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)

  const getSafeId = (item) => {
    const id = item._id || item.id || '';
    return id.toString().slice(-6) || 'N/A';
  };

  const politicianAnnouncements = Array.isArray(reports) ? reports.filter(p => p.role === 'politician') : []
  const citizenIssues = Array.isArray(reports) ? reports.filter(p => (p.role === 'citizen' || !p.role) && p.status !== 'resolved' && p.status !== 'solved') : []
  const resolvedIssues = Array.isArray(reports) ? reports.filter(p => (p.role === 'citizen' || !p.role) && (p.status === 'resolved' || p.status === 'solved')) : []

  const [updates, setUpdates] = useState(() => getUpdates())

  const fetchReports = async (showSync = false) => {
    if (showSync) setSyncing(true)
    try {
      const data = await fetchPostsFromBackend()
      setReports(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      setError('Connection to government servers lost. Retrying...')
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(() => {
      setUpdates(getUpdates())
      fetchReports(true)
    }, 5000) // Increased to 5s to be less aggressive

    return () => clearInterval(interval)
  }, [])

  async function submitReport(e) {
    e.preventDefault()

    if (!report.title || !report.description || !report.citizenName) {
      alert('Please fill all fields')
      return
    }

    try {
      const created = await createPostInBackend({
        ...report,
        role: 'citizen',
        status: 'open'
      })

      setReports(prev => [...prev, created])

      setReport({
        title: '',
        description: '',
        citizenName: ''
      })

      alert('Issue submitted successfully ✅')
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
    alert('Feedback submitted ✅')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="dashboard-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Emblem_of_Andhra_Pradesh.svg/1200px-Emblem_of_Andhra_Pradesh.svg.png" 
              alt="AP Logo" 
              style={{ height: '80px', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}
            />
            <div>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '900', 
                margin: 0, 
                letterSpacing: '-0.03em', 
                background: 'linear-gradient(to right, var(--gov-blue-800), var(--gov-accent))', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Citizen <span style={{ color: 'var(--gov-accent)' }}>Portal</span>
              </h2>
              <p style={{ color: 'var(--gov-text-secondary)', fontSize: '1.1rem', margin: 0, fontWeight: '500' }}>
                Official Government Reporting & Information System • Andhra Pradesh
              </p>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => document.getElementById('report-form').scrollIntoView({ behavior: 'smooth' })}>
            File Official Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Your Active Reports</span>
              <span className="stat-value">{citizenIssues.length}</span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
          </div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Official Bulletins</span>
              <span className="stat-value" style={{ color: 'var(--gov-accent)' }}>{politicianAnnouncements.length + updates.length}</span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>📢</span>
          </div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Case Resolutions</span>
              <span className="stat-value" style={{ color: 'var(--gov-success)' }}>
                {citizenIssues.filter(r => r.status === 'resolved' || r.status === 'solved').length}
              </span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>✅</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Reporting & Feedback */}
        <div className="col-span-8">
          <section id="report-form" className="mb-6">
            <div className="card">
              <h3 className="mb-6">Submit Formal Report</h3>
              <form onSubmit={submitReport} className="gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Full Legal Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={report.citizenName}
                    onChange={e => setReport(prev => ({ ...prev, citizenName: e.target.value }))}
                  />
                </div>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Subject of Concern</label>
                  <input
                    type="text"
                    placeholder="Brief title of the issue"
                    value={report.title}
                    onChange={e => setReport(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Detailed Description</label>
                  <textarea
                    placeholder="Provide a comprehensive description of the situation..."
                    style={{ minHeight: '150px' }}
                    value={report.description}
                    onChange={e => setReport(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>File Official Report</button>
              </form>
            </div>
          </section>

          <section>
            <div className="card">
              <h3 className="mb-6">Public Feedback Channel</h3>
              <p className="text-secondary mb-6">Direct communication for platform improvement and service suggestions.</p>
              <form onSubmit={submitFeedback} className="gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Contributor Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={feedback.citizenName}
                    onChange={e => setFeedback(prev => ({ ...prev, citizenName: e.target.value }))}
                  />
                </div>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Feedback/Suggestions</label>
                  <textarea
                    placeholder="Share your thoughts with the administrative team..."
                    style={{ minHeight: '100px' }}
                    value={feedback.message}
                    onChange={e => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-success" style={{ alignSelf: 'flex-start' }}>Submit Feedback</button>
              </form>
            </div>
          </section>
        </div>

        {/* Right Column: Announcements & Status */}
        <div className="col-span-4">
          <section className="mb-6">
            <div className="card" style={{ borderTop: '4px solid var(--gov-accent)' }}>
              <h3 className="mb-6">Official Bulletins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {politicianAnnouncements.length === 0 && updates.length === 0 ? (
                  <p className="text-secondary" style={{ fontStyle: 'italic' }}>No active bulletins issued.</p>
                ) : (
                  <>
                    {politicianAnnouncements.map(item => (
                      <div key={item._id || item.id || Math.random()} style={{ 
                        padding: '1.25rem', 
                        background: 'rgba(16, 185, 129, 0.05)', 
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--gov-success)'
                      }}>
                        <div className="flex-between mb-2">
                          <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.title}</h4>
                          <span className="badge badge-success">Official</span>
                        </div>
                        <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>{item.description}</p>
                        <small className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ref: #{getSafeId(item)}</small>
                      </div>
                    ))}

                    {updates.map(item => (
                      <div key={item.id} style={{ 
                        padding: '1.25rem', 
                        background: 'rgba(59, 130, 246, 0.05)', 
                        borderRadius: '12px',
                        borderLeft: '4px solid var(--gov-accent)'
                      }}>
                        <div className="flex-between mb-2">
                          <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.title}</h4>
                          <span className="badge badge-info">Community</span>
                        </div>
                        <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>{item.content}</p>
                        <small className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>By {item.politicianName}</small>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="card">
              <h3 className="mb-6">Resolution Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {citizenIssues.length === 0 && resolvedIssues.length === 0 ? (
                  <p className="text-secondary" style={{ fontStyle: 'italic' }}>No reports filed.</p>
                ) : (
                  <>
                    {citizenIssues.slice(0, 3).map(issue => (
                      <div key={issue._id || issue.id || Math.random()} className="flex-between" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{issue.title}</div>
                          <small className="text-secondary">Ref: #{getSafeId(issue)}</small>
                        </div>
                        <span className="badge badge-warning">Pending</span>
                      </div>
                    ))}
                    {resolvedIssues.slice(0, 3).map(issue => (
                      <div key={issue._id || issue.id || Math.random()} className="flex-between" style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{issue.title}</div>
                          <small className="text-secondary">Ref: #{getSafeId(issue)}</small>
                        </div>
                        <span className="badge badge-success">Fixed</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
