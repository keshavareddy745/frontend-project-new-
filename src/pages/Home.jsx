export default function Home() {
  return (
    <section>
      <div className="hero">
        <h2>Improve interaction between citizens and politicians</h2>
        <p>
          Create a platform for citizens to communicate with representatives: report issues, provide feedback,
          and receive updates to improve transparency and responsiveness in governance.
        </p>
      </div>

      <div className="grid section">
        <div className="card role-card">
          <strong>Admin</strong>
          <span>Oversee operations, manage user roles, ensure data integrity.</span>
        </div>
        <div className="card role-card">
          <strong>Citizen</strong>
          <span>Report issues, provide feedback, receive updates from politicians.</span>
        </div>
        <div className="card role-card">
          <strong>Politician</strong>
          <span>Respond to concerns, post updates, engage in discussions.</span>
        </div>
        <div className="card role-card">
          <strong>Moderator</strong>
          <span>Monitor interactions, ensure respectful communication, resolve conflicts.</span>
        </div>
      </div>
    </section>
  )
}
