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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#e0f7fa' }}>
      <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', color: '#333' }}>Register New Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
            Email
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
            Password
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '5px', boxSizing: 'border-box' }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
            Role
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', marginTop: '5px', boxSizing: 'border-box' }}
            >
              <option>Citizen</option>
              <option>Politician</option>
              <option>Moderator</option>
            </select>
          </label>
          <button type="submit" style={{ background: 'linear-gradient(to right, #2196F3, #42A5F5)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold' }}>
            Register
          </button>
        </form>
        <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
          Already have an account? <a href="/" style={{ color: '#2196F3', fontWeight: 'bold', textDecoration: 'none' }}>Login</a>
        </div>
      </div>
    </div>
  )
}
