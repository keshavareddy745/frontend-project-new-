import { useState, useEffect } from 'react'
import { addUser, getUsers, clearData, getPendingUsers, approvePendingUser, removePendingUser, removeUser } from '../store.js'

export default function Admin() {
  const [user, setUser] = useState({ name: '', role: 'Citizen' })
  const [pendingUsers, setPendingUsers] = useState(() => getPendingUsers())
  const [allUsers, setAllUsers] = useState(() => getUsers())

  useEffect(() => {
    function refresh() {
      setPendingUsers(getPendingUsers())
      setAllUsers(getUsers())
    }
    window.addEventListener('fedf_data_change', refresh)
    return () => window.removeEventListener('fedf_data_change', refresh)
  }, [])

  function submitUser(e) {
    e.preventDefault()
    if (!user.name) return
    addUser(user)
    setUser({ name: '', role: 'Citizen' })
    setAllUsers(getUsers())
    alert('User added')
  }

  function handleApprove(userId, email, role) {
    approvePendingUser(userId)
    setPendingUsers(getPendingUsers())
    setAllUsers(getUsers())
    alert(`User ${email} approved as ${role}.`)
  }

  function handleReject(userId) {
    removePendingUser(userId)
    setPendingUsers(getPendingUsers())
    alert('User registration rejected.')
  }

  function handleRemoveUser(userId) {
    if (confirm('Are you sure you want to remove this user?')) {
      removeUser(userId)
      setAllUsers(getUsers())
      alert('User removed.')
    }
  }

  function resetData() {
    if (confirm('Clear all platform data?')) {
      clearData()
      setPendingUsers([])
      setAllUsers([])
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
        <h3>Pending User Registrations</h3>
        {pendingUsers.length === 0 ? <p>No pending registrations.</p> : (
          <ul>
            {pendingUsers.map(pu => (
              <li key={pu.id}>
                {pu.email} ({pu.role})
                <button onClick={() => handleApprove(pu.id, pu.email, pu.role)} style={{ marginLeft: '10px', background: '#4CAF50' }}>Approve</button>
                <button onClick={() => handleReject(pu.id)} style={{ marginLeft: '5px', background: '#f44336' }}>Reject</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card section">
        <h3>Users</h3>
        {allUsers.length === 0 ? <p>No users.</p> : (
          <ul>
            {allUsers.map(u => (
              <li key={u.id}>{u.name} — {u.role}
                <button onClick={() => handleRemoveUser(u.id)} style={{ marginLeft: '10px', background: '#f44336' }}>Remove</button>
              </li>
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
