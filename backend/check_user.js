require('dotenv').config();
const mongoose = require('mongoose');

async function checkUser() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greennest';
    await mongoose.connect(MONGO_URI);
    
    // Check what the DB actually says
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({ email: 'rentease11@gmail.com' }).toArray();
    
    if (users.length > 0) {
      console.log(`Role in DB is exact string: "${users[0].role}"`);
    } else {
      console.log("No user found.");
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

checkUser();
