const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, generateToken, authRateLimit } = require('../middleware/auth');

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  authRateLimit,
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('favoriteFlowers')
    .optional()
    .isArray()
    .withMessage('Favorite flowers must be an array'),
  body('favoriteInsects')
    .optional()
    .isArray()
    .withMessage('Favorite insects must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '🌿 Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, bio, favoriteFlowers, favoriteInsects } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? '🌺 This email is already blooming in our garden!' 
          : '🌻 This username has already been planted!'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      bio: bio || '',
      favoriteFlowers: favoriteFlowers || [],
      favoriteInsects: favoriteInsects || []
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '🌸 Welcome to our blooming community!',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong while planting your account',
      error: error.message
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  authRateLimit,
  body('identifier')
    .notEmpty()
    .withMessage('Please provide email or username'),
  body('password')
    .notEmpty()
    .withMessage('Please provide password')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '🌿 Validation failed',
        errors: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findByEmailOrUsername(identifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '🥀 No flower found with these credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '🥀 This account has wilted. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '🥀 Invalid credentials. Check your password.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `🌺 Welcome back, ${user.username}! Your garden is blooming!`,
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong during login',
      error: error.message
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('postsCount')
      .select('-password');

    res.json({
      success: true,
      message: '🌸 Here is your beautiful profile!',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong fetching your profile',
      error: error.message
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', [
  protect,
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('favoriteFlowers')
    .optional()
    .isArray()
    .withMessage('Favorite flowers must be an array'),
  body('favoriteInsects')
    .optional()
    .isArray()
    .withMessage('Favorite insects must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '🌿 Validation failed',
        errors: errors.array()
      });
    }

    const {
      username,
      bio,
      favoriteFlowers,
      favoriteInsects,
      socialLinks,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '🌻 This username has already been planted!'
        });
      }
    }

    // Update fields
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (favoriteFlowers) user.favoriteFlowers = favoriteFlowers;
    if (favoriteInsects) user.favoriteInsects = favoriteInsects;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: '🌺 Your profile has bloomed beautifully!',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong updating your profile',
      error: error.message
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
  protect,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '🌿 Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '🥀 Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '🌸 Your password has been refreshed like morning dew!'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong changing your password',
      error: error.message
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  res.json({
    success: true,
    message: '🌙 Sweet dreams! See you when the flowers bloom again!'
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', [
  protect,
  body('password')
    .notEmpty()
    .withMessage('Password confirmation is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '🌿 Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;

    const user = await User.findById(req.user._id);

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '🥀 Password confirmation failed'
      });
    }

    // Soft delete - deactivate account instead of permanent deletion
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: '🍂 Your account has been deactivated. We\'ll miss you in our garden!'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong deactivating your account',
      error: error.message
    });
  }
});

module.exports = router; 