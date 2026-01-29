const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create users - DON'T manually hash passwords
    // Use User.create() instead of insertMany() to trigger pre('save') hooks
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
        phone: '1234567890',
      },
      {
        name: 'Trainer User',
        email: 'trainer@test.com',
        password: '123456',
        role: 'trainer',
        phone: '9876543210',
      },
      {
        name: 'Student User',
        email: 'student@test.com',
        password: '123456',
        role: 'learner',
        phone: '5555555555',
      },
      {
        name: 'John Doe',
        email: 'john@test.com',
        password: '123456',
        role: 'learner',
        phone: '1112223333',
      },
      {
        name: 'Jane Smith',
        email: 'jane@test.com',
        password: '123456',
        role: 'learner',
        phone: '4445556666',
      },
    ];

    // Create users ONE BY ONE using User.create() to trigger the pre('save') hook
    for (const userData of usersData) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email} (password hashed)`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@test.com / 123456');
    console.log('Trainer: trainer@test.com / 123456');
    console.log('Student: student@test.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedUsers();