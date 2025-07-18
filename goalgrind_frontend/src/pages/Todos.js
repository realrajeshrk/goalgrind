import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './Todos.css';

function TodoCard({ todo, isEditing, onEdit, onSave, onCancel, onDelete, animate }) {
  const [editTask, setEditTask] = useState(todo.task);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? todo.dueDate.slice(0, 16) : '');
  const [editCompleted, setEditCompleted] = useState(todo.isCompleted);

  useEffect(() => {
    setEditTask(todo.task);
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 16) : '');
    setEditCompleted(todo.isCompleted);
  }, [todo, isEditing]);

  return (
    <div
      className={
        `todo-card-vertical${todo.isCompleted ? ' completed' : ''}${animate ? ' todo-animate-in' : ''}`
      }
      style={isEditing ? {borderColor:'#bea6ff', background:"#f9f2ff"} : undefined}
    >
      {!isEditing ? (
        <>
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
            <button className="todo-action-btn" onClick={() => onEdit(todo)} title="Edit">
              ✏️
            </button>
            <button className="todo-action-btn" onClick={() => onDelete(todo._id)} title="Delete">
              🗑️
            </button>
          </div>
        </>
      ) : (
        <form
          className="todo-inline-edit-form"
          onSubmit={e => {
            e.preventDefault();
            onSave(todo._id, {
              task: editTask,
              dueDate: editDueDate,
              isCompleted: editCompleted
            });
          }}
        >
          <div className="todo-form-row">
            <input
              className="todo-input"
              value={editTask}
              autoFocus
              onChange={e => setEditTask(e.target.value)}
              required
              style={{marginBottom: 6}}
            />
            <input
              className="todo-input"
              type="datetime-local"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
            />
          </div>
          <div className="todo-inline-edit-actions">
            <label className="todo-checkbox-label">
              <input
                type="checkbox"
                checked={editCompleted}
                onChange={e => setEditCompleted(e.target.checked)}
              />
              Completed
            </label>
            <button type="submit" className="todo-btn todo-inline-save" title="Save">💾</button>
            <button type="button" className="todo-btn-cancel todo-inline-cancel" onClick={onCancel}>✖</button>
          </div>
        </form>
      )}
    </div>
  );
}

function AddTodoRow({ onAdd, loading }) {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAdd = e => {
    e.preventDefault();
    if (!task) return;
    onAdd({ task, dueDate, isCompleted });
    setTask('');
    setDueDate('');
    setIsCompleted(false);
  };

  return (
    <form className="todo-add-row todo-card-vertical todo-animate-in" onSubmit={handleAdd}>
      <div className="todo-card-content">
        <div className="todo-form-row" style={{marginBottom: 3}}>
          <input
            placeholder="New todo..."
            className="todo-input"
            value={task}
            onChange={e => setTask(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="todo-form-row" style={{marginBottom:0}}>
          <input
            type="datetime-local"
            className="todo-input"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <div className="todo-actions">
        <button className="todo-btn todo-add-btn" type="submit" disabled={loading}>＋</button>
        <label className="todo-checkbox-label" style={{fontSize:'1em', marginTop:4}}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={e => setIsCompleted(e.target.checked)}
            disabled={loading}
          /> 
          Completed
        </label>
      </div>
    </form>
  );
}

function Todos() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateIds, setAnimateIds] = useState([]);

  // Fetch
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/todos');
      setTodos(res.data.todos || []);
      setError('');
    } catch (err) {
      setError('Error fetching todos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  // For animation: Pop-up on add
  const animateTodoId = (id) => {
    setAnimateIds(ids => [...ids, id]);
    setTimeout(() => setAnimateIds(ids => ids.filter(tid => tid !== id)), 650);
  };

  // Add
  const handleAddTodo = async (todo) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/todos', todo);
      setMessage('Todo added!');
      setLoading(false);
      await fetchTodos();
      animateTodoId(res.data.todo._id);
    } catch(e) {
      setLoading(false);
      setError('Failed to add todo.');
    }
  };

  // Edit with inline form
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setError('');
    setMessage('');
  };

  const handleSaveEdit = async (id, data) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.put(`/todos/${id}`, data);
      setEditingId(null);
      setMessage('Todo updated!');
      await fetchTodos();
      animateTodoId(id);
    } catch (e) {
      setError('Update failed.');
    }
    setLoading(false);
  };

  // Cancel inline edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setError('');
    setMessage('');
  };

  // Delete with animation
  const handleDelete = async (id) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.delete(`/todos/${id}`);
      setMessage('Deleted!');
      setLoading(false);
      setTodos(todos => todos.filter(t => t._id !== id));
      setTimeout(fetchTodos, 350);
    } catch(e) {
      setLoading(false);
      setError('Delete failed.');
    }
  };

  return (
    <div className="todos-page-vertical">
      {(error || message) && (
        <div className={`todo-alert ${error ? 'error' : 'success'}`}>{error || message}</div>
      )}
      <div className="todo-list-vertical">
        {todos.length === 0 && (
          <div className="todo-empty todo-animate-in">No todos yet.</div>
        )}
        {todos.map(todo => (
          <TodoCard
            key={todo._id}
            todo={todo}
            isEditing={editingId === todo._id}
            onEdit={handleEdit}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onDelete={handleDelete}
            animate={animateIds.includes(todo._id)}
          />
        ))}
        <AddTodoRow onAdd={handleAddTodo} loading={loading} />
      </div>
    </div>
  );
}

export default Todos;