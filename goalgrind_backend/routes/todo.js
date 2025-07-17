const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {getTodos, createTodo, updateTodo, deleteTodo} = require('../controllers/todoController');

router.route('/')
.get(protect, getTodos)
.post(protect, createTodo)

router.route("/:id")
.put(protect, updateTodo)
.delete(protect, deleteTodo)

module.exports = router;