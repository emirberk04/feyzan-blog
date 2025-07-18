const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role (admin only)
router.patch('/:userId/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'author', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Toggle user status (admin only)
router.patch('/:userId/status', isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get user stats (admin only)
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const authorUsers = await User.countDocuments({ role: 'author' });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await User.find({
      createdAt: { $gte: sevenDaysAgo }
    }).count();

    res.json({
      total: totalUsers,
      active: activeUsers,
      authors: authorUsers,
      admins: adminUsers,
      recentRegistrations
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

module.exports = router; 