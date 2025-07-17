import { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

function Register() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_()+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

  const resetFieldErrors = () =>
    setFieldError({ name: '', email: '', password: '', confirm: '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFieldErrors();
    setError('');

    let hasError = false;
    let newFieldError = { name: '', email: '', password: '', confirm: '' };

    if (!name.trim()) {
      newFieldError.name = 'Name is required';
      hasError = true;
    }
    if (!isValidEmail(email)) {
      newFieldError.email = 'Enter a valid email';
      hasError = true;
    }
    if (!password) {
      newFieldError.password = 'Password is required';
      hasError = true;
    } else if (!isStrongPassword(password)) {
      newFieldError.password =
        'Password must be min 8 chars, contain 1 uppercase, 1 lowercase, 1 number and 1 special character';
      hasError = true;
    }
    if (password !== confirm) {
      newFieldError.confirm = "Passwords don't match";
      hasError = true;
    }

    setFieldError(newFieldError);
    if (hasError) return;

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Sign Up for GoalGrind</h2>
      <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="input-group">
          <input
            placeholder="Name"
            value={name}
            className={fieldError.name ? 'error-input' : ''}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          {fieldError.name && <div className="error-msg">{fieldError.name}</div>}
        </div>
        <div className="input-group">
          <input
            placeholder="Email"
            value={email}
            className={fieldError.email ? 'error-input' : ''}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            type="email"
          />
          {fieldError.email && <div className="error-msg">{fieldError.email}</div>}
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            className={fieldError.password ? 'error-input' : ''}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          {fieldError.password && <div className="error-msg">{fieldError.password}</div>}
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            className={fieldError.confirm ? 'error-input' : ''}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="off"
          />
          {fieldError.confirm && <div className="error-msg">{fieldError.confirm}</div>}
        </div>
        <button type="submit">Register</button>
        {error && <div className="main-error-msg">{error}</div>}
        <div className="note">
          <strong>Password must contain:</strong> 1 uppercase, 1 lowercase, 1 number &amp; 1 special character, min 8 characters.
        </div>
      </form>
    </div>
  );
}

export default Register;

