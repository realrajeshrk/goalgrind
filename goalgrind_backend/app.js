const express = require('express');
//const path = require('path');
//const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const app = express();
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
dotenv.config();

connectDB();

app.use(cors());

// Routes
console.log("🟢 Loading auth route...");
//middleware before routes/auth
app.use('/api/auth', require('./routes/auth'));
app.get('/', (req, res) => {
  res.send('API Running');
});
app.use('/api/user', require('./routes/users'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/reminders', require("./routes/reminder"));
app.use('/api/todos', require('./routes/todo'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
module.exports = app;

