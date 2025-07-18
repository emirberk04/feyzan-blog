const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Subject must be between 2 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
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

    const { name, email, subject, message } = req.body;

    // Here you would typically send the email
    // For now, we'll just log it and return success
    console.log('Contact Form Submission:', {
      name,
      email,
      subject,
      message
    });

    res.status(200).json({
      success: true,
      message: '🌸 Message received successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong while sending your message'
    });
  }
});

module.exports = router; 