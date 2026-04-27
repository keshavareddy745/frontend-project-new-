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
    document.body.style.margin = 0
    document.body.style.backgroundImage =
      'url("https://upload.wikimedia.org/wikipedia/commons/6/6c/Y._S._Jagan_Mohan_Reddy.jpg")'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
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
      background: 'rgba(0,0,0,0.6)'
    }}>

      {/* MAIN CARD */}
      <div style={{
        display: 'flex',
        width: '950px',
        borderRadius: '20px',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.15)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
      }}>

        {/* LEFT SIDE */}
        <div style={{
          flex: 1,
          padding: '40px',
          position: 'relative'
        }}>

          {/* Circles */}
          <div style={{
            width: 50, height: 50,
            borderRadius: '50%',
            background: '#80cbc4',
            position: 'absolute',
            bottom: 20, right: 20
          }} />

          <h1 style={{
            textAlign: 'center',
            color: '#fff',
            fontWeight: '900',
            marginBottom: '30px'
          }}>
            INTERACTION BETWEEN <br />
            POLITICIANS AND CITIZENS
          </h1>

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
                fontFamily: 'monospace',
                fontSize: 22,
                fontWeight: 'bold',
                background: '#fff',
                color: '#d32f2f', // Dark red for visibility
                padding: '8px 12px',
                border: '2px dashed #d32f2f',
                letterSpacing: 4,
                borderRadius: '5px',
                userSelect: 'none',
                textDecoration: 'line-through'
              }}>
                {captchaText}
              </span>

              <button
                type="button"
                onClick={() => setCaptchaText(generateCaptcha())}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
                  cursor: 'pointer'
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
              padding: 12,
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(to right, #4CAF50, #8BC34A)',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              LOGIN →
            </button>

            <p style={{ textAlign: 'center', color: '#fff' }}>
              Don’t have an account?{' '}
              <Link to="/register" style={{ color: '#ffcc80' }}>
                Sign Up
              </Link>
            </p>

          </form>
        </div>

        {/* RIGHT SIDE */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#fff'
          }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Y._S._Jagan_Mohan_Reddy.jpg"
              alt="Jagan"
              style={{
                width: '220px',
                borderRadius: '10px',
                border: '3px solid white'
              }}
            />
            <h3 style={{ marginTop: 15 }}>
              Building a Better Future Together
            </h3>
          </div>
        </div>

      </div>
    </div>
  )
}

/* INPUT STYLE */
const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: 'rgba(0,0,0,0.7)',
  color: '#fff',
  outline: 'none'
}