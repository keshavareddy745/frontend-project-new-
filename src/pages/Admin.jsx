import { useState } from 'react'
import { addUser, getUsers, clearData } from '../store.js'

export default function Admin() {
  const [user, setUser] = useState({ name: '', role: 'Citizen' })
  const users = getUsers()

  function submitUser(e) {
    e.preventDefault()
    if (!user.name) return
    addUser(user)
    setUser({ name: '', role: 'Citizen' })
    alert('User added')
  }

  function resetData() {
    if (confirm('Clear all platform data?')) {
      clearData()
      alert('Data cleared')
    }
  }

  return (
    <section className="container">
      <h2>Admin Console</h2>
      <form className="card" onSubmit={submitUser}>
        <h3>Create User</h3>
        <input placeholder="Name" value={user.name} onChange={e=>setUser(u=>({ ...u, name: e.target.value }))} />
        <select value={user.role} onChange={e=>setUser(u=>({ ...u, role: e.target.value }))}>
          <option>Citizen</option>
          <option>Politician</option>
          <option>Moderator</option>
          <option>Admin</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="card section">
        <h3>Users</h3>
        {users.length === 0 ? <p>No users.</p> : (
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.name} — {u.role}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <button onClick={resetData}>Clear Platform Data</button>
      </div>
    </section>
  )
}
