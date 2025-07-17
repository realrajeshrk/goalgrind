const express = require('express');
const router = express.Router();
const { registerUser, loginUser, regUser } = require('../controllers/authController');
console.log('auth file loaded')
router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;