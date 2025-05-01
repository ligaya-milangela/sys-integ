// src/routes/notes_route.js
const express = require('express');
const router = express.Router();
const Note = require('../models/notes_model');  // Ensure the path is correct to your notes model

// GET /api/notes/:id - Fetch a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);  // Find note by ID
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });  // Handle note not found
    }
    res.json(note);  // Return the note as a response
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// GET /api/notes - Fetch all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find();  // Retrieve all notes from the database
    res.json(notes);  // Return the list of notes
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content, isMinute } = req.body;  // Destructure the required fields from the request body

    // Ensure that 'isMinute' is properly handled (whether it’s a meeting note)
    const newNote = new Note({
      title,
      content,
      isMinute,  // Set the 'isMinute' field based on whether it's a meeting note or not
    });

    const savedNote = await newNote.save();  // Save the new note to the database
    res.status(201).json(savedNote);  // Return the created note as a response
  } catch (err) {
    console.error('Error creating note:', err);  // Log the error
    res.status(500).json({ error: err.message });  // Return error message
  }
});

// PUT /api/notes/:id - Edit an existing note
router.put('/:id', async (req, res) => {
  try {
    // Find note by ID and update it with the request body
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });  // Handle note not found for update
    }
    res.json(updatedNote);  // Return the updated note
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// PATCH /api/notes/:id/submit - Submit a note for approval
router.patch('/:id/submit', async (req, res) => {
  try {
    // Update the note’s status to 'Submitted for Approval'
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, { status: 'Submitted for Approval' }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });  // Handle note not found for submission
    }
    res.json(updatedNote);  // Return the updated note
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);  // Delete the note by ID
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });  // Handle note not found for deletion
    }
    res.json({ message: 'Note deleted successfully' });  // Return success message
  } catch (err) {
    res.status(500).json({ error: err.message });  // Handle errors
  }
});

module.exports = router;  // Export the router
