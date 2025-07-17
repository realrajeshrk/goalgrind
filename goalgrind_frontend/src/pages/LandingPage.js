import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-bg-blob"></div>
      <div className="landing-bg-blob2"></div>
      <div className="landing-box">
        <div className="logo-emoji">🎯</div>
        <h1 className="main-title">Welcome to GoalGrind</h1>
        <p className="subtitle">
          Your all-in-one productivity hub to take control of your life.
        </p>

        <div className="feature-section">
          <h2>🔥 What You Can Do</h2>
          <ul className="features">
            <li><strong>🎯 Set and track goals:</strong> Define goals with deadlines and track your progress.</li>
            <li><strong>✅ Manage todos:</strong> Add, update, and check off daily tasks efficiently.</li>
            <li><strong>⏰ Smart reminders:</strong> Set due dates with reminders so you never miss a task.</li>
            <li><strong>📊 Clean dashboard:</strong> Get a clear view of everything — goals, tasks, reminders.</li>
            <li><strong>🔐 Secure auth:</strong> Signup, login, and logout with secure token-based authentication.</li>
            <li><strong>🧠 AI insights (Coming Soon):</strong> Analyze your productivity trends and get smart suggestions.</li>
          </ul>
        </div>

        <div className="cta-buttons">
          <Link to="/register" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
        <div className="testimonial">
          “GoalGrind helped me finally stay on track with my goals. The reminders are a game changer!”<br />
          <span style={{fontWeight: 600, color: "#2563eb"}}>— Happy User</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;