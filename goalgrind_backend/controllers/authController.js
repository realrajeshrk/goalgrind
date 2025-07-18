// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.registerUser = async (req, res) => {
    console.log("🟢 registerUser endpoint hit");

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    console.log("registeruser - all fields required error");
    return res.status(400).json({ message: 'All fields required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
  const user = await User.create({ name:name, email:email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
} catch (err) {
  console.error('❌ Error in registerUser:', err.message);
  console.error(err);
  res.status(400).json({ message: 'validation errors' });
}
};

exports.loginUser = async (req, res) => {
      console.log("🟢 loginUser endpoint hit");

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  console.log('user found')
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("ismatch ran")
  if (!isMatch) {

  return res.status(400).json({ message: 'Invalid credentials' });

  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};
