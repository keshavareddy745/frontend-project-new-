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

      <div className="dashboard-grid">
        <div className="col-span-6">
          <div className="card">
            <h3>Create New User</h3>
            <p className="text-secondary mb-6">Add authorized personnel to the system.</p>
            <form onSubmit={submitUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="stat-label">Full Legal Name</label>
                <input 
                  placeholder="e.g. John Doe" 
                  value={user.name} 
                  onChange={e=>setUser(u=>({ ...u, name: e.target.value }))} 
                />
              </div>
              <div className="gap-2" style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="stat-label">System Role</label>
                <select 
                  value={user.role} 
                  onChange={e=>setUser(u=>({ ...u, role: e.target.value }))}
                >
                  <option>Citizen</option>
                  <option>Politician</option>
                  <option>Moderator</option>
                  <option>Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Add User to System</button>
            </form>
          </div>
        </div>

        <div className="col-span-6">
          <div className="card">
            <h3>Pending Registrations</h3>
            <p className="text-secondary mb-6">Review and approve new platform access requests.</p>
            <div>
              {pendingUsers.length === 0 ? (
                <p className="text-secondary" style={{ fontStyle: 'italic' }}>No pending registrations at this time.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingUsers.map(pu => (
                    <div key={pu.id} style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '12px',
                      border: '1px solid var(--gov-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{pu.email}</div>
                        <div className="badge badge-info" style={{ marginTop: '0.5rem' }}>Request: {pu.role}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                          onClick={() => handleApprove(pu.id, pu.email, pu.role)} 
                          className="btn-success"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(pu.id)} 
                          className="btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
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
      </div>

      <div className="card mt-4">
        <h3>System User Directory</h3>
        <p className="text-secondary mb-6">Overview of all active personnel and citizens.</p>
        <div style={{ overflowX: 'auto' }}>
          {allUsers.length === 0 ? (
            <p className="text-secondary" style={{ fontStyle: 'italic' }}>No registered users found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Assigned Role</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: '700' }}>{u.name}</td>
                    <td>
                      <span className={`badge badge-info`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        ACTIVE
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleRemoveUser(u.id)} 
                        className="btn-danger"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                      >
                        Revoke Access
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
