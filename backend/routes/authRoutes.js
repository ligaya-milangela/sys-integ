require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Department = require('../models/Department'); // Correct path to your Department model


const JWT_SECRET = process.env.JWT_SECRET_KEY;

router.post('/signup', async (req, res) => {
  const { username, password, department } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Department.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new department user
    const newUser = new Department({
      username,
      password,
      department,
    });

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Department.findOne({ username});
    if (!user || !(await user.comparePassword(password))) {
      console.log('Logging in with:', username, password);
      console.log('Found user:', user);
      console.log('Password match:', await user.comparePassword(password));
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
