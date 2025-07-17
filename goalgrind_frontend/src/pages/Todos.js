import api from '../api/axios';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos');
      setTodos(res.data.todos);
    } catch (err) {
      alert('Error fetching todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todoData = { task, dueDate, isCompleted };
    try {
      if (editingId) {
        await api.put(`/todos/${editingId}`, todoData);
        setEditingId(null);
      } else {
        await api.post('/todos', todoData);
      }
      setTask('');
      setDueDate('');
      setIsCompleted(false);
      fetchTodos();
    } catch (err) {
      alert('Failed to save todo');
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setDueDate(todo.dueDate?.slice(0, 16));
    setIsCompleted(todo.isCompleted);
    setEditingId(todo._id);
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h2>{editingId ? 'Edit Todo' : 'Add Todo'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          Completed
        </label>
        <button type="submit">{editingId ? 'Update' : 'Add'} Todo</button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        )}
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <strong>{todo.task}</strong>
            {todo.dueDate && (
              <>
                {' — 🗓 '}
                {todo.dueDate.replace('T', ' ').slice(0, 16)}
              </>
            )}
            <span>{todo.isCompleted ? ' ✅' : ' ⌛'}</span>
            <button onClick={() => handleEdit(todo)}>✏️</button>
            <button onClick={() => deleteTodo(todo._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;

