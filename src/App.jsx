import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Citizen from './pages/Citizen.jsx'
import Politician from './pages/Politician.jsx'
import Moderator from './pages/Moderator.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { getCurrentRole, logout, getPendingUsers } from './store.js'

function App() {
  const [role, setRole] = useState(() => getCurrentRole())
  const [pendingCount, setPendingCount] = useState(() => getPendingUsers().length)

  useEffect(() => {
    function sync() {
      setRole(getCurrentRole())
      setPendingCount(getPendingUsers().length)
    }

    window.addEventListener('storage', sync)
    window.addEventListener('fedf_role_change', sync)
    window.addEventListener('fedf_data_change', sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('fedf_role_change', sync)
      window.removeEventListener('fedf_data_change', sync)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="site-header">
        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f8fafc', letterSpacing: '-0.02em' }}>
          CIVIC <span style={{ color: '#3b82f6' }}>CONNECT</span>
        </div>
        <nav className="site-nav">
          {!role && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
          <NavLink to="/" end>Home</NavLink>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {role ? (
            <>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f8fafc' }}>{role}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Logged in</div>
              </div>
              <button 
                className="action-btn btn-danger"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                onClick={() => { logout(); window.location.href = '/' }}
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </header>

      <div className={role ? "dashboard-layout" : ""}>
        {role && (
          <aside className="sidebar">
            <NavLink to={`/${role.toLowerCase()}`} className="sidebar-link">
              <span>📊</span> Dashboard
            </NavLink>
            {role === 'Admin' && (
              <NavLink to="/admin" className="sidebar-link">
                <span>⚙️</span> Management
                {pendingCount > 0 && (
                  <span style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    borderRadius: '10px', 
                    padding: '2px 8px', 
                    fontSize: '0.7rem', 
                    marginLeft: 'auto' 
                  }}>
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            )}
          </aside>
        )}

        <main className={role ? "dashboard-content" : ""}>
          <Routes>
            <Route path="/" element={<div className="container"><Home /></div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={role ? <Navigate to={`/${role.toLowerCase()}`} replace /> : <Navigate to="/login" replace />} />
            <Route path="/citizen" element={role === 'Citizen' ? <Citizen /> : <Navigate to="/login" replace />} />
            <Route path="/politician" element={role === 'Politician' ? <Politician /> : <Navigate to="/login" replace />} />
            <Route path="/moderator" element={role === 'Moderator' ? <Moderator /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={role === 'Admin' ? <Admin /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App;
