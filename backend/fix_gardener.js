require('dotenv').config();
const mongoose = require('mongoose');

async function fixUserRole() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greennest';
    await mongoose.connect(MONGO_URI);
    
    const db = mongoose.connection.db;
    const result = await db.collection('gardeners').updateOne(
      { clerkId: 'user_3BXF2H3fT8FDkYZKy6OqxDGVfIP' },
      { $set: { name: 'Adrich', email: 'rentease11@gmail.com' } }
    );
    
    console.log(`Updated gardener document. Modified count: ${result.modifiedCount}`);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixUserRole();
