const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
