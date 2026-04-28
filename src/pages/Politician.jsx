import { useEffect, useState } from 'react'

export default function PoliticianDashboard() {
  const [allPosts, setAllPosts] = useState([])
  const reports = allPosts.filter(p => (!p.role || p.role === 'citizen') && !p.isImportant)
  const announcements = allPosts.filter(p => p.role === 'politician' && !p.isImportant)
  const importantItems = allPosts.filter(p => p.isImportant)
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

  // ✅ FETCH DATA FROM BACKEND
  const fetchReports = async () => {
    try {
      const res = await fetch('https://backendproject-6-0sai.onrender.com/api/posts')
      const data = await res.json()
      setAllPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(fetchReports, 3000)
    return () => clearInterval(interval)
  }, [])

  // ✅ SAVE ANNOUNCEMENT TO DB
  async function submitAnnouncement(e) {
    e.preventDefault()

    if (!announcement.title || !announcement.content || !announcement.politicianName) {
      alert('Please fill all fields')
      return
    }

    try {
      const res = await fetch('https://backendproject-6-0sai.onrender.com/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announcement.title,
          description: announcement.content,
          citizenName: announcement.politicianName,
          role: 'politician'
        })
      })

      if (res.ok) {
        alert('Saved to DB ✅')
        setAnnouncement({ title: '', content: '', politicianName: '' })
        fetchReports()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ SUBMIT REVIEW FOR CITIZEN ISSUE
  async function submitReview(postId) {
    if (!reviewData.response) {
      alert('Please enter a response')
      return
    }

    try {
      const postToUpdate = allPosts.find(p => (p._id || p.id) === postId)
      if (!postToUpdate) return

      const res = await fetch(`https://backendproject-6-0sai.onrender.com/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postToUpdate,
          politicianResponse: reviewData.response,
          status: reviewData.status
        })
      })

      if (res.ok) {
        alert('Review submitted successfully ✅')
        setReviewData({ postId: null, response: '', status: 'reviewing' })
        fetchReports()
      }
    } catch (err) {
      console.error('Failed to submit review:', err)
      alert('Error submitting review')
    }
  }

  return (
    <div className="dashboard-container">

      <h2>Politician Dashboard</h2>

      {/* 🔹 Important / Priority Items */}
      <div className="card" style={{ border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
        <h3 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚠️</span> Important Priority Items
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          These items have been flagged by moderators for your immediate attention.
        </p>

        {importantItems.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No priority items at the moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {importantItems.map(item => (
              <div key={item._id || item.id} style={{ 
                padding: '1.25rem', 
                background: 'rgba(15, 23, 42, 0.4)', 
                borderRadius: '12px',
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge" style={{ 
                    background: item.role === 'politician' ? '#10b981' : '#3b82f6',
                    fontSize: '0.65rem',
                    marginBottom: '0.5rem'
                  }}>
                    {item.role === 'politician' ? 'POLITICIAN NEWS' : 'CITIZEN ISSUE'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{item.title}</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.95rem' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#64748b' }}>By {item.citizenName}</small>
                  <button className="action-btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                    Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Announcement Form */}
      <div className="card">
        <h3>Post Announcement</h3>

        <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
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
            value={announcement.content}
            onChange={e =>
              setAnnouncement(prev => ({ ...prev, content: e.target.value }))
            }
          />

          <button type="submit">Post Announcement</button>
        </form>
      </div>

      {/* 🔹 Announcements */}
      <div className="card">
        <h3>Your Announcements</h3>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Recent updates and news you've shared with the community.
        </p>

        {announcements.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No announcements yet</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {announcements.map(item => (
              <div key={item._id || item.id} style={{ 
                padding: '1.25rem', 
                background: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>{item.title}</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Posted by: <span style={{ color: '#94a3b8' }}>{item.citizenName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Citizen Issues */}
      <div className="card">
        <h3>Citizen Issues</h3>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Issues reported by citizens that require your attention and response.
        </p>

        {loading ? (
          <p>Loading issues...</p>
        ) : reports.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No active issues reported</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reports.map(report => (
              <div key={report._id || report.id} style={{ 
                padding: '1.5rem', 
                background: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#f8fafc', fontSize: '1.1rem' }}>{report.title}</h4>
                    <small style={{ color: '#64748b' }}>Submitted by: <span style={{ color: '#94a3b8' }}>{report.citizenName}</span></small>
                  </div>
                  <span className={`badge ${report.status === 'resolved' ? 'badge-success' : 'badge-info'}`}>
                    {(report.status || 'open').toUpperCase()}
                  </span>
                </div>
                
                <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: '1.6' }}>{report.description}</p>

                {report.politicianResponse ? (
                  <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '12px',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <div style={{ fontWeight: '700', color: '#3b82f6', fontSize: '0.8rem', marginBottom: '0.25rem' }}>YOUR RESPONSE:</div>
                    <div style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{report.politicianResponse}</div>
                  </div>
                ) : (
                  <div style={{ marginTop: '1rem' }}>
                    {reviewData.postId === (report._id || report.id) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea
                          placeholder="Write your response or plan of action..."
                          value={reviewData.response}
                          onChange={e => setReviewData(prev => ({ ...prev, response: e.target.value }))}
                          style={{ minHeight: '100px' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <select 
                            value={reviewData.status}
                            onChange={e => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                            style={{ padding: '0.5rem', borderRadius: '8px', background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <option value="reviewing">Under Review</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button 
                            className="action-btn btn-success" 
                            style={{ flex: 1 }}
                            onClick={() => submitReview(report._id || report.id)}
                          >
                            Submit Response
                          </button>
                          <button 
                            className="action-btn btn-secondary"
                            onClick={() => setReviewData({ postId: null, response: '', status: 'reviewing' })}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="action-btn btn-primary"
                        onClick={() => setReviewData({ postId: (report._id || report.id), response: '', status: 'reviewing' })}
                      >
                        Review & Respond
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}