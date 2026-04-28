import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex-column items-center w-full" style={{ padding: '4rem 0' }}>
      <div className="viz-container" style={{ marginBottom: '4rem' }}>
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

        <div className="viz-label">Empowering Direct Democracy</div>
      </div>

      <div className="card" style={{ 
        maxWidth: '1000px', 
        width: '100%', 
        padding: '5rem 3rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--gov-border)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 2rem',
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Emblem_of_Andhra_Pradesh.svg/1200px-Emblem_of_Andhra_Pradesh.svg.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }} />
        
        <h1 style={{ 
          fontSize: '4.5rem', 
          marginBottom: '1.5rem',
          lineHeight: '1.1',
          fontWeight: '900',
          background: 'linear-gradient(to right, var(--gov-blue-800), var(--gov-accent))', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>
          CIVIC <span style={{ color: 'var(--gov-accent)', WebkitTextFillColor: 'var(--gov-accent)' }}>CONNECT</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.35rem', 
          maxWidth: '750px', 
          margin: '0 auto 3rem',
          lineHeight: '1.6',
          color: 'var(--gov-text-secondary)',
          fontWeight: '500'
        }}>
          The official digital bridge for the citizens of Andhra Pradesh. 
          Empowering community engagement through transparent communication, 
          direct reporting, and professional governance oversight.
        </p>

        <div className="flex justify-center gap-6">
          <Link to="/login" className="btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', textDecoration: 'none', borderRadius: '15px' }}>
            Access Portal
          </Link>
          <Link to="/register" className="action-btn" style={{ 
            padding: '1.25rem 4rem', 
            fontSize: '1.2rem', 
            textDecoration: 'none',
            border: '2px solid var(--gov-accent)',
            color: 'var(--gov-accent)',
            background: 'transparent',
            borderRadius: '15px',
            fontWeight: '700'
          }}>
            Request Account
          </Link>
        </div>
      </div>

      <div className="dashboard-grid w-full" style={{ maxWidth: '1200px', marginTop: '4rem' }}>
        <div className="card col-span-4" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏛️</div>
          <h3>Public Service</h3>
          <p className="text-secondary">Dedicated tools for citizens to voice concerns and track regional developments directly.</p>
        </div>
        <div className="card col-span-4" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📊</div>
          <h3>Policy Insights</h3>
          <p className="text-secondary">Official updates and directives from representatives regarding local and state initiatives.</p>
        </div>
        <div className="card col-span-4" style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🛡️</div>
          <h3>Governance</h3>
          <p className="text-secondary">Secure administrative oversight to ensure platform integrity and verify official communications.</p>
        </div>
      </div>
      
      <div style={{ marginTop: '6rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--gov-text-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em', fontWeight: '700' }}>
          OFFICIAL PORTAL OF THE GOVERNMENT OF ANDHRA PRADESH
        </p>
      </div>
    </div>
  )
}
