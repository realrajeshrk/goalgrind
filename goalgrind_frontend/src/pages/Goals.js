import { useEffect, useState } from 'react';
import api from '../api/axios';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data.goals);
    } catch (err) {
      alert('Error fetching goals');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalData = { title, description, targetDate };

    try {
      if (editingId) {
        // UPDATE goal
        await api.put(`/goals/${editingId}`, goalData);
        setEditingId(null);
      } else {
        // CREATE goal
        await api.post('/goals', goalData);
      }

      // Reset form and refresh
      setTitle('');
      setDescription('');
      setTargetDate('');
      fetchGoals();
    } catch (err) {
      alert('Failed to save goal');
    }
  };

  const handleEdit = (goal) => {
    setTitle(goal.title);
    setDescription(goal.description);
    setTargetDate(goal.targetDate?.slice(0, 10));
    setEditingId(goal._id);
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div>
      <h2>{editingId ? 'Edit Goal' : 'Add Goal'}</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Goal</button>
        {editingId && <button onClick={() => setEditingId(null)}>Cancel</button>}
      </form>

      <ul>
        {goals.map((goal) => (
          <li key={goal._id}>
            <strong>{goal.title}</strong> — {goal.description} (🎯 {goal.targetDate?.slice(0, 10)})
            <button onClick={() => handleEdit(goal)}>✏️</button>
            <button onClick={() => deleteGoal(goal._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;
