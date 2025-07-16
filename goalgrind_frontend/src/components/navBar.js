import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>GoalGrind</h3>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/goals" style={styles.link}>Goals</Link>
            <Link to="/reminders" style={styles.link}>Reminders</Link>
            <Link to="/todos" style={styles.link}>Todos</Link>
            <button onClick={logout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: '#282c34',
    color: 'white',
  },
  logo: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    background: 'transparent',
    color: 'white',
    border: '1px solid white',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
  },
};

export default Navbar;
