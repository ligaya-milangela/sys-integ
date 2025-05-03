require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user_model'); // Adjust path based on your file structure

const sampleUsers = [
  { name: 'User1', email: 'user1@example.com', },
  { name: 'User2', email: 'user2@example.com'},
  { name: 'User3', email: 'user3@example.com'},
  { name: 'User4', email: 'user4g@example.com'},
];

async function populateUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Delete all existing users (optional, if you want to start fresh)
    await User.deleteMany({});

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Sample users populated successfully!');
  } catch (error) {
    console.error('Error populating users:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

populateUsers();
