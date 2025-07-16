import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar';

import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import Goals from './Goals';
import Todos from './Todos';
import Reminders from './Reminders';  


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
      </Router>      
  );
}

export default App;
