const Todo = require('../models/todo');

// @desc    Get all todos for the logged-in user
// @route   GET /api/todos
// @access  Private
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    console.error('❌ Error in getTodos:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
exports.createTodo = async (req, res) => {
  try {
    const { task, dueDate } = req.body;

    if (!task) {
      return res.status(400).json({ message: 'Task is required' });
    }

    const todo = await Todo.create({
      user: req.user._id,
      task,
      dueDate
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('❌ Error in createTodo:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
exports.updateTodo = async (req, res) => {
    console.log("update todo hit")
  try {
    const todo = await Todo.findOne({_id: req.params.id, user: req.user._id});

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('❌ Error in updateTodo:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({_id: req.params.id, user: req.user._id});

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('❌ Error in deleteTodo:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
