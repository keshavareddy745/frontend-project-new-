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

        {announcements.length === 0 ? (
          <p>No announcements yet</p>
        ) : (
          announcements.map(item => (
            <div key={item.id} style={{ marginBottom: '1rem' }}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <small>By {item.citizenName}</small>
            </div>
          ))
        )}
      </div>

      {/* 🔹 Citizen Issues */}
      <div className="card">
        <h3>Citizen Issues</h3>

        {loading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <p>No issues</p>
        ) : (
          reports.map(report => (
            <div key={report.id} style={{ marginBottom: '1rem' }}>
              <h4>{report.title}</h4>
              <p>{report.description}</p>
              <small>By {report.citizenName}</small>
            </div>
          ))
        )}
      </div>

    </div>
  )
}