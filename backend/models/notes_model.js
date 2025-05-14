const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isMinute: { type: Boolean, default: false },
  submitted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, 
  category: { type: String, default: '' },
  attendees: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

//add department field
