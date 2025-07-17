import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Reminder.css';

function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

    const reminderData = { title, remindAt, isDone };

    try {
      if (editingId) {
        await api.put(`/reminders/${editingId}`, reminderData);
        setEditingId(null);
      } else {
        await api.post('/reminders', reminderData);
      }

      setTitle('');
      setRemindAt('');
      setIsDone(false);
      fetchReminders();
    } catch (err) {
      alert('Failed to save reminder');
    }
  };

  const handleEdit = (reminder) => {
    setTitle(reminder.title);
    setRemindAt(reminder.remindAt?.slice(0, 16));
    setIsDone(reminder.isDone);
    setEditingId(reminder._id);
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="reminder-container">
      <h2>{editingId ? 'Edit Reminder' : 'Add Reminder'}</h2>
      <form className="reminder-form" onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          type="text"
        />
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isDone}
            onChange={(e) => setIsDone(e.target.checked)}
          />
          Done
        </label>
        <button type="submit">{editingId ? 'Update' : 'Add'} Reminder</button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        )}
      </form>
      <ul className="reminder-list">
        {reminders.map((reminder) => (
          <li key={reminder._id}>
            <strong>{reminder.title}</strong> — 🕑 {reminder.remindAt?.replace('T', ' ').slice(0, 16)}
            <span>{reminder.isDone ? ' ✅' : ' ⏰'}</span>
            <button onClick={() => handleEdit(reminder)} title="Edit">✏️</button>
            <button onClick={() => deleteReminder(reminder._id)} title="Delete">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reminder;

