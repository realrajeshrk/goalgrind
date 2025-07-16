import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navBar'
import Login from './pages/Login';
import Register from './pages/Register';
//import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
//import Reminders from './pages/Reminders';
//import Todos from './pages/Todos';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <Goals />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/reminders"
          element={
            <PrivateRoute>
              <Reminders />
            </PrivateRoute>
          }
        /> */}
        {/* <Route
          path="/todos"
          element={
            <PrivateRoute>
              <Todos />
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;
