import { useEffect, useState } from 'react'
import { updatePostInBackend, fetchPostsFromBackend, createPostInBackend } from '../store'

export default function PoliticianDashboard() {
  const [allPosts, setAllPosts] = useState([])
  const [recentlyResolved, setRecentlyResolved] = useState(new Set())
  
  const getSafeId = (item) => {
    const id = item._id || item.id || '';
    return id.toString().slice(-6) || 'N/A';
  };

  const isActuallyResolved = (p) => {
    const id = String(p._id || p.id);
    return p.status === 'resolved' || p.status === 'solved' || recentlyResolved.has(id);
  };

  const activeReports = allPosts.filter(p => (!p.role || p.role === 'citizen') && !p.isImportant && !isActuallyResolved(p))
  const announcements = allPosts.filter(p => p.role === 'politician' && !p.isImportant)
  const importantItems = allPosts.filter(p => p.isImportant && !isActuallyResolved(p))
  const pendingIssues = Array.isArray(allPosts) ? allPosts.filter(r => !isActuallyResolved(r) && (r.status === 'open' || r.status === 'reviewing')) : []
  const solvedIssues = Array.isArray(allPosts) ? allPosts.filter(r => isActuallyResolved(r)) : []
  const [loading, setLoading] = useState(true)

  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    politicianName: ''
  })

  const [reviewData, setReviewData] = useState({
    postId: null,
    response: '',
    status: 'reviewing'
  })

  const fetchReports = async () => {
    try {
      const data = await fetchPostsFromBackend()
      if (Array.isArray(data)) {
        // Filter out items that we just resolved locally to prevent them from "coming back"
        // until the backend actually reflects the change.
        const filteredData = data.map(item => {
          const id = String(item._id || item.id);
          if (recentlyResolved.has(id)) {
            return { ...item, status: 'resolved' };
          }
          return item;
        });
        setAllPosts(filteredData)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    // Poll every 5 seconds
    const interval = setInterval(fetchReports, 5000)
    return () => clearInterval(interval)
  }, [recentlyResolved]) // Add recentlyResolved to dependencies to ensure fetch reflects local changes


  async function submitAnnouncement(e) {
    e.preventDefault()
    if (!announcement.title || !announcement.content || !announcement.politicianName) {
      alert('Please fill all fields')
      return
    }
    try {
      await createPostInBackend({
        title: announcement.title,
        description: announcement.content,
        citizenName: announcement.politicianName,
        role: 'politician'
      })
      alert('Announcement published successfully ✅')
      setAnnouncement({ title: '', content: '', politicianName: '' })
      fetchReports()
    } catch (err) {
      console.error(err)
      alert('Error saving announcement')
    }
  }

  async function submitReview(postId, forcedStatus = null) {
    if (!postId) return
    const statusToSubmit = forcedStatus || reviewData.status
    if (!reviewData.response && !forcedStatus) {
      alert('Please enter a response')
      return
    }
    try {
      const postToUpdate = allPosts.find(p => String(p._id || p.id) === String(postId))
      if (!postToUpdate) return
      const updatedPost = {
        ...postToUpdate,
        politicianResponse: reviewData.response || postToUpdate.politicianResponse || 'Issue marked as done.',
        status: statusToSubmit
      }
      if (statusToSubmit === 'resolved' || statusToSubmit === 'solved') {
        setRecentlyResolved(prev => new Set(prev).add(String(postId)))
      }

      setAllPosts(prev => prev.map(p => String(p._id || p.id) === String(postId) ? updatedPost : p))
      setReviewData({ postId: null, response: '', status: 'reviewing' })
      await updatePostInBackend(postId, updatedPost)
      alert(`Issue ${statusToSubmit === 'resolved' ? 'Resolved' : 'Updated'} successfully ✅`)
    } catch (err) {
      console.error('Failed to submit review:', err)
      fetchReports()
    }
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
                Politician <span style={{ color: 'var(--gov-accent)' }}>Portal</span>
              </h2>
              <p style={{ color: 'var(--gov-text-secondary)', fontSize: '1.1rem', margin: 0, fontWeight: '500' }}>
                Official Administrative Command Center • Government of Andhra Pradesh
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="badge badge-success" style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', borderRadius: '12px' }}>
            <span style={{ marginRight: '0.5rem' }}>●</span> Session Active
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Pending Issues</span>
              <span className="stat-value">{activeReports.length}</span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>📂</span>
          </div>
          <small style={{ color: 'var(--gov-text-secondary)', marginTop: '0.5rem' }}>Awaiting Official Review</small>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Priority Items</span>
              <span className="stat-value" style={{ color: 'var(--gov-warning)' }}>{importantItems.length}</span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          </div>
          <small style={{ color: 'var(--gov-text-secondary)', marginTop: '0.5rem' }}>Immediate Action Required</small>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--gov-success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Announcements</span>
              <span className="stat-value" style={{ color: 'var(--gov-success)' }}>{announcements.length}</span>
            </div>
            <span style={{ fontSize: '1.5rem' }}>📢</span>
          </div>
          <small style={{ color: 'var(--gov-text-secondary)', marginTop: '0.5rem' }}>Public Directives Active</small>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Priority & Active Issues */}
        <div className="col-span-8">
          {/* Priority Items */}
          <section className="mb-8">
            <div className="card" style={{ borderLeft: '4px solid var(--gov-warning)', background: 'rgba(245, 158, 11, 0.02)' }}>
              <div className="flex-between mb-8">
                <div>
                  <h3 style={{ margin: 0, color: 'var(--gov-warning)', fontSize: '1.5rem', fontWeight: '700' }}>⚠️ High-Priority Directives</h3>
                  <p className="text-secondary" style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Critical items requiring immediate administrative attention</p>
                </div>
                <span className="badge badge-warning">Priority 1</span>
              </div>
              
              {importantItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>✅</span>
                  <p className="text-secondary" style={{ fontStyle: 'italic', margin: 0 }}>All high-priority items have been cleared.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {importantItems.map(item => (
                    <div key={item._id || item.id} className="card" style={{ 
                      padding: '1.5rem', 
                      background: 'rgba(245, 158, 11, 0.05)', 
                      border: '1px solid rgba(245, 158, 11, 0.1)',
                      boxShadow: 'none'
                    }}>
                      <div className="flex-between mb-4">
                        <span className={`badge ${item.role === 'politician' ? 'badge-success' : 'badge-info'}`}>
                          {item.role === 'politician' ? 'INTERNAL NEWS' : 'CITIZEN DIRECTIVE'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <small className="text-secondary" style={{ fontWeight: '600' }}>Ref: #{getSafeId(item)}</small>
                          <span style={{ color: 'var(--gov-warning)', fontWeight: '800' }}>!</span>
                        </div>
                      </div>
                      <h4 className="mb-3" style={{ fontSize: '1.2rem', fontWeight: '700' }}>{item.title}</h4>
                      <p className="text-secondary mb-6" style={{ lineHeight: '1.6' }}>{item.description}</p>
                      
                      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {reviewData.postId === (item._id || item.id) ? (
                          <div className="gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
                            <textarea
                              placeholder="Draft formal administrative response..."
                              style={{ minHeight: '100px', fontSize: '1rem' }}
                              value={reviewData.response}
                              onChange={e => setReviewData(prev => ({ ...prev, response: e.target.value }))}
                            />
                            <div className="flex-between gap-3">
                              <select 
                                value={reviewData.status}
                                onChange={e => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                                style={{ flex: 1 }}
                              >
                                <option value="reviewing">Under Official Review</option>
                                <option value="resolved">Resolution Complete</option>
                              </select>
                              <button className="btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={() => submitReview(item._id || item.id)}>Update Status</button>
                              <button className="text-secondary" style={{ padding: '0 1rem' }} onClick={() => setReviewData({ postId: null, response: '', status: 'reviewing' })}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-between">
                            <small className="text-secondary">Filed by: {item.citizenName || 'Government System'}</small>
                            <button className="btn-primary" onClick={() => setReviewData({ postId: (item._id || item.id), response: '', status: 'reviewing' })}>
                              Take Administrative Action
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Citizen Issues */}
          <section>
            <div className="card" style={{ borderLeft: '4px solid var(--gov-accent)' }}>
              <div className="flex-between mb-8">
                <div>
                  <h3 style={{ margin: 0, color: 'var(--gov-accent)', fontSize: '1.5rem', fontWeight: '700' }}>📂 Administrative Queue</h3>
                  <p className="text-secondary" style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>Standard issues filed by citizens for department review</p>
                </div>
                <div className="badge badge-info">{activeReports.length} Active Cases</div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner"></div>
                  <p className="text-secondary mt-4">Synchronizing with central database...</p>
                </div>
              ) : activeReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                  <p className="text-secondary" style={{ fontStyle: 'italic', margin: 0 }}>Queue is currently clear.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {activeReports.map(report => (
                    <div key={report._id || report.id} className="card" style={{ 
                      padding: '1.5rem', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--gov-border)',
                      boxShadow: 'none'
                    }}>
                      <div className="flex-between mb-4">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>📄</span>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{report.title}</h4>
                        </div>
                        <span className={`badge ${report.status === 'resolved' ? 'badge-success' : 'badge-info'}`}>
                          {report.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>
                      <p className="text-secondary mb-6" style={{ fontSize: '0.95rem' }}>{report.description}</p>
                      
                      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {reviewData.postId === (report._id || report.id) ? (
                          <div className="gap-4" style={{ display: 'flex', flexDirection: 'column' }}>
                            <textarea
                              placeholder="Enter official findings and resolution details..."
                              style={{ minHeight: '100px' }}
                              value={reviewData.response}
                              onChange={e => setReviewData(prev => ({ ...prev, response: e.target.value }))}
                            />
                            <div className="flex gap-2">
                              <button className="btn-primary" style={{ flex: 2 }} onClick={() => submitReview(report._id || report.id, 'resolved')}>Mark as Resolved</button>
                              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => submitReview(report._id || report.id)}>Save Draft</button>
                              <button className="text-secondary" onClick={() => setReviewData({ postId: null, response: '', status: 'reviewing' })}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-between">
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                              <small className="text-secondary">Filed by: <span style={{ color: 'var(--gov-text-primary)' }}>{report.citizenName}</span></small>
                              <small className="text-secondary">Ref ID: <span style={{ color: 'var(--gov-text-primary)' }}>#{getSafeId(report)}</span></small>
                            </div>
                            <button className="btn-primary" onClick={() => setReviewData({ postId: (report._id || report.id), response: '', status: 'reviewing' })}>
                              Process Case
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Announcement Form & History */}
        <div className="col-span-4">
          {/* Post Announcement */}
          <section className="mb-8">
            <div className="card" style={{ borderTop: '4px solid var(--gov-accent)', position: 'sticky', top: '96px' }}>
              <h3 className="mb-6" style={{ fontSize: '1.3rem', fontWeight: '700' }}>📢 Public Directive</h3>
              <form onSubmit={submitAnnouncement} className="gap-5" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Authorized Officer</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={announcement.politicianName}
                    onChange={e => setAnnouncement(prev => ({ ...prev, politicianName: e.target.value }))}
                  />
                </div>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Subject Title</label>
                  <input
                    type="text"
                    placeholder="Headline of the directive"
                    value={announcement.title}
                    onChange={e => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label className="stat-label">Official Content</label>
                  <textarea
                    placeholder="Provide full details of the directive..."
                    style={{ minHeight: '150px' }}
                    value={announcement.content}
                    onChange={e => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Publish Directive</button>
              </form>
            </div>
          </section>

          {/* Announcement History */}
          <section>
            <div className="card">
              <h3 className="mb-6" style={{ fontSize: '1.2rem', fontWeight: '700' }}>📜 Issued Directives</h3>
              {announcements.length === 0 ? (
                <p className="text-secondary" style={{ fontStyle: 'italic', textAlign: 'center' }}>No directives issued in current session.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map(item => (
                    <div key={item._id || item.id} style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(59, 130, 246, 0.03)', 
                      borderRadius: '12px',
                      border: '1px solid var(--gov-border)'
                    }}>
                      <div className="flex-between mb-3">
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{item.title}</h4>
                        <span className="badge badge-success">Active</span>
                      </div>
                      <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem' }}>{item.description}</p>
                      <div className="flex-between">
                        <small className="text-secondary">Ref: #{getSafeId(item)}</small>
                        <small className="text-secondary" style={{ fontWeight: '600' }}>By: {item.citizenName}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
