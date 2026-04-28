import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addPendingUser } from '../store.js'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Citizen') // Default role for new users
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      alert('Please enter both email and password.')
      return
    }
    
    addPendingUser({ email, password, role })
    alert('Registration request sent to admin for approval.')
    navigate('/') // Redirect to login page after registration request
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ 
            width: '60px', 
            height: '60px', 
            margin: '0 auto 1.5rem',
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Emblem_of_Andhra_Pradesh.svg/1200px-Emblem_of_Andhra_Pradesh.svg.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }} />
          <h1>Account Request</h1>
          <p>Government Service Portal Registration</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="flex-column gap-2">
            <label className="stat-label">Official Email</label>
            <input
              type="email"
              value={email}
              placeholder="official.name@ap.gov.in"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-column gap-2">
            <label className="stat-label">Create Password</label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex-column gap-2">
            <label className="stat-label">Requested Designation</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option>Citizen</option>
              <option>Politician</option>
              <option>Moderator</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
            Submit Registration Request
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--gov-text-secondary)' }}>
          Already registered?{' '}
          <a href="/" style={{ color: 'var(--gov-accent)', fontWeight: '700', textDecoration: 'none' }}>
            Return to Login
          </a>
        </div>
      </div>
    </div>
  )
}
