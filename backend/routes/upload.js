const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, authorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('🌿 Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MPEG, MOV, AVI) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 5 // Maximum 5 files per upload
  },
  fileFilter: fileFilter
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Author/Admin)
router.post('/image', protect, authorOrAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please select an image to upload'
      });
    }

    const { caption, altText, folder = 'blog-images' } = req.body;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: folder,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' }
      ],
      public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    const imageData = {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      caption: caption || '',
      altText: altText || '',
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };

    res.status(201).json({
      success: true,
      message: '🌸 Image uploaded successfully! Your photo is blooming beautifully!',
      data: {
        image: imageData
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    if (error.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: '🌿 Image file is too large. Please choose a smaller file (max 50MB).'
      });
    }

    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong uploading your image',
      error: error.message
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private (Author/Admin)
router.post('/images', protect, authorOrAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please select at least one image to upload'
      });
    }

    const { folder = 'blog-images' } = req.body;
    const uploadPromises = [];

    req.files.forEach((file, index) => {
      const uploadPromise = uploadToCloudinary(file.buffer, {
        resource_type: 'image',
        folder: folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' }
        ],
        public_id: `${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`
      });
      uploadPromises.push(uploadPromise);
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map((result, index) => ({
      url: result.secure_url,
      cloudinaryId: result.public_id,
      caption: '',
      altText: '',
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      originalName: req.files[index].originalname
    }));

    res.status(201).json({
      success: true,
      message: `🌺 ${images.length} images uploaded successfully! Your garden gallery is growing!`,
      data: {
        images
      }
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong uploading your images',
      error: error.message
    });
  }
});

// @desc    Upload video
// @route   POST /api/upload/video
// @access  Private (Author/Admin)
router.post('/video', protect, authorOrAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please select a video to upload'
      });
    }

    const { caption, folder = 'blog-videos' } = req.body;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'video',
      folder: folder,
      transformation: [
        { quality: 'auto' },
        { width: 1280, crop: 'limit' }
      ],
      public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    const videoData = {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      caption: caption || '',
      duration: result.duration,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };

    res.status(201).json({
      success: true,
      message: '🎬 Video uploaded successfully! Your nature documentary is ready!',
      data: {
        video: videoData
      }
    });

  } catch (error) {
    console.error('Video upload error:', error);
    
    if (error.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: '🌿 Video file is too large. Please choose a smaller file (max 50MB).'
      });
    }

    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong uploading your video',
      error: error.message
    });
  }
});

// @desc    Upload profile picture
// @route   POST /api/upload/profile-picture
// @access  Private
router.post('/profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please select a profile picture to upload'
      });
    }

    // Check if file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: '🌿 Profile picture must be an image file'
      });
    }

    // Upload to Cloudinary with profile-specific transformations
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: 'profile-pictures',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
        { radius: 'max' } // Make it circular
      ],
      public_id: `profile-${req.user._id}-${Date.now()}`
    });

    // Update user's profile picture
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      profilePicture: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: '🌺 Profile picture updated! You look blooming beautiful!',
      data: {
        profilePicture: {
          url: result.secure_url,
          cloudinaryId: result.public_id
        }
      }
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong uploading your profile picture',
      error: error.message
    });
  }
});

// @desc    Upload single image for gallery
// @route   POST /api/upload/gallery-image
// @access  Private (Any authenticated user)
router.post('/gallery-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please select an image to upload'
      });
    }

    const { caption, altText } = req.body;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: 'gallery',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' }
      ],
      public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`
    });

    const imageData = {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      caption: caption || '',
      altText: altText || '',
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    };

    res.status(201).json({
      success: true,
      message: '🌸 Image uploaded successfully! Your photo is blooming beautifully!',
      data: {
        image: imageData
      }
    });

  } catch (error) {
    console.error('Gallery image upload error:', error);
    
    if (error.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: '🌿 Image file is too large. Please choose a smaller file (max 50MB).'
      });
    }

    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong uploading your image',
      error: error.message
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image/:cloudinaryId
// @access  Private (Author/Admin)
router.delete('/image/:cloudinaryId', protect, authorOrAdmin, async (req, res) => {
  try {
    const { cloudinaryId } = req.params;

    if (!cloudinaryId) {
      return res.status(400).json({
        success: false,
        message: '🌿 Cloudinary ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: '🍂 Image has been gently removed from the garden'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '🥀 Image not found or already removed'
      });
    }

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong deleting the image',
      error: error.message
    });
  }
});

// @desc    Delete video from Cloudinary
// @route   DELETE /api/upload/video/:cloudinaryId
// @access  Private (Author/Admin)
router.delete('/video/:cloudinaryId', protect, authorOrAdmin, async (req, res) => {
  try {
    const { cloudinaryId } = req.params;

    if (!cloudinaryId) {
      return res.status(400).json({
        success: false,
        message: '🌿 Cloudinary ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryId, { resource_type: 'video' });

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: '🍂 Video has been gently removed from the garden'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '🥀 Video not found or already removed'
      });
    }

  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong deleting the video',
      error: error.message
    });
  }
});

// @desc    Get upload statistics (Admin only)
// @route   GET /api/upload/stats
// @access  Private (Admin)
router.get('/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '🌿 Access denied. Admin privileges required.'
      });
    }

    // Get Cloudinary usage stats
    const usage = await cloudinary.api.usage();

    res.json({
      success: true,
      message: '📊 Here are your garden media statistics!',
      data: {
        usage: {
          storage: {
            used: usage.storage?.used || 0,
            limit: usage.storage?.limit || 0,
            used_percent: usage.storage?.used_percent || 0
          },
          bandwidth: {
            used: usage.bandwidth?.used || 0,
            limit: usage.bandwidth?.limit || 0,
            used_percent: usage.bandwidth?.used_percent || 0
          },
          requests: usage.requests || 0,
          transformations: usage.transformations || 0
        }
      }
    });

  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong fetching upload statistics',
      error: error.message
    });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '🌿 File too large. Please choose a smaller file (max 50MB).'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '🌿 Too many files. Maximum 5 files per upload.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: '🌿 Unexpected field. Please check your form field names.'
      });
    }
  }

  if (error.message.includes('Only images')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: '🌪️ Upload error occurred',
    error: error.message
  });
});

module.exports = router; 