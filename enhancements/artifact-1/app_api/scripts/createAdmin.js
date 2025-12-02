require('dotenv').config();
require('../models/db');
const User = require('../models/user');
const { ROLES } = require('../constants');

const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@travlr.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: adminEmail,
      role: ROLES.ADMIN
    });
    
    admin.setPassword('admin123'); // Change this password in production!
    
    await admin.save();
    
    console.log('Admin user created successfully');
    console.log('Email: admin@travlr.com');
    console.log('Password: admin123');
    console.log('IMPORTANT: Change this password in production!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

createAdminUser();
