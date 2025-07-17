import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Dashboard.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, todosRes, remindersRes] = await Promise.all([
          api.get('/goals'),
          api.get('/todos'),
          api.get('/reminders')
        ]);
        setGoals(goalsRes.data.goals || []);
        setTodos(todosRes.data.todos || []);
        setReminders(remindersRes.data.reminders || []);
      } catch (err) {
        // gracefully ignore errors
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dash-title">🌟 Hi {user.name}, Welcome to Your Dashboard 🌟</h1>
      <div className="dashboard-stats">
        <div className="stat-card goal-grad">
          <h2>Goals</h2>
          <div className="stat-num">{goals.length}</div>
          <span>Actively Pursued</span>
        </div>
        <div className="stat-card todo-grad">
          <h2>Todos</h2>
          <div className="stat-num">{todos.length}</div>
          <span>Your Task List</span>
        </div>
        <div className="stat-card remind-grad">
          <h2>Reminders</h2>
          <div className="stat-num">{reminders.length}</div>
          <span>Stay On Track</span>
        </div>
      </div>

      <div className="dashboard-lists">
        <div>
          <h3>Recent Goals</h3>
          <ul>
            {goals.slice(0, 3).map(goal => (
              <li key={goal._id}>
                <b>{goal.title}:</b> {goal.description} <span className="date-chip">{goal.targetDate?.slice(0,10)}</span>
              </li>
            ))}
            {goals.length === 0 && <li>No goals yet</li>}
          </ul>
        </div>
        <div>
          <h3>Upcoming Todos</h3>
          <ul>
            {todos.slice(0, 3).map(todo => (
              <li key={todo._id}>
                <b>{todo.task}</b> <span className="date-chip">{todo.dueDate?.replace('T',' ').slice(0,16)}</span> {todo.isCompleted ? '✅' : '⌛'}
              </li>
            ))}
            {todos.length === 0 && <li>No todos yet</li>}
          </ul>
        </div>
        <div>
          <h3>Next Reminders</h3>
          <ul>
            {reminders
              .slice(0, 3)
              .map(rem => (
                <li key={rem._id}>
                  <b>{rem.title}</b> <span className="date-chip">{rem.remindAt?.replace('T',' ').slice(0,16)}</span> {rem.isDone ? '✅' : '⏰'}
                </li>
              ))}
            {reminders.length === 0 && <li>No reminders yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
