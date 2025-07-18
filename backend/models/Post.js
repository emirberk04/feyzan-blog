const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    minlength: [50, 'Content must be at least 50 characters long']
  },
  excerpt: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['personal', 'travel', 'photography', 'lifestyle', 'technology', 'food', 'art', 'music', 'books', 'sports', 'health', 'entertainment']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    url: String,
    altText: String,
    caption: String
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }

  this.slug = slugify(this.title, {
    lower: true,
    strict: true
  }) + '-' + Date.now();

  next();
});

// Update counts
postSchema.methods.updateCounts = async function() {
  this.likesCount = this.likes.length;
  this.commentsCount = this.comments.length;
  await this.save();
};

module.exports = mongoose.model('Post', postSchema); 