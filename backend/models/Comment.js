const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post ID is required']
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [50, 'Author name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Author email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [3, 'Comment must be at least 3 characters long'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'spam'],
    default: 'pending'
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Moderation fields
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  moderationReason: {
    type: String,
    trim: true
  },
  // Spam detection fields
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  spamScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Floral themed fields
  favoriteFlower: {
    type: String,
    enum: ['rose', 'daisy', 'lavender', 'sunflower', 'tulip', 'lily', 'orchid', 'jasmine', 'other'],
    default: 'other'
  },
  mood: {
    type: String,
    enum: ['happy', 'inspired', 'peaceful', 'excited', 'grateful', 'curious', 'other'],
    default: 'other'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
commentSchema.index({ postId: 1 });
commentSchema.index({ status: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ 'author.email': 1 });

// Virtual for likes count
commentSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for replies count
commentSchema.virtual('repliesCount').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Pre-save middleware for spam detection and moderation
commentSchema.pre('save', function(next) {
  // Set edited timestamp if content is modified
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  
  // Basic spam detection
  if (this.isNew) {
    let spamScore = 0;
    
    // Check for excessive links
    const linkCount = (this.content.match(/https?:\/\//g) || []).length;
    if (linkCount > 2) spamScore += 30;
    if (linkCount > 5) spamScore += 50;
    
    // Check for excessive caps
    const capsRatio = (this.content.match(/[A-Z]/g) || []).length / this.content.length;
    if (capsRatio > 0.3) spamScore += 20;
    
    // Check for repeated characters
    if (/(.)\1{4,}/.test(this.content)) spamScore += 15;
    
    // Check for common spam words
    const spamWords = ['viagra', 'casino', 'lottery', 'prize', 'winner', 'free money'];
    const lowerContent = this.content.toLowerCase();
    spamWords.forEach(word => {
      if (lowerContent.includes(word)) spamScore += 25;
    });
    
    this.spamScore = Math.min(spamScore, 100);
    
    // Auto-reject if spam score is too high
    if (this.spamScore >= 70) {
      this.status = 'spam';
    }
  }
  
  next();
});

// Static method to find approved comments for a post
commentSchema.statics.findApprovedByPost = function(postId) {
  return this.find({ postId, status: 'approved', parentComment: null })
    .populate({
      path: 'replies',
      match: { status: 'approved' },
      options: { sort: { createdAt: 1 } }
    })
    .sort({ createdAt: -1 });
};

// Static method to find comments pending moderation
commentSchema.statics.findPendingModeration = function() {
  return this.find({ status: 'pending' })
    .populate('postId', 'title slug')
    .sort({ createdAt: -1 });
};

// Instance method to approve comment
commentSchema.methods.approve = function(moderatorId, reason) {
  this.status = 'approved';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  if (reason) this.moderationReason = reason;
  return this.save();
};

// Instance method to reject comment
commentSchema.methods.reject = function(moderatorId, reason) {
  this.status = 'rejected';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationReason = reason || 'Content violates community guidelines';
  return this.save();
};

// Instance method to mark as spam
commentSchema.methods.markAsSpam = function(moderatorId, reason) {
  this.status = 'spam';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationReason = reason || 'Detected as spam';
  return this.save();
};

// Instance method to add reply
commentSchema.methods.addReply = function(replyId) {
  if (!this.replies.includes(replyId)) {
    this.replies.push(replyId);
  }
  return this.save();
};

// Instance method to toggle like
commentSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.user.toString() === userId.toString()
  );
  
  if (existingLike) {
    this.likes = this.likes.filter(like => 
      like.user.toString() !== userId.toString()
    );
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema); 