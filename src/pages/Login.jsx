import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCurrentRole, setCurrentUser } from '../store.js'

export default function Login() {
  const [role, setRole] = useState('Citizen')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault()
    if (!email || !password) return
    setCurrentRole(role)
    setCurrentUser({ email })
    navigate('/dashboard')
  }

  return (
    <section className="container" style={{ maxWidth: 560 }}>
      <h2>Login</h2>
      <form className="card" onSubmit={submit}>
        <label>
          Email
          <input type="email" value={email} placeholder="you@example.com" onChange={e=>setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} placeholder="••••••••" onChange={e=>setPassword(e.target.value)} />
        </label>
        <label>
          Role
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option>Admin</option>
            <option>Moderator</option>
            <option>Politician</option>
            <option>Citizen</option>
          </select>
        </label>
        <button type="submit">Continue</button>
      </form>
    </section>
  )
}
