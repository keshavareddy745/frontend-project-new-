import { useState } from 'react'
import { getReports, getFeedback, getUpdates, getResponses, getFlags, addFlag } from '../store.js'

export default function Moderator() {
  const [reason, setReason] = useState('')
  const reports = getReports()
  const feedback = getFeedback()
  const updates = getUpdates()
  const responses = getResponses()
  const flags = getFlags()

  function flagItem(type, id) {
    if (!reason) {
      alert('Please provide a reason for flagging')
      return
    }
    addFlag({ type, refId: id, reason })
    setReason('')
    alert('Item flagged for review')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Moderator Dashboard</h2>
          <p>Monitor platform content and flag inappropriate items.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Reports</span>
          <span className="stat-value">{reports.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Flags Raised</span>
          <span className="stat-value">{flags.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Feedback</span>
          <span className="stat-value">{feedback.length}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Moderation Action</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <input 
            placeholder="Enter reason for flagging..." 
            value={reason} 
            onChange={e=>setReason(e.target.value)}
            style={{ flex: 1 }}
          />
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Enter reason above, then click 'Flag' on any item below.
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Community Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {reports.length === 0 ? <p style={{ color: '#94a3b8' }}>No reports.</p> : reports.map(r => (
              <div key={r.id} style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{r.title}</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{r.description}</div>
                <button 
                  className="action-btn btn-danger" 
                  style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  onClick={() => flagItem('report', r.id)}
                >
                  Flag Report
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Citizen Feedback</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {feedback.length === 0 ? <p style={{ color: '#94a3b8' }}>No feedback.</p> : feedback.map(f => (
              <div key={f.id} style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ color: '#f8fafc', marginBottom: '0.25rem' }}>{f.message}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>By: {f.citizenName || 'Anonymous'}</div>
                <button 
                  className="action-btn btn-danger" 
                  style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  onClick={() => flagItem('feedback', f.id)}
                >
                  Flag Feedback
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Flagged Content Logs</h3>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          {flags.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No flags raised yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Item ID</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {flags.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className="badge badge-danger" style={{ 
                        padding: '4px 10px', 
                        fontSize: '0.75rem',
                        borderRadius: '999px'
                      }}>
                        {f.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>#{f.refId}</td>
                    <td style={{ color: '#cbd5e1' }}>{f.reason}</td>
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(f.id).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
