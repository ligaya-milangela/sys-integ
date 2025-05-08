const express = require('express');
const router = express.Router();
const Note = require('../models/notes_model');

// Create a new note with attendee names (no DB lookup)
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/notes called');
    const { title, content, isMinute, attendees } = req.body;

    console.log('Incoming Note Data:', req.body);

    if (!Array.isArray(attendees)) {
      return res.status(400).json({ error: 'Attendees must be an array of names' });
    }

    const newNote = new Note({
      title,
      content,
      isMinute,
      attendees,
    });

    const savedNote = await newNote.save();
    console.log('Note saved with attendees:', savedNote.attendees);

    res.status(201).json(savedNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: err.message });
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

module.exports = router;
