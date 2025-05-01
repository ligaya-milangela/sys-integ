// src/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const session = require('cookie-session');
const googleRoutes = require('./routes/googleRoutes');  // Keep Google Meet routes
const notesRoutes = require('./routes/notes_route');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));

app.use(express.json());  // Middleware to parse incoming JSON data

// Session handling
app.use(session({
  name: 'session',  // Name for the session cookie
  keys: [process.env.SESSION_SECRET || 'default_key'],  // Session keys
  maxAge: 24 * 60 * 60 * 1000,  // Session expiration time (1 day)
}));

// Routes
app.use('/auth', googleRoutes);  // Google Meet authentication routes

app.use('/api/notes', notesRoutes);

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
