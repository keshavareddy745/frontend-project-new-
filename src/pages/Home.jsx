import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div className="hero" style={{ 
        maxWidth: '900px', 
        width: '100%',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: '900', 
          marginBottom: '1.5rem',
          color: '#f8fafc',
          textShadow: '0 10px 30px rgba(0,0,0,0.5)',
          letterSpacing: '-0.03em',
          lineHeight: '1'
        }}>
          WELCOME TO <br/>
          <span style={{ color: '#3b82f6' }}>CIVIC CONNECT</span>
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#cbd5e1', 
          marginBottom: '2.5rem',
          maxWidth: '700px',
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.6'
        }}>
          Bridging the gap between citizens and their representatives. 
          A professional platform for transparent governance, 
          direct communication, and community progress.
        </p>
        <Link to="/login" className="action-btn btn-primary" style={{ 
          padding: '1rem 3rem', 
          fontSize: '1.125rem',
          textDecoration: 'none',
          display: 'inline-block',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          fontWeight: '700',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
        }}>
          Get Started / Login
        </Link>
      </div>

      <div className="grid section" style={{ marginTop: '4rem', width: '100%', maxWidth: '1200px' }}>
        <div className="card role-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚖️</div>
          <strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Admin</strong>
          <span style={{ color: '#94a3b8' }}>Oversee operations, manage user roles, and ensure platform integrity.</span>
        </div>
        <div className="card role-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📢</div>
          <strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Citizen</strong>
          <span style={{ color: '#94a3b8' }}>Report community issues, track progress, and engage with leaders.</span>
        </div>
        <div className="card role-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
          <strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Politician</strong>
          <span style={{ color: '#94a3b8' }}>Respond to concerns, post official updates, and drive community growth.</span>
        </div>
        <div className="card role-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
          <strong style={{ fontSize: '1.25rem', color: '#f8fafc' }}>Moderator</strong>
          <span style={{ color: '#94a3b8' }}>Ensure respectful communication and maintain platform standards.</span>
        </div>
      </div>
    </section>
  )
}
