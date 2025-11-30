import { useState } from 'react'
import { addUpdate, addResponse, getReports, solveReport, setLeaderImage, getLeaderImage } from '../store.js'

export default function Politician() {
  const [update, setUpdate] = useState({ title: '', content: '', politicianName: '' })
  const [responses, setResponses] = useState({})
  const [reports, setReports] = useState(() => getReports())
  const [leaderImgJagan, setLeaderImgJagan] = useState(() => getLeaderImage('jagan'))
  const [leaderImgModi, setLeaderImgModi] = useState(() => getLeaderImage('modi'))
  
  function submitUpdate(e) {
    e.preventDefault()
    if (!update.title || !update.content) return
    addUpdate(update)
    setUpdate({ title: '', content: '', politicianName: '' })
    alert('Update posted')
    setReports(getReports())
  }

  function submitResponse(id) {
    const message = responses[id]
    if (!message) return
    addResponse({ reportId: id, message, politicianName: update.politicianName || 'Politician' })
    setResponses(r => ({ ...r, [id]: '' }))
    alert('Response sent')
    setReports(getReports())
  }

  function markSolved(id) {
    const note = prompt('Solution note (optional)') || ''
    const ok = solveReport(id, note, update.politicianName || 'Politician')
    if (ok) alert('Issue marked as solved')
    setReports(getReports())
  }

  return (
    <section>
      <h2>Politician Portal</h2>
      <div className="hero card" style={{ marginBottom: '1rem' }}>
        <div className="grid">
          <div className="role-card leader-card">
            <img className="leader-img" src={leaderImgJagan || 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Y_S_Jagan_Mohan_Reddy.png'} alt="Leader" />
            <strong>Jagan Mohan Reddy</strong>
            <span className="badge politician">Public Leader</span>
            <input type="file" accept="image/*" onChange={handleImageUpload('jagan', setLeaderImgJagan)} />
          </div>
          <div className="role-card leader-card">
            <img className="leader-img" src={leaderImgModi || 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Prime_Minister_Narendra_Modi_in_New_Delhi_2023.jpg'} alt="Leader" />
            <strong>Narendra Modi</strong>
            <span className="badge politician">Public Leader</span>
            <input type="file" accept="image/*" onChange={handleImageUpload('modi', setLeaderImgModi)} />
          </div>
        </div>
      </div>
      <form className="card" onSubmit={submitUpdate}>
        <h3>Post Update</h3>
        <input placeholder="Your name" value={update.politicianName} onChange={e=>setUpdate(u=>({ ...u, politicianName: e.target.value }))} />
        <input placeholder="Title" value={update.title} onChange={e=>setUpdate(u=>({ ...u, title: e.target.value }))} />
        <textarea placeholder="Content" value={update.content} onChange={e=>setUpdate(u=>({ ...u, content: e.target.value }))} />
        <button type="submit">Publish</button>
      </form>

      <div className="card section">
        <h3>Citizen Reports</h3>
        {reports.length === 0 ? <p>No reports yet.</p> : (
          <ul>
            {reports.filter(r=>r.status!=='solved').map(r => (
              <li key={r.id}>
                <strong>{r.title}</strong> — {r.description} <em>({r.citizenName || 'Anonymous'})</em>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    placeholder="Write a response"
                    value={responses[r.id] || ''}
                    onChange={e=>setResponses(s=>({ ...s, [r.id]: e.target.value }))}
                  />
                  <button type="button" onClick={() => submitResponse(r.id)}>Send</button>
                  <button type="button" onClick={() => markSolved(r.id)}>Mark Solved</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
  function handleImageUpload(key, setter) {
    return (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const url = reader.result
        setLeaderImage(key, url)
        setter(url)
      }
      reader.readAsDataURL(file)
    }
  }
