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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Admin Console</h2>
          <p>Manage users, roles, and platform settings.</p>
        </div>
        <div className="dashboard-actions">
          <button className="action-btn btn-danger" onClick={resetData}>
            ⚠️ Clear All Data
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Users</span>
          <span className="stat-value">{allUsers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Approval</span>
          <span className="stat-value">{pendingUsers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">System Status</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', color: '#10b981' }}>Active</span>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Create New User</h3>
          <form onSubmit={submitUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input 
              placeholder="Full Name" 
              value={user.name} 
              onChange={e=>setUser(u=>({ ...u, name: e.target.value }))} 
            />
            <select 
              value={user.role} 
              onChange={e=>setUser(u=>({ ...u, role: e.target.value }))}
            >
              <option>Citizen</option>
              <option>Politician</option>
              <option>Moderator</option>
              <option>Admin</option>
            </select>
            <button type="submit" className="action-btn btn-primary">Add User</button>
          </form>
        </div>

        <div className="card">
          <h3>Pending Registrations</h3>
          <div style={{ marginTop: '1rem' }}>
            {pendingUsers.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No pending registrations.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pendingUsers.map(pu => (
                  <div key={pu.id} style={{ 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{pu.email}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Requested: {pu.role}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleApprove(pu.id, pu.email, pu.role)} 
                        className="action-btn btn-success"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(pu.id)} 
                        className="action-btn btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>User Management</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          {allUsers.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No users found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '600' }}>{u.name}</td>
                    <td>
                      <span className={`badge badge-info`} style={{ 
                        padding: '4px 10px', 
                        fontSize: '0.75rem',
                        borderRadius: '999px'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ 
                        padding: '4px 10px', 
                        fontSize: '0.75rem',
                        borderRadius: '999px'
                      }}>
                        ACTIVE
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveUser(u.id)} 
                        className="action-btn btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Remove
                      </button>
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
