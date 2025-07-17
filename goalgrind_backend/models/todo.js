const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    task : {
        type: String,
        required: true,
        trim: true,
        maxlength:30
    },
    isCompleted : {
        type: Boolean,
        default: false
    },
    dueDate : {
        type: Date
    }

}, {timestamps: true});

module.exports = mongoose.model('Todo', toDoSchema)