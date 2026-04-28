import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

  useEffect(() => {
    function sync() {
      const newRole = getCurrentRole()
      setRole(newRole)
      setPendingCount(getPendingUsers().length)
    }

    window.addEventListener('storage', sync)
    window.addEventListener('fedf_role_change', sync)
    window.addEventListener('fedf_data_change', sync)

    sync()

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('fedf_role_change', sync)
      window.removeEventListener('fedf_data_change', sync)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setRole(null)
    navigate('/login')
  }

  return (
    <div id="app-root">
      {/* Background Gold Flash Effects */}
      <div className="thunder-flash">
        <div className="lightning"></div>
        <div className="lightning"></div>
        <div className="lightning"></div>
      </div>

      {/* Right Corner Image */}
      <img 
        src="https://tse3.mm.bing.net/th/id/OIP.M_kLdRU2PZ3y-4dGIa_KTgHaEK?pid=Api&h=220&P=0" 
        alt="Decorative Element" 
        className="corner-image"
      />

      <header className="site-header">
        <div className="flex items-center gap-3">
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Emblem_of_Andhra_Pradesh.svg/1200px-Emblem_of_Andhra_Pradesh.svg.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }} />
          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.02em', lineHeight: 1 }}>
            CIVIC <span style={{ color: 'var(--gold-accent)' }}>CONNECT</span>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', color: '#475569', letterSpacing: '0.05em', marginTop: '2px' }}>GOVERNMENT OF AP</div>
          </div>
        </div>
        
        <nav className="site-nav">
          {!role && (
            <>
              <NavLink to="/login" style={({isActive}) => isActive ? {color: 'var(--gold-accent)', background: 'rgba(218, 165, 32, 0.1)'} : {}}>Login</NavLink>
              <NavLink to="/register" style={({isActive}) => isActive ? {color: 'var(--gold-accent)', background: 'rgba(218, 165, 32, 0.1)'} : {}}>Register</NavLink>
            </>
          )}
          <NavLink to="/" end style={({isActive}) => isActive ? {color: 'var(--gold-accent)', background: 'rgba(218, 165, 32, 0.1)'} : {}}>Home</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {role ? (
            <>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{role.toUpperCase()}</div>
                <div style={{ fontSize: '0.65rem', color: '#475569' }}>AUTHORIZED SESSION</div>
              </div>
              <button 
                className="btn-danger"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '8px' }}
                onClick={handleLogout}
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
            <div className="mb-6 px-4">
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Main Menu</div>
            </div>
            <NavLink to={`/${role.toLowerCase()}`} className="sidebar-link">
              <span>📊</span> Dashboard Overview
            </NavLink>
            {role === 'Admin' && (
              <NavLink to="/admin" className="sidebar-link">
                <span>⚙️</span> System Management
                {pendingCount > 0 && (
                  <span style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    borderRadius: '6px', 
                    padding: '2px 6px', 
                    fontSize: '0.65rem', 
                    fontWeight: '800',
                    marginLeft: 'auto' 
                  }}>
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            )}
            <div className="mt-auto px-4 py-4" style={{ borderTop: '1px solid var(--gov-border)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                &copy; 2026 AP Government<br/>Digital Services
              </div>
            </div>
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
