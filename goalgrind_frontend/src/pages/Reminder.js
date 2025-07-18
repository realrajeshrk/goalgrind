import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Reminder.css';

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '');
}

function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [inlineEdit, setInlineEdit] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data.reminders);
    } catch (err) {
      alert('Error fetching reminders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    const reminderData = { title, remindAt, isDone };
    try {
      await api.post('/reminders', reminderData);
      setTitle('');
      setRemindAt('');
      setIsDone(false);
      await fetchReminders();
    } catch (err) {
      alert('Failed to save reminder');
    } finally {
      setAdding(false);
    }
  };

  const handleEditChange = (id, field, value) => {
    setInlineEdit((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleStartEdit = (reminder) => {
    setInlineEdit((prev) => ({
      ...prev,
      [reminder._id]: {
        title: reminder.title,
        remindAt: reminder.remindAt?.slice(0, 16),
        isDone: reminder.isDone,
      },
    }));
    setEditingId(reminder._id);
  };

  const saveEdit = async (id) => {
    setLoadingId(id);
    const data = inlineEdit[id];
    try {
      await api.put(`/reminders/${id}`, {
        ...data,
      });
      setEditingId(null);
      setInlineEdit((prev) => {
        const { [id]: omit, ...rest } = prev;
        return rest;
      });
      fetchReminders();
    } catch (err) {
      alert('Failed to update');
    } finally {
      setLoadingId(null);
    }
  };

  const cancelEdit = (id) => {
    setEditingId(null);
    setInlineEdit((prev) => {
      const { [id]: omit, ...rest } = prev;
      return rest;
    });
  };

  const deleteReminder = async (id) => {
    setLoadingId(id);
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="reminder-container">
      <h2>Reminders</h2>
      <form className="reminder-form" onSubmit={handleSubmit}>
        <input
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          type="text"
          disabled={adding}
        />
        <input
          type="datetime-local"
          palceholder= "Remind at"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          required
          disabled={adding}
        />
        <button type="submit" disabled={adding || !title || !remindAt}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      <ul className="reminder-list">
        {reminders.map((reminder) => {
          const isEditing = editingId === reminder._id;
          return (
            <li
              key={reminder._id}
              className={
                'reminder-list-item' +
                (isEditing ? ' editing' : '') +
                (loadingId === reminder._id ? ' loading' : '')
              }
            >
              {!isEditing ? (
  <div className="reminder-view">
    <div className="reminder-main-row">
      <span className="reminder-title">{reminder.title}</span>
      <span className="reminder-date">
        {formatDisplayDate(reminder.remindAt)}
      </span>
    </div>
    <div className="reminder-actions-row">
      <span className="reminder-status">
        {reminder.isDone ? '✅' : '⏰'}
      </span>
      <button
        type="button"
        onClick={() => handleStartEdit(reminder)}
        aria-label="Edit"
        title="Edit"
        disabled={!!editingId}
      >
        ✏️
      </button>
      <button
        type="button"
        onClick={() => deleteReminder(reminder._id)}
        aria-label="Delete"
        title="Delete"
        disabled={loadingId === reminder._id}
      >
        ❌
      </button>
    </div>
  </div>
)  : (
                <form
  className="reminder-inline-edit"
  onSubmit={async (e) => {
    e.preventDefault();
    await saveEdit(reminder._id);
  }}
>
  <div className="edit-field">
      <input
        type="text"
        required
        value={inlineEdit[reminder._id]?.title || ''}
        onChange={(e) =>
          handleEditChange(reminder._id, 'title', e.target.value)
        }
      />
  </div>
  <div className="edit-field">
    
      <input
        type="datetime-local"
        required
        value={inlineEdit[reminder._id]?.remindAt || ''}
        onChange={(e) =>
          handleEditChange(reminder._id, 'remindAt', e.target.value)
        }
      />

  </div>
  <div className="edit-field checkbox">
        <label>
          Completed  <input
        type="checkbox"
        checked={inlineEdit[reminder._id]?.isDone || false}
        onChange={(e) =>
          handleEditChange(reminder._id, 'isDone', e.target.checked)
        }
      />
        </label>
     
  
  </div>
  <div className="edit-actions-row">
    <button
      type="submit"
      className="save-btn"
      disabled={loadingId === reminder._id}
    >
      {loadingId === reminder._id ? 'Saving...' : 'Save'}
    </button>
    <button
      type="button"
      className="cancel-btn"
      onClick={() => cancelEdit(reminder._id)}
    >
      Cancel
    </button>
  </div>
</form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Reminder;
