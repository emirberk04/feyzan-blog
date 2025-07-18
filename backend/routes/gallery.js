const express = require('express');
const Photo = require('../models/Photo');
const { protect, getUserFromToken } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all photos
// @route   GET /api/gallery
// @access  Public
router.get('/', getUserFromToken, async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    // Transform data to match frontend expectations
    const transformedPhotos = photos.map(photo => ({
      _id: photo._id,
      imageUrl: photo.imageUrl,
      caption: photo.caption,
      author: photo.author,
      likesCount: photo.likes,
      isLiked: req.user ? photo.likedBy.some(userId => userId.toString() === req.user._id.toString()) : false,
      tags: [],
      createdAt: photo.createdAt
    }));

    res.json({
      success: true,
      message: '🌸 Gallery photos loaded successfully!',
      data: {
        photos: transformedPhotos
      }
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to fetch gallery photos'
    });
  }
});

// @desc    Upload a photo
// @route   POST /api/gallery
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: '🌿 Please provide an image URL'
      });
    }

    const photo = await Photo.create({
      imageUrl,
      caption: caption || '',
      author: req.user._id
    });

    await photo.populate('author', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: '🌸 Photo uploaded successfully!',
      data: {
        photo: {
          _id: photo._id,
          imageUrl: photo.imageUrl,
          caption: photo.caption,
          author: photo.author,
          likesCount: photo.likes,
          isLiked: false,
          tags: [],
          createdAt: photo.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to upload photo'
    });
  }
});

// @desc    Like/unlike a photo
// @route   PUT /api/gallery/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: '🥀 Photo not found'
      });
    }

    const userLikedIndex = photo.likedBy.findIndex(
      userId => userId.toString() === req.user._id.toString()
    );

    if (userLikedIndex > -1) {
      // Unlike
      photo.likedBy.splice(userLikedIndex, 1);
      photo.likes = Math.max(0, photo.likes - 1);
    } else {
      // Like
      photo.likedBy.push(req.user._id);
      photo.likes += 1;
    }

    await photo.save();

    res.json({
      success: true,
      message: '🌸 Photo like updated!',
      data: {
        likes: photo.likes,
        isLiked: userLikedIndex === -1
      }
    });
  } catch (error) {
    console.error('Photo like error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to update photo like'
    });
  }
});

// @desc    Delete a photo
// @route   DELETE /api/gallery/:id
// @access  Private (Owner or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: '🥀 Photo not found'
      });
    }

    // Check if user owns the photo or is admin
    if (photo.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '🌿 You can only delete your own photos'
      });
    }

    await Photo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '🗑️ Photo deleted successfully'
    });
  } catch (error) {
    console.error('Photo delete error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to delete photo'
    });
  }
});

module.exports = router;
