import { useEffect, useState } from 'react'
import { fetchPostsFromBackend, updatePostInBackend, getFeedback, getFlags, addFlag } from '../store.js'

export default function Moderator() {
  const [reason, setReason] = useState('')
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const feedback = getFeedback()
  const flags = getFlags()

  const fetchData = async () => {
    try {
      const posts = await fetchPostsFromBackend()
      setAllPosts(Array.isArray(posts) ? posts : [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  const reports = allPosts.filter(p => !p.role || p.role === 'citizen')
  const politicianNews = allPosts.filter(p => p.role === 'politician')

  async function toggleImportant(post) {
    try {
      const updated = { ...post, isImportant: !post.isImportant }
      await updatePostInBackend(post._id || post.id, updated)
      alert(updated.isImportant ? 'Marked as Important' : 'Removed from Important')
      fetchData()
    } catch (err) {
      console.error('Failed to update importance:', err)
      alert('Error updating status')
    }
  }

  function flagItem(type, id) {
    if (!reason) {
      alert('Please provide a reason for flagging')
      return
    }
    addFlag({ type, refId: id, reason })
    setReason('')
    alert('Item flagged for review')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Moderator Dashboard</h2>
          <p>Monitor platform content and highlight important issues.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Reports</span>
          <span className="stat-value">{reports.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Important Items</span>
          <span className="stat-value">{allPosts.filter(p => p.isImportant).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Feedback</span>
          <span className="stat-value">{feedback.length}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Moderation Action</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <input 
            placeholder="Enter reason for flagging (inappropriate content)..." 
            value={reason} 
            onChange={e=>setReason(e.target.value)}
            style={{ flex: 1 }}
          />
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Flag items for removal or mark as important for politicians.
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Community Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {loading ? <p>Loading...</p> : reports.length === 0 ? <p style={{ color: '#94a3b8' }}>No reports.</p> : reports.map(r => (
              <div key={r._id || r.id} style={{ 
                padding: '1rem', 
                background: r.isImportant ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                borderLeft: r.isImportant ? '4px solid #f59e0b' : '4px solid #3b82f6',
                position: 'relative'
              }}>
                {r.isImportant && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    fontSize: '0.7rem', 
                    background: '#f59e0b', 
                    color: '#000', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>IMPORTANT</span>
                )}
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{r.title}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{r.description}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button 
                    className={`action-btn ${r.isImportant ? 'btn-secondary' : 'btn-warning'}`}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => toggleImportant(r)}
                  >
                    {r.isImportant ? 'Unmark Important' : 'Mark Important'}
                  </button>
                  <button 
                    className="action-btn btn-danger" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => flagItem('report', r._id || r.id)}
                  >
                    Flag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Politician News</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {loading ? <p>Loading...</p> : politicianNews.length === 0 ? <p style={{ color: '#94a3b8' }}>No news posted yet.</p> : politicianNews.map(n => (
              <div key={n._id || n.id} style={{ 
                padding: '1rem', 
                background: n.isImportant ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                borderLeft: n.isImportant ? '4px solid #f59e0b' : '4px solid #10b981',
                position: 'relative'
              }}>
                {n.isImportant && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '0.5rem', 
                    right: '0.5rem', 
                    fontSize: '0.7rem', 
                    background: '#f59e0b', 
                    color: '#000', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontWeight: 'bold'
                  }}>IMPORTANT</span>
                )}
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{n.title}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{n.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>By: {n.citizenName}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button 
                    className={`action-btn ${n.isImportant ? 'btn-secondary' : 'btn-warning'}`}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => toggleImportant(n)}
                  >
                    {n.isImportant ? 'Unmark Important' : 'Mark Important'}
                  </button>
                  <button 
                    className="action-btn btn-danger" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => flagItem('news', n._id || n.id)}
                  >
                    Flag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Flagged Content Logs</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          {flags.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No flags raised yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Item ID</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className="badge badge-danger" style={{ 
                        padding: '4px 10px', 
                        fontSize: '0.75rem',
                        borderRadius: '999px'
                      }}>
                        {f.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>#{f.refId}</td>
                    <td style={{ color: '#cbd5e1' }}>{f.reason}</td>
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(f.id).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
