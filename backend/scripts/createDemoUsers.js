const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

require('dotenv').config();

const createDemoUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cicekli-blog');
    console.log('🌿 Connected to MongoDB');

    // Check if demo users already exist
    const existingAdmin = await User.findOne({ email: 'admin@garden.com' });
    if (existingAdmin) {
      console.log('Demo users already exist!');
      process.exit(0);
    }

    // Demo users data
    const demoUsers = [
      {
        username: 'admin',
        email: 'admin@garden.com',
        password: 'Admin123',
        role: 'admin',
        bio: 'Blog administrator who loves sharing stories and connecting with the community',
        favoriteFlowers: ['rose', 'tulip', 'orchid'],
        favoriteInsects: ['butterfly', 'bee', 'ladybug'],
        socialLinks: {
          instagram: 'https://instagram.com/feyzanblog',
          twitter: 'https://twitter.com/feyzanblog'
        },
        preferences: {
          newsletter: true,
          emailNotifications: true,
          theme: 'light'
        },
        isActive: true
      },
      {
        username: 'author',
        email: 'author@garden.com',
        password: 'Author123',
        role: 'author',
        bio: 'Content creator passionate about photography, writing, and sharing life experiences',
        favoriteFlowers: ['sunflower', 'lavender', 'jasmine'],
        favoriteInsects: ['dragonfly', 'firefly', 'ant'],
        socialLinks: {
          instagram: 'https://instagram.com/feyzanauthor',
          website: 'https://feyzanauthor.blog'
        },
        preferences: {
          newsletter: true,
          emailNotifications: true,
          theme: 'auto'
        },
        isActive: true
      },
      {
        username: 'bloguser',
        email: 'user@garden.com',
        password: 'User123',
        role: 'subscriber',
        bio: 'Blog enthusiast who enjoys reading and sharing interesting content',
        favoriteFlowers: ['daisy', 'lily', 'tulip'],
        favoriteInsects: ['grasshopper', 'ant', 'bee'],
        preferences: {
          newsletter: false,
          emailNotifications: false,
          theme: 'dark'
        },
        isActive: true
      }
    ];

    // Create demo users
    for (const userData of demoUsers) {
      // Create user (password will be hashed by pre-save hook)
      const user = new User(userData);
      
      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🌸 Demo users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👑 Admin: admin@garden.com / Admin123');
    console.log('✍️  Author: author@garden.com / Author123');
    console.log('👤 User: user@garden.com / User123');
    console.log('\n🚀 You can now test the authentication system!');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createDemoUsers(); 