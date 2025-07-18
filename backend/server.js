const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');
const usersRoutes = require('./routes/users');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded images/videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cicekli-blog')
.then(() => {
  console.log('🌸 Connected to MongoDB - Feyzan Blog Database');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.log('⚠️  Server will continue running without database connection');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', statsRoutes);

// Welcome route with floral theme
app.get('/', (req, res) => {
  res.json({
    message: '🌸 Welcome to Feyzan Blog API 🦋',
    status: 'Server is blooming perfectly!',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users',
      upload: '/api/upload'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: '🌺 Server is buzzing like a busy bee!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: '🥀 Oops! This flower has not bloomed yet.',
    error: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🐛 Server Error:', error);
  res.status(error.status || 500).json({
    message: error.message || '🌪️ Something went wrong in the garden!',
    error: process.env.NODE_ENV === 'development' ? error.stack : {}
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🌅 Gracefully shutting down...');
  mongoose.connection.close(() => {
    console.log('🌙 Database connection closed.');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🌻 Feyzan Blog Server is blooming on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🦋 API Documentation: http://localhost:${PORT}/`);
}); 