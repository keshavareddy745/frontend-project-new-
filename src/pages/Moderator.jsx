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

  const getSafeId = (item) => {
    const id = item._id || item.id || '';
    return id.toString().slice(-6) || 'N/A';
  };

  const reports = Array.isArray(allPosts) ? allPosts.filter(p => !p.role || p.role === 'citizen') : []
  const politicianNews = Array.isArray(allPosts) ? allPosts.filter(p => p.role === 'politician') : []

  async function toggleImportant(post) {
    try {
      const updated = { ...post, isImportant: !post.isImportant }
      await updatePostInBackend(post._id || post.id, updated)
      alert(updated.isImportant ? 'Marked as Important ✅' : 'Removed from Important')
      fetchData()
    } catch (err) {
      console.error('Failed to update importance:', err)
      alert('Error updating status')
    }
  }

  function flagItem(type, id) {
    if (!reason) {
      alert('Please provide a formal reason for flagging content.')
      return
    }
    addFlag({ type, refId: id, reason })
    setReason('')
    alert('Content flagged for administrative review ✅')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Compliance & Oversight</h2>
          <p>Official portal for platform moderation and content auditing.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Reports</span>
          <span className="stat-value">{reports.length}</span>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--gov-warning)' }}>
          <span className="stat-label">Highlighted Items</span>
          <span className="stat-value" style={{ color: 'var(--gov-warning)' }}>{allPosts.filter(p => p.isImportant).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Citizen Feedback</span>
          <span className="stat-value">{feedback.length}</span>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="mb-4">Content Moderation Toolkit</h3>
        <div className="flex-between gap-4">
          <input 
            placeholder="Provide justification for content flagging..." 
            value={reason} 
            onChange={e=>setReason(e.target.value)}
            style={{ flex: 1 }}
          />
          <p className="text-secondary" style={{ fontSize: '0.875rem', maxWidth: '300px', margin: 0 }}>
            Use this field to document reasons for flagging content before taking action on items below.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Community Content */}
        <div className="col-span-8">
          <div className="card">
            <h3 className="mb-6">Community Reporting Stream</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {loading ? (
                <p>Retrieving secure records...</p>
              ) : reports.length === 0 ? (
                <p className="text-secondary" style={{ fontStyle: 'italic' }}>No community reports found.</p>
              ) : (
                reports.map(r => (
                  <div key={r._id || r.id} style={{ 
                    padding: '1.25rem', 
                    background: r.isImportant ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255, 255, 255, 0.02)', 
                    borderRadius: '12px',
                    border: r.isImportant ? '1px solid var(--gov-warning)' : '1px solid var(--gov-border)',
                    borderLeft: r.isImportant ? '4px solid var(--gov-warning)' : '1px solid var(--gov-border)'
                  }}>
                    <div className="flex-between mb-4">
                      <h4 style={{ margin: 0 }}>{r.title}</h4>
                      {r.isImportant && <span className="badge badge-warning">Priority</span>}
                    </div>
                    <p className="text-secondary mb-6">{r.description}</p>
                    <div className="flex-between">
                      <div className="gap-2" style={{ display: 'flex' }}>
                        <button 
                          className={r.isImportant ? 'btn-primary' : 'btn-success'}
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => toggleImportant(r)}
                        >
                          {r.isImportant ? 'Lower Priority' : 'Escalate to Priority'}
                        </button>
                        <button 
                          className="btn-danger" 
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => flagItem('report', r._id || r.id)}
                        >
                          Flag Content
                        </button>
                      </div>
                      <small className="text-secondary">Ref: #{getSafeId(r)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Official Communications & Logs */}
        <div className="col-span-4">
          <section className="mb-6">
            <div className="card">
              <h3 className="mb-6">Official Bulletins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                  <p>Accessing...</p>
                ) : politicianNews.length === 0 ? (
                  <p className="text-secondary" style={{ fontStyle: 'italic' }}>No official news found.</p>
                ) : (
                  politicianNews.map(n => (
                    <div key={n._id || n.id} style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      borderRadius: '8px',
                      border: '1px solid var(--gov-border)'
                    }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>{n.title}</h4>
                      <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>{n.description}</p>
                      <div className="gap-2" style={{ display: 'flex' }}>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => toggleImportant(n)}
                        >
                          {n.isImportant ? 'Normal' : 'Pin'}
                        </button>
                        <button 
                          className="btn-danger" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                          onClick={() => flagItem('news', n._id || n.id)}
                        >
                          Flag
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="card">
              <h3 className="mb-6">Flagged Content Logs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {flags.length === 0 ? (
                  <p className="text-secondary" style={{ fontStyle: 'italic' }}>No flags logged.</p>
                ) : (
                  flags.slice(-5).reverse().map(f => (
                    <div key={f.id} style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <div className="flex-between mb-1">
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>{f.type}</span>
                        <small className="text-secondary">#{String(f.refId || '').slice(-4) || 'N/A'}</small>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{f.reason}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
