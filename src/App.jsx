import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Citizen from './pages/Citizen.jsx'
import Politician from './pages/Politician.jsx'
import Moderator from './pages/Moderator.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import { getCurrentRole, logout } from './store.js'

function App() {
  const [role, setRole] = useState(() => getCurrentRole())

  useEffect(() => {
    function sync() {
      setRole(getCurrentRole())
    }

    window.addEventListener('storage', sync)
    window.addEventListener('fedf_role_change', sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('fedf_role_change', sync)
    }
  }, [])

  return (
    <div>
      <header className="site-header">
        <div />
        <nav className="site-nav">
          <NavLink to="/" end>Login</NavLink>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/citizen">Citizen</NavLink>
          <NavLink to="/politician">Politician</NavLink>
          <NavLink to="/moderator">Moderator</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        <div>
          {role ? (
            <>
              <span style={{ marginRight: '0.5rem' }}>{role}</span>
              <button onClick={() => { logout(); window.location.href = '/' }}>Logout</button>
            </>
          ) : null}
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={role ? <Navigate to={`/${role.toLowerCase()}`} replace /> : <Navigate to="/" replace />} />
          <Route path="/citizen" element={role === 'Citizen' ? <Citizen /> : <Navigate to="/" replace />} />
          <Route path="/politician" element={role === 'Politician' ? <Politician /> : <Navigate to="/" replace />} />
          <Route path="/moderator" element={role === 'Moderator' ? <Moderator /> : <Navigate to="/" replace />} />
          <Route path="/admin" element={role === 'Admin' ? <Admin /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
