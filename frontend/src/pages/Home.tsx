import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: {
    url: string;
    altText: string;
  };
  category: string;
  author: {
    username: string;
    profilePicture: string;
  };
  createdAt: string;
  likesCount: number;
}

const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await axios.get('/posts?page=1&limit=10&featured=true');
        if (response.data.success) {
          const allPosts = response.data.data.posts;
          const shuffled = allPosts.sort(() => 0.5 - Math.random());
          setFeaturedPosts(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const getCategoryEmoji = (category: string) => {
    const categories = {
      personal: '👤',
      travel: '✈️',
      photography: '📸',
      lifestyle: '🌟',
      technology: '💻',
      food: '🍽️',
      art: '🎨',
      music: '🎵',
      books: '📚',
      sports: '⚽',
      health: '💪',
      entertainment: '🎬'
    };
    return categories[category as keyof typeof categories] || '📝';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-floral-pink/10 to-butterfly-blue/5" />
        <div className="absolute inset-0 pattern-dots" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(124, 213, 255, 0.2)' }}
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(255, 137, 176, 0.2)' }}
          />
          <motion.div
            animate={{
              y: [0, -5, 0],
              x: [0, 5, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(182, 164, 255, 0.15)' }}
          />
          <motion.div
            animate={{
              y: [0, 8, 0],
              x: [0, -8, 0],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 left-1/4 w-28 h-28 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(132, 255, 210, 0.18)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="glass-panel p-8 mb-8 inline-block">
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-6">
                🌸 Welcome to Feyzan Blog
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Happy Birthday to my amazing love! Every day with you is a gift. I love you
              </p>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/admin/posts/create"
                    className="glass-button"
                  >
                    <span>✍️</span>
                    <span>Create New Post</span>
                  </Link>
                  <Link
                    to="/blog"
                    className="glass-button"
                  >
                    <span>📚 Explore Posts</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="glass-button"
                  >
                    <span>🌟</span>
                    <span>Start Your Journey</span>
                  </Link>
                  <Link
                    to="/about"
                    className="glass-button"
                  >
                    <span>🦋 Learn More</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lavender/10 to-transparent" />
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl font-heading font-bold text-gradient mb-8 text-center">
            ✨ Featured Stories
          </h2>
          
          <div className="relative">
            {/* Scroll Shadow Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-petal-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-petal-white to-transparent z-10" />
            
            {/* Scrollable Container */}
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-6">
                {loading ? (
                  // Loading skeletons
                  Array(3).fill(null).map((_, index) => (
                    <div key={index} className="animate-pulse flex-none w-[300px]">
                      <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-xl" />
                      <div className="glass-panel p-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  ))
                ) : featuredPosts.length > 0 ? (
                  featuredPosts.map(post => (
                    <motion.div
                      key={post._id}
                      whileHover={{ scale: 1.03 }}
                      className="glass-panel overflow-hidden flex-none w-[300px]"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="relative h-48">
                          <img
                            src={post.featuredImage?.url || '/images/default-post.jpg'}
                            alt={post.featuredImage?.altText || post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full text-sm font-medium text-violet">
                            {getCategoryEmoji(post.category)} {post.category}
                          </div>
                        </div>
                        <div className="p-6 bg-white/85 backdrop-blur-sm">
                          <h3 className="text-xl font-heading font-bold mb-2 text-violet hover:text-floral-pink transition-colors line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {post.author.profilePicture ? (
                                <img
                                  src={post.author.profilePicture}
                                  alt={post.author.username}
                                  className="w-8 h-8 rounded-full border-2 border-floral-pink/50"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white">
                                  {post.author.username[0].toUpperCase()}
                                </div>
                              )}
                              <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                                {post.author.username}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <span>❤️ {post.likesCount}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="w-full text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      No posts yet. Be the first to share your story! ✨
                    </p>
                    {user && (
                      <Link
                        to="/admin/posts/create"
                        className="glass-button mt-4 inline-flex items-center space-x-2"
                      >
                        <span>✍️</span>
                        <span>Create New Post</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-mint-green/10 to-transparent" />
        <div className="absolute inset-0 pattern-waves opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl font-heading font-bold text-gradient mb-12 text-center">
            ✨ Express Yourself
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-8 text-center"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-heading font-bold mb-2">Write Stories</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your thoughts, experiences, and creative writing with the world.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-8 text-center"
            >
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-heading font-bold mb-2">Share Photos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload and showcase your beautiful photography and visual stories.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-panel p-8 text-center"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-heading font-bold mb-2">Customize</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Make your blog unique with custom themes and layouts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 