const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance_model');
const { getAttendanceById } = require('./attendanceService');
router.post('/create', async (req, res) => {
  console.log("Incoming data:", req.body);  // Log incoming data

  const { meeting_date, attendees, created_by } = req.body;

  // Validate required fields
  if (!meeting_date || !attendees || !created_by) {
    return res.status(400).json({ error: "Meeting date, attendees, and created_by are required." });
  }

  try {
    const date = new Date(meeting_date);
    if (isNaN(date)) {
      return res.status(400).json({ error: "Invalid meeting date." });
    }

  
    const attendance = new Attendance({
      meeting_date: date, 
      attendees,
      created_by,
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance saved successfully.' });
  } catch (err) {
    console.error('Error saving attendance:', err); 
    res.status(500).json({ error: 'Failed to save attendance: ' + err.message });
  }
});

// Get all attendance dates
router.get('/list', async (req, res) => {
  try {
    const records = await Attendance.find({}, 'meeting_date');
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance list:', err);
    res.status(500).json({ error: 'Failed to fetch attendance list' });
  }
});

// Get attendees for a specific date using /:id
router.get('/:id', async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }
    res.json(record);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    console.log("hey");
    const attendanceId = req.params.id;
    console.log('Attendance ID:', attendanceId);

    // Fetch the attendance record using the provided ID
    const attendanceDetails = await Attendance.findById(attendanceId);

    if (!attendanceDetails) {
      return res.status(404).json({ message: 'Attendance details not found' });
    }

    res.json(attendanceDetails);
  } catch (error) {
    console.error('Error fetching attendance details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
