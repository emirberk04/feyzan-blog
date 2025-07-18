const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  caption: {
    type: String,
    trim: true,
    maxLength: [500, 'Caption cannot be more than 500 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes
photoSchema.index({ author: 1 });
photoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Photo', photoSchema); 