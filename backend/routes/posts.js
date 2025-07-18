const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { protect, authorOrAdmin, optionalAuth, getUserFromToken, isAdmin, isOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const featured = req.query.featured === 'true';
    const category = req.query.category;
    const search = req.query.search;

    const query = {};

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    // Add featured filter if requested
    if (featured) {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username profilePicture'),
      Post.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total
        }
      }
    });
  } catch (error) {
    console.error('Posts fetch error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to fetch posts'
    });
  }
});

// @desc    Get posts by category
// @route   GET /api/posts/category/:category
// @access  Public
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ category, status: 'published' })
      .populate('author', 'username profilePicture')
      .select('-content')
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ category, status: 'published' });

    res.json({
      success: true,
      message: `🌺 Found ${posts.length} beautiful ${category} posts!`,
      data: {
        posts,
        category,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total
        }
      }
    });

  } catch (error) {
    console.error('Get posts by category error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong fetching category posts',
      error: error.message
    });
  }
});

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
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

    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      $text: { $search: q },
      status: 'published'
    })
    .populate('author', 'username profilePicture')
    .select('-content')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit);

    const total = await Post.countDocuments({
      $text: { $search: q },
      status: 'published'
    });

    res.json({
      success: true,
      message: `🔍 Found ${posts.length} blooms matching "${q}"`,
      data: {
        posts,
        searchQuery: q,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalResults: total
        }
      }
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong searching the garden',
      error: error.message
    });
  }
});

// @desc    Get single post by ID (for editing)
// @route   GET /api/posts/edit/:id
// @access  Private (Author/Admin)
router.get('/edit/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate('author', 'username profilePicture bio socialLinks');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '🥀 Post not found in our garden.'
      });
    }

    // Check if user owns the post or is admin
    if (post.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '🌿 You can only edit your own flowers.'
      });
    }

    res.json({
      success: true,
      message: '📝 Post ready for editing!',
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Get post for edit error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong fetching this post for editing',
      error: error.message
    });
  }
});

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
router.get('/:slug', getUserFromToken, async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug, status: 'published' })
      .populate('author', 'username profilePicture bio socialLinks');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '🥀 This flower hasn\'t bloomed yet or doesn\'t exist.'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      message: '🌸 Here\'s your beautiful bloom!',
      data: {
        post,
        comments: [],
        isLiked: req.user ? post.likes.some(like => like.toString() === req.user._id.toString()) : false
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong fetching this post',
      error: error.message
    });
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author/Admin)
router.post('/', [
  protect,
  authorOrAdmin,
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('category')
    .isIn(['personal', 'travel', 'photography', 'lifestyle', 'technology', 'food', 'art', 'music', 'books', 'sports', 'health', 'entertainment'])
    .withMessage('Invalid category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('flowerTypes')
    .optional()
    .isArray()
    .withMessage('Flower types must be an array'),
  body('insectTypes')
    .optional()
    .isArray()
    .withMessage('Insect types must be an array')
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

    const postData = {
      ...req.body,
      author: req.user._id
    };

    const post = await Post.create(postData);

    // Populate author info
    await post.populate('author', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: '🌱 Your beautiful post has started to bloom!',
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong planting your post',
      error: error.message
    });
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author/Admin)
router.put('/:id', [
  protect,
  authorOrAdmin,
  body('title')
    .optional()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),
  body('category')
    .optional()
    .isIn(['personal', 'travel', 'photography', 'lifestyle', 'technology', 'food', 'art', 'music', 'books', 'sports', 'health', 'entertainment'])
    .withMessage('Invalid category')
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

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '🥀 Post not found in our garden.'
      });
    }

    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '🌿 You can only tend to your own flowers.'
      });
    }

    // Update post
    Object.assign(post, req.body);
    await post.save();

    // Populate author info
    await post.populate('author', 'username profilePicture');

    res.json({
      success: true,
      message: '🌺 Your post has been beautifully updated!',
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong updating your post',
      error: error.message
    });
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
router.delete('/:id', [protect, isOwnerOrAdmin], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '🌿 Post not found'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: '🗑️ Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Failed to delete post'
    });
  }
});

// @desc    Toggle like on post
// @route   PUT /api/posts/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '🥀 Post not found in our garden.'
      });
    }

    await post.toggleLike(req.user._id);

    const isLiked = post.likes.some(like => like.user.toString() === req.user._id.toString());

    res.json({
      success: true,
      message: isLiked ? '💖 You loved this flower!' : '🤍 Like removed',
      data: {
        likesCount: post.likesCount,
        isLiked
      }
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: '🌪️ Something went wrong with your reaction',
      error: error.message
    });
  }
});

module.exports = router; 