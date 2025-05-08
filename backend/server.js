const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('cookie-session');
const googleRoutes = require('./routes/googleRoutes');
const notesRoutes = require('./routes/notes_route');
const attendanceRoute = require('./routes/attendance_route');
const authRoutes = require('./routes/authRoutes');

const app = express();
console.log(process.env.REACT_APP_API_URL);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://sys-integ-backend.onrender.com', 'https://attendance-and-notes-system.netlify.app'],
  credentials: true,
}));

app.use(express.json());

// Session handling
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'default_key'],
  maxAge: 24 * 60 * 60 * 1000,
}));

// Debugging each route to see if any cause the issue
try {
  console.log('Mounting googleRoutes...');
  app.use('/auth', googleRoutes);
} catch (err) {
  console.error('Error with googleRoutes:', err);
}

try {
  console.log('Mounting notesRoutes...');
  app.use('/api/notes', notesRoutes);
} catch (err) {
  console.error('Error with notesRoutes:', err);
}

try {
  console.log('Mounting attendanceRoute...');
  app.use('/api/attendance', attendanceRoute);
} catch (err) {
  console.error('Error with attendanceRoute:', err);
}

try {
  console.log('Mounting authRoutes...');
  app.use('/api/auth', authRoutes);
} catch (err) {
  console.error('Error with authRoutes:', err);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(process.env.PORT || 5003, () => {
  console.log(`Server running on port ${process.env.PORT || 5003}`);
});

app.get('/', (req, res) => {
  res.send('Backend is working! Yiieee Jollibee na!');
});
