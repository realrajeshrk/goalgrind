import { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate(); // <-- Add this line

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setInfo('Logging in...');
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard'); // <-- Redirect after successful login

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setInfo('');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue your journey</p>
        <div className="login-field">
          <label>Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
        />
        </div>
        <div className="login-field">
          <label>Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
        />
    </div>
        {error && <div className="login-error">{error}</div>}
        {info && <div className="login-info">{info}</div>}
        <button className="login-btn" type="submit">Login</button>
      </form>
      <div className="login-bg-decor"></div>
    </div>
  );
}

export default Login;

