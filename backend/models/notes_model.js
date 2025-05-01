const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isMinute: { type: Boolean, default: false },
  submitted: { type: Boolean, default: false },
  category: { type: String, default: '' }, // ← Add this line
}, { timestamps: true });


module.exports = mongoose.model('Note', noteSchema);
