const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Get all users
    const users = await User.find({});
    
    console.log('📊 Users in database:', users.length);
    console.log('─────────────────────────────────────\n');

    for (const user of users) {
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password Hash (first 30 chars): ${user.password.substring(0, 30)}...`);
      console.log(`Password Hash Length: ${user.password.length}`);
      
      // Test password comparison
      const testPassword = '123456';
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log(`✓ Password '123456' matches: ${isMatch ? '✅ YES' : '❌ NO'}`);
      
      // Also test using the model method
      const modelMatch = await user.matchPassword(testPassword);
      console.log(`✓ Model matchPassword() result: ${modelMatch ? '✅ YES' : '❌ NO'}`);
      console.log('─────────────────────────────────────\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDatabase();