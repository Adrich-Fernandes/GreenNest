require('dotenv').config();
const mongoose = require('mongoose');

async function fixUserRole() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greennest';
    await mongoose.connect(MONGO_URI);
    
    const db = mongoose.connection.db;
    const result = await db.collection('users').updateOne(
      { email: 'rentease11@gmail.com' },
      { $set: { role: 'gardener' } }
    );
    
    console.log(`Updated user document. Modified count: ${result.modifiedCount}`);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixUserRole();
