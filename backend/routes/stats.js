const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Photo = require('../models/Photo');
const User = require('../models/User');
const { isAdmin } = require('../middleware/auth');

// Get all stats
router.get('/posts/stats', isAdmin, async (req, res) => {
  try {
    const total = await Post.countDocuments();
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json({ total, recentActivity });
  } catch (error) {
    console.error('Error fetching post stats:', error);
    res.status(500).json({ message: 'Error fetching post statistics' });
  }
});

router.get('/gallery/stats', isAdmin, async (req, res) => {
  try {
    const total = await Photo.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error('Error fetching gallery stats:', error);
    res.status(500).json({ message: 'Error fetching gallery statistics' });
  }
});

router.get('/users/stats', isAdmin, async (req, res) => {
  try {
    const total = await User.countDocuments();
    
    // Get user roles distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ total, roleDistribution });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

module.exports = router; 