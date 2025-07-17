import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Goals.css';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data.goals || []);
      setErrorMsg('');
    } catch {
      setErrorMsg('Unable to load goals.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/goals/${editingId}`, {
          title,
          description,
          targetDate,
        });
        setSuccessMsg('Goal updated!');
        setEditingId(null);
      } else {
        await api.post('/goals', {
          title,
          description,
          targetDate,
        });
        setSuccessMsg('Goal added!');
      }
      setTitle('');
      setDescription('');
      setTargetDate('');
      fetchGoals();
      setErrorMsg('');
    } catch {
      setErrorMsg('Failed to save goal.');
      setSuccessMsg('');
    }
  };

  const handleEdit = (goal) => {
    setTitle(goal.title);
    setDescription(goal.description);
    setTargetDate(goal.targetDate ? goal.targetDate.slice(0, 10) : '');
    setEditingId(goal._id);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      setSuccessMsg('Goal deleted!');
      fetchGoals();
    } catch {
      setErrorMsg('Failed to delete goal.');
      setSuccessMsg('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setTargetDate('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="goals-container">
      <form className="goal-form" onSubmit={handleSubmit} autoComplete="off">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Goal</button>
        {editingId && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>
      {(errorMsg || successMsg) && (
        <div className={errorMsg ? 'alert-error' : 'alert-success'}>
          {errorMsg ? errorMsg : successMsg}
        </div>
      )}

      {/* Only show cards if goals exist */}
      {goals.length > 0 && (
        <div className="goal-list-vertical">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-card-vertical">
              <div>
                <h3 className="goal-title">{goal.title}</h3>
                <p className="goal-desc">{goal.description}</p>
                <div className="goal-date">
                  🎯 Target Date:{' '}
                  {goal.targetDate ? goal.targetDate.slice(0, 10) : '-'}
                </div>
              </div>
              <div className="goal-actions">
                <button onClick={() => handleEdit(goal)}>✏️</button>
                <button onClick={() => handleDelete(goal._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {goals.length === 0 && (
        <div className="goals-empty">No goals yet. Add your first goal!</div>
      )}
    </div>
  );
}

export default Goals;