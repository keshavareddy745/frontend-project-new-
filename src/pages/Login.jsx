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
    const chars = '0123456789'
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
    
    // Direct navigation based on role to avoid sync delay in parent
    setTimeout(() => {
      navigate(`/${role.toLowerCase()}`)
    }, 10)
  }

  return (
    <div className="auth-page" style={{ flexDirection: 'column', gap: '2rem' }}>
      <div className="viz-container">
        <div className="citizen-group">
          <div className="person">👨‍👩‍👧‍👦 <span className="phone-icon">📱</span></div>
          <div className="person">👨‍💻 <span className="phone-icon">📱</span></div>
          <div className="person">👩‍💼 <span className="phone-icon">📱</span></div>
        </div>

        <div className="signal-path">
          <div className="signal-wave"></div>
          <div className="signal-dot"></div>
          <div className="signal-dot" style={{ animationDelay: '0.6s' }}></div>
          <div className="signal-dot" style={{ animationDelay: '1.2s' }}></div>
        </div>

        <div className="politician-viz">
          <span>🏛️</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gov-accent)' }}>POLITICIAN</span>
          <span className="phone-icon" style={{ fontSize: '2rem' }}>📱</span>
        </div>

        <div className="viz-label">Direct Citizen-to-Government Link</div>
      </div>

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
          <h1 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '900', 
            margin: '0 0 0.25rem', 
            background: 'linear-gradient(to right, var(--gov-blue-800), var(--gov-accent))', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>Civic Connect</h1>
          <p style={{ color: 'var(--gov-text-secondary)', fontWeight: '600', fontSize: '1rem', margin: 0 }}>
            Government of Andhra Pradesh
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="flex-column gap-2">
            <label className="stat-label">Identification</label>
            <input
              placeholder="Username or Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="flex-column gap-2">
            <label className="stat-label">System Access Level</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option>Citizen</option>
              <option>Politician</option>
              <option>Moderator</option>
              <option>Admin</option>
            </select>
          </div>

          <div className="flex-column gap-2">
            <label className="stat-label">Secure Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="flex-column gap-2">
            <label className="stat-label">Verification Challenge</label>
            <div className="captcha-container">
              <div className="captcha-box">
                {captchaText}
              </div>
              <button
                type="button"
                className="action-btn"
                onClick={() => setCaptchaText(generateCaptcha())}
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--gov-text-secondary)' }}
              >
                ↻
              </button>
            </div>
            <input
              placeholder="Enter digits above"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
            Authorize & Sign In
          </button>

          <p style={{ textAlign: 'center', color: 'var(--gov-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            New official?{' '}
            <Link to="/register" style={{ color: 'var(--gov-accent)', fontWeight: '700', textDecoration: 'none' }}>
              Request Access
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}