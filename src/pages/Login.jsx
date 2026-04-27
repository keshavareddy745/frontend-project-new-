import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { setCurrentRole, setCurrentUser, getUsers } from '../store.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Citizen')
  const [captchaText, setCaptchaText] = useState(generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Body styles are now handled globally in index.css
  }, [])

  function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  function submit(e) {
    e.preventDefault()

    if (!email || !password) {
      alert('Enter credentials')
      return
    }

    if (captchaInput !== captchaText) {
      alert('Wrong captcha')
      setCaptchaText(generateCaptcha())
      setCaptchaInput('')
      return
    }

    const users = getUsers()

    let foundUser =
      email === 'REDDY143' && password === 'ADMIN@1432' && role === 'Admin'
        ? { name: 'REDDY143', role: 'Admin' }
        : users.find(
            u =>
              (u.name === email || u.email === email) &&
              u.password === password &&
              u.role === role
          )

    if (!foundUser) {
      alert('Login failed')
      return
    }

    setCurrentRole(role)
    setCurrentUser({ email: foundUser.name })
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent'
    }}>

      {/* MAIN CARD */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '40px'
      }}>

        <h1 style={{
          textAlign: 'center',
          color: '#1e3a8a', // Dark blue for title
          fontWeight: '900',
          marginBottom: '10px',
          fontSize: '1.8em',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          lineHeight: '1.2'
        }}>
          INTERACTION BETWEEN <br />
          POLITICIANS AND CITIZENS
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#64748b',
          marginBottom: '30px',
          fontSize: '1.1em',
          fontWeight: '500'
        }}>
          Portal Login
        </p>

        <form onSubmit={submit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>

          <input
            placeholder="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />

          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={inputStyle}
          >
            <option>Citizen</option>
            <option>Politician</option>
            <option>Moderator</option>
            <option>Admin</option>
          </select>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />

          {/* CAPTCHA */}
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{
              flex: 1,
              fontFamily: 'monospace',
              fontSize: 22,
              fontWeight: 'bold',
              background: '#f8fafc',
              color: '#ef4444',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              letterSpacing: 4,
              borderRadius: '8px',
              userSelect: 'none',
              textDecoration: 'line-through',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {captchaText}
            </span>

            <button
              type="button"
              onClick={() => setCaptchaText(generateCaptcha())}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#f1f5f9',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
            >
              Refresh
            </button>
          </div>

          <input
            placeholder="Enter Captcha"
            value={captchaInput}
            onChange={e => setCaptchaInput(e.target.value)}
            style={inputStyle}
          />

          <button style={{
            padding: '14px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(to right, #3b82f6, #2563eb)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.1em',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
          }}>
            LOGIN →
          </button>

          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '10px' }}>
            Don’t have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

/* INPUT STYLE */
const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.9)',
  color: '#333',
  outline: 'none'
}