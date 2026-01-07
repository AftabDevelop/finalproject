const mongoose = require('mongoose');

async function dropIndex() {
  try {
    await mongoose.connect('mongodb+srv://CoderAftab:aftab1459@cluster0.e5c08pv.mongodb.net/Leetcode');

    const db = mongoose.connection;
    await db.collection('users').dropIndex('problemSolved_1');
    console.log('Index dropped!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error dropping index:', err.message);
  }
}

dropIndex();
