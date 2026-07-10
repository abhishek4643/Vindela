require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Table = require('../models/Table');

const tables = [
  { tableNumber: 1, capacity: 2, location: 'indoor', description: 'Cozy table for two near the window.' },
  { tableNumber: 2, capacity: 2, location: 'indoor', description: 'Intimate setting.' },
  { tableNumber: 3, capacity: 4, location: 'indoor', description: 'Standard dining table.' },
  { tableNumber: 4, capacity: 4, location: 'indoor', description: 'Standard dining table.' },
  { tableNumber: 5, capacity: 6, location: 'indoor', description: 'Large table for groups.' },
  { tableNumber: 6, capacity: 2, location: 'outdoor', description: 'Patio seating with a view.' },
  { tableNumber: 7, capacity: 4, location: 'outdoor', description: 'Patio seating under the umbrella.' },
  { tableNumber: 8, capacity: 2, location: 'bar', description: 'High-top bar seating.' },
  { tableNumber: 9, capacity: 8, location: 'private', description: 'Exclusive private dining room.' },
  { tableNumber: 10, capacity: 10, location: 'private', description: 'Large private event space.' }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vindela';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding');

    // Clear existing tables
    await Table.deleteMany();
    console.log('Tables cleared');

    // Insert new tables
    await Table.insertMany(tables);
    console.log('Tables seeded successfully');

    // Add default admin user if none exists
    const adminExists = await User.findOne({ email: 'admin@luxereserve.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@luxereserve.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created (admin@luxereserve.com / password123)');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();