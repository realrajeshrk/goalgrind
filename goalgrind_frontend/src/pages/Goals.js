import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Goals.css';

function Goals() {
  const [goals, setGoals] = useState([]);
  // For new goal (add)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  // For inline edit
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');
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

  // Add new goal
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', {
        title,
        description,
        targetDate,
      });
      setSuccessMsg('Goal added!');
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

  // Inline edit mode
  const handleEdit = (goal) => {
    setEditingId(goal._id);
    setEditTitle(goal.title);
    setEditDescription(goal.description);
    setEditTargetDate(goal.targetDate ? goal.targetDate.slice(0, 10) : '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleEditChange = (field, value) => {
    if (field === 'title') setEditTitle(value);
    else if (field === 'description') setEditDescription(value);
    else if (field === 'targetDate') setEditTargetDate(value);
  };

  const handleEditSubmit = async (goalId) => {
    try {
      await api.put(`/goals/${goalId}`, {
        title: editTitle,
        description: editDescription,
        targetDate: editTargetDate
      });
      setSuccessMsg('Goal updated!');
      setEditingId(null);
      fetchGoals();
    } catch {
      setErrorMsg('Failed to update goal.');
      setSuccessMsg('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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

  return (
    <div className="goals-container">
      {/* Form for adding only */}
      <form className="goal-form" onSubmit={handleAddSubmit} autoComplete="off">
        <input
          placeholder="Title "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (details about your goal)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="goal-desc-input"
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          placeholder="Target Date"
        />
        <button type="submit">Add Goal</button>
      </form>
      {(errorMsg || successMsg) && (
        <div className={errorMsg ? 'alert-error' : 'alert-success'}>
          {errorMsg ? errorMsg : successMsg}
        </div>
      )}
      {goals.length > 0 && (
        <div className="goal-list-vertical">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-card-vertical">
              {editingId === goal._id ? (
                <div>
                  <input
                    value={editTitle}
                    onChange={e => handleEditChange('title', e.target.value)}
                    placeholder="Title"
                    required
                  />
                  <textarea
                    value={editDescription}
                    onChange={e => handleEditChange('description', e.target.value)}
                    placeholder="Description"
                    required
                    rows={4}
                    className="goal-desc-input"
                  />
                  <input
                    type="date"
                    value={editTargetDate}
                    onChange={e => handleEditChange('targetDate', e.target.value)}
                    required
                  />
                  <div className="goal-actions">
                    <button onClick={() => handleEditSubmit(goal._id)}>Save</button>
                    <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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