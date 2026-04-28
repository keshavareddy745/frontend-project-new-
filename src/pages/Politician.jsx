import { useEffect, useState } from 'react'

export default function PoliticianDashboard() {

  const [reports, setReports] = useState([])
  const [announcements, setAnnouncements] = useState([])
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

      setReports(data.filter(p => p.role === 'citizen'))
      setAnnouncements(data.filter(p => p.role === 'politician'))

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