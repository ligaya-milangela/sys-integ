const express = require('express');
const router = express.Router();
const Note = require('../models/notes_model');

// Create a new note with attendee names (no DB lookup)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/notes called');
    const { title, content, isMinute, attendees, department } = req.body;

    console.log('Incoming Note Data:', req.body);

    // Check if attendees is provided and is an array, or if it's null or undefined
    if (attendees !== undefined && attendees !== null && !Array.isArray(attendees)) {
      return res.status(400).json({ error: 'Attendees must be an array or null' });
    }

    const newNote = new Note({
      title,
      content,
      isMinute,
      attendees: attendees || null,
      department: department || 'Meeting Minute and Attendance System', 
    });

    const savedNote = await newNote.save();
    console.log('Note saved with attendees:', savedNote.attendees);

    res.status(201).json(savedNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('Update request body:', req.body); 
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (err) {
    console.error('Error updating note:', err); 
    res.status(500).json({ message: 'Server error' });
  }
});


// Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`GET /api/notes/${req.params.id}`);

    const note = await Note.findById(req.params.id);

    if (!note) {
      console.warn('Note not found');
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log('Returning note with attendees:', note);
    res.status(200).json(note);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Delete an attendance record by ID
router.delete('/:id', async (req, res) => {
  try {
    const noteId = req.params.id;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }

    res.status(200).json({ message: 'Attendance deleted successfully.' });
  } catch (err) {
    console.error('Error deleting attendance:', err);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
});


router.get('/', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

module.exports = router;
