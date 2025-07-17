const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  remindAt: {
    type: Date,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
