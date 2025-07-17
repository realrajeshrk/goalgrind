import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Reminders from './pages/Reminder';
import Todos from './pages/Todos';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <PrivateRoute>
              <Todos />
            </PrivateRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
