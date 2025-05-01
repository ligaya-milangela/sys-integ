// backend/routes/attendance.js
const express = require('express');
const router = express.Router();

// Replace with real DB data later
let sampleAttendance = [
  { name: 'Jose', status: 'Present' },
  { name: 'Maria', status: 'Present' },
];

// GET all attendance
router.get('/', async (req, res) => {
    const records = await Attendance.find().populate('user');
    res.json(records);
  });
  
  router.post('/', async (req, res) => {
    const { user, date, status } = req.body;
    const newRecord = new Attendance({ user, date, status });
    await newRecord.save();
    res.status(201).json(newRecord);
  });
  
  module.exports = router;

  //google meet api