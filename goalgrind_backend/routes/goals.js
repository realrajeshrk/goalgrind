const express = require('express');
const router = express.Router();
const protect =require('../middleware/authMiddleware')

const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalcontroller');
console.log('goal file loaded')

router.route('/')
.get(protect,getGoals)
.post(protect,createGoal)

router.route('/:id')
.put(protect, updateGoal)
.delete(protect,deleteGoal)

module.exports = router;