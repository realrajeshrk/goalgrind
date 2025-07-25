import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './navBar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const homeLink = user ? "/dashboard" : "/";

  // For closing menu on link click (mobile experience)
  const handleLinkClick = () => setOpen(false);

  // Compose links based on auth status
  const links = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/goals", label: "Goals" },
        { to: "/reminders", label: "Reminders" },
        { to: "/todos", label: "Todos" },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ];

  // On mobile: if user, show only max 3 headings in menu (hide 2 if more than 3)
  // So only Goals, Reminders, and Logout/toggle in hamburger
  // Dashboard link is replaced by the brand/home, so it's always shown


  return (
    <nav className="navbar">
      <Link to={homeLink} className="navbar-logo" onClick={handleLinkClick}>
        GoalGrind
      </Link>
      <button
        className="navbar-toggle"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
      <div className={`navbar-links${open ? ' open' : ''}`}>
        {user
          ? (
            <>
              {links.map(({ to, label }) => (
                <Link to={to} className="navbar-link" key={to} onClick={handleLinkClick}>
                  {label}
                </Link>
              ))}
              <button className="navbar-button" onClick={() => {logout(); handleLinkClick();}}>
                Logout
              </button>
            </>
          ) : (
            links.map(({ to, label }) => (
              <Link to={to} className="navbar-link" key={to} onClick={handleLinkClick}>
                {label}
              </Link>
            ))
          )
        }
      </div>
    </nav>
  );
}

export default Navbar;