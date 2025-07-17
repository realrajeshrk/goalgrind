import api from '../api/axios';
import { useState, useEffect } from 'react';
import './Todos.css';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Clear messages on relevant changes
  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data.todos || []);
      setError('');
    } catch (err) {
      setError('Error fetching todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    const todoData = { task, dueDate, isCompleted };
    try {
      if (editingId) {
        await api.put(`/todos/${editingId}`, todoData);
        setEditingId(null);
        setMessage('Todo updated successfully!');
      } else {
        await api.post('/todos', todoData);
        setMessage('Todo added successfully!');
      }
      setTask('');
      setDueDate('');
      setIsCompleted(false);
      fetchTodos();
    } catch (err) {
      setError('Failed to save todo');
    }
  };

  const handleEdit = (todo) => {
    clearMessages();
    setTask(todo.task);
    setDueDate(todo.dueDate?.slice(0, 16));
    setIsCompleted(todo.isCompleted);
    setEditingId(todo._id);
  };

  const deleteTodo = async (id) => {
    clearMessages();
    try {
      await api.delete(`/todos/${id}`);
      setMessage('Todo deleted.');
      fetchTodos();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="todos-page-vertical">
      <div className="todo-form-box">
        {(error || message) && (
          <div className={`todo-alert ${error ? 'error' : 'success'}`}>
            {error || message}
          </div>
        )}
        <h2 className="todo-section-title">
          {editingId ? 'Edit Todo' : 'Add Todo'}
        </h2>
        <form className="todo-form-vertical" onSubmit={handleSubmit}>
          <div className="todo-form-row">
            <label>Task</label>
            <input
              className="todo-input"
              placeholder="Task"
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                clearMessages();
              }}
              required
            />
          </div>
          <div className="todo-form-row">
            <label>Due Date</label>
            <input
              className="todo-input"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                clearMessages();
              }}
            />
          </div>
          <div className="todo-form-row">
            <label className="todo-checkbox-label">
              <input
                type="checkbox"
                disabled={editingId === 'Add Todo'}
                checked={isCompleted}
                onChange={(e) => {
                  setIsCompleted(e.target.checked);
                  clearMessages();
                }}
              />
              Completed
            </label>
          </div>
          <div className="todo-form-btn-row">
            <button className="todo-btn" type="submit">
              {editingId ? 'Update' : 'Add'} Todo
            </button>
            {editingId && (
              <button
                type="button"
                className="todo-btn-cancel"
                onClick={() => {
                  setEditingId(null);
                  setTask('');
                  setDueDate('');
                  setIsCompleted(false);
                  clearMessages();
                }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="todo-list-vertical">
        {todos.length === 0 ? (
          <div className="todo-empty">No todos yet.</div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-card-vertical ${todo.isCompleted ? 'completed' : ''}`}>
              <div className="todo-card-content">
                <div className="todo-task">
                  <span className="todo-task-title">{todo.task}</span>
                  <span className="todo-status">
                    {todo.isCompleted ? '✅' : '⌛'}
                  </span>
                </div>
                {todo.dueDate && (
                  <div className="todo-duedate">
                    🗓 {todo.dueDate.replace('T', ' ').slice(0, 16)}
                  </div>
                )}
              </div>
              <div className="todo-actions">
                <button
                  className="todo-action-btn"
                  onClick={() => handleEdit(todo)}>
                  ✏️
                </button>
                <button
                  className="todo-action-btn"
                  onClick={() => deleteTodo(todo._id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Todos;