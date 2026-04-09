import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCurrentRole, setCurrentUser } from '../store.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Citizen') // Default role
  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const navigate = useNavigate()

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
      alert('Please enter both username and password.')
      return
    }
    if (captchaInput !== captchaText) {
      alert('Incorrect captcha. Please try again.')
      setCaptchaText(generateCaptcha())
      setCaptchaInput('')
      return
    }
    setCurrentRole(role)
    setCurrentUser({ email })
    navigate('/dashboard')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%)', // Light blue-green gradient
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        maxWidth: '900px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Left Section */}
        <div style={{
          flex: 1,
          padding: '40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'white'
        }}>
          {/* Orange Circle */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#ffab91', // Orange color from image
            zIndex: 1
          }}></div>
          {/* Light Green Circle */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#a7ffeb', // Light green color from image
            zIndex: 1
          }}></div>

          <h1 style={{
            fontSize: '2em',
            marginBottom: '30px',
            textAlign: 'center',
            color: '#333',
            fontWeight: 'normal'
          }}>interaction btw people and citizens</h1>

          <form onSubmit={submit} style={{
            width: '100%',
            maxWidth: '300px',
            padding: '20px',
            boxShadow: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
              Username
              <input
                type="text"
                value={email}
                placeholder="Username"
                onChange={e=>setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginTop: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
              Role
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginTop: '5px',
                  boxSizing: 'border-box'
                }}
              >
                <option>Citizen</option>
                <option>Politician</option>
                <option>Moderator</option>
                <option>Admin</option>
              </select>
            </label>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
              Password
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={e=>setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginTop: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                fontStyle: 'italic',
                textDecoration: 'line-through',
                color: '#FF5722',
                background: '#f0f0f0',
                padding: '5px 10px',
                borderRadius: '5px',
                letterSpacing: '2px'
              }}>{captchaText}</span>
              <button type="button" onClick={() => setCaptchaText(generateCaptcha())} style={{
                background: '#eee',
                color: '#333',
                border: '1px solid #ddd',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8em',
                fontWeight: 'normal'
              }}>Refresh</button>
            </div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#555' }}>
              Enter Captcha
              <input
                type="text"
                value={captchaInput}
                placeholder="Enter Captcha"
                onChange={e=>setCaptchaInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginTop: '5px',
                  boxSizing: 'border-box'
                }}
              />
            </label>
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <a href="#" style={{ fontSize: '0.8em', color: '#666', textDecoration: 'none' }}>Forgot Password?</a>
            </div>
            <button type="submit" style={{
              background: 'linear-gradient(to right, #4CAF50, #8BC34A)', // Green gradient
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}>
              LOGIN
              <span style={{
                background: '#ffab91', // Orange color for the arrow button
                borderRadius: '5px',
                padding: '5px 10px',
                fontSize: '1.2em',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>&gt;</span>
            </button>
            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9em', color: '#555' }}>
              Don't have an account? <a href="/register" style={{ color: '#FF5722', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</a>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div style={{
          flex: 1,
          background: '#2E7D32', // Dark green background for the image section
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          position: 'relative'
        }}>
          {/* Top and Bottom Green Bars */}
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '20px', background: '#1B5E20' }}></div>
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '20px', background: '#1B5E20' }}></div>

          {/* Image and Text Container */}
          <div style={{
            background: 'rgba(0,0,0,0.3)', // Semi-transparent overlay for the image
            borderRadius: '10px',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2
          }}>
            {/* Placeholder for the image of politicians */}
            <img
              src="https://via.placeholder.com/300x200/2E7D32/FFFFFF?text=YS+JAGAN+VS+VIJAY+THALAPATHY" // Placeholder image
              alt="YS Jagan vs Vijay Thalapathy"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '5px',
                border: '2px solid white' // White border around the image
              }}
            />
            <h3 style={{ color: 'white', textAlign: 'center', margin: '0' }}>YS JAGAN VS VIJAY THALAPATHY</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
