import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: {
    username: string;
    profilePicture?: string;
  };
  category: string;
  tags: string[];
  featuredImage?: {
    url: string;
    altText: string;
  };
  publishedAt: string;
  readingTime: number;
  views: number;
  likesCount: number;
  commentsCount: number;
}

interface BlogListResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
    };
  };
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { category } = useParams();
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  const categories = [
    { value: '', label: '🌟 All Posts', emoji: '🌟' },
    { value: 'personal', label: '👤 Personal', emoji: '👤' },
    { value: 'travel', label: '✈️ Travel', emoji: '✈️' },
    { value: 'photography', label: '📸 Photography', emoji: '📸' },
    { value: 'lifestyle', label: '🌟 Lifestyle', emoji: '🌟' },
    { value: 'technology', label: '💻 Technology', emoji: '💻' },
    { value: 'food', label: '🍽️ Food', emoji: '🍽️' },
    { value: 'art', label: '🎨 Art', emoji: '🎨' },
    { value: 'music', label: '🎵 Music', emoji: '🎵' },
    { value: 'books', label: '📚 Books', emoji: '📚' },
    { value: 'sports', label: '⚽ Sports', emoji: '⚽' },
    { value: 'health', label: '💪 Health', emoji: '💪' },
    { value: 'entertainment', label: '🎬 Entertainment', emoji: '🎬' }
  ];

  const fetchPosts = async (page = 1, categoryFilter = '', search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        ...(categoryFilter && { category: categoryFilter }),
        ...(search && { search })
      });

      const response = await axios.get<BlogListResponse>(`${API_BASE_URL}/posts?${params}`);
      
      if (response.data.success) {
        setPosts(response.data.data.posts);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error: any) {
      console.error('Fetch posts error:', error);
      showError(error.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const categoryParam = category || '';
    setSelectedCategory(categoryParam);
    fetchPosts(1, categoryParam, searchQuery);
  }, [category, searchQuery]);

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    if (newCategory) {
      navigate(`/blog/category/${newCategory}`);
    } else {
      navigate('/blog');
    }
    fetchPosts(1, newCategory, searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(page, selectedCategory, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, selectedCategory, searchQuery);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryEmoji = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.emoji : '📝';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Flowers */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-4xl opacity-20"
        >
          🌸
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 text-3xl opacity-25"
        >
          🌺
        </motion.div>

        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 12, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-40 left-20 text-5xl opacity-15"
        >
          🌼
        </motion.div>

        <motion.div
          animate={{
            y: [0, 18, 0],
            x: [0, -15, 0],
            rotate: [0, -6, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 text-3xl opacity-30"
        >
          🌻
        </motion.div>

        {/* Flying Insects */}
        <motion.div
          animate={{
            x: [0, 50, 0, -30, 0],
            y: [0, -20, 10, -5, 0],
            rotate: [0, 15, -10, 5, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-60 left-1/4 text-2xl opacity-40"
        >
          🦋
        </motion.div>

        <motion.div
          animate={{
            x: [0, -40, 20, -10, 0],
            y: [0, 15, -25, 8, 0],
            rotate: [0, -12, 8, -4, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-1/3 text-xl opacity-35"
        >
          🐝
        </motion.div>

        <motion.div
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -10, 20, -15, 0],
            rotate: [0, 10, -8, 12, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-60 right-1/4 text-lg opacity-30"
        >
          🐞
        </motion.div>

        {/* Gradient Background Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(255, 137, 176, 0.15)' }}
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.18, 0.08]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full blur-2xl"
          style={{ backgroundColor: 'rgba(182, 164, 255, 0.12)' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-violet/5 via-floral-pink/8 to-butterfly-blue/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-6">
                📚 Blog Stories
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover amazing stories, insights, and experiences from our community
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 dark:border-gray-600 
                             bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                             text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                             focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-floral-pink hover:text-violet transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="lg:w-80">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border border-gray-200 dark:border-gray-600 
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                           text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-300"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(null).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="glass-panel overflow-hidden">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-panel overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      {/* Featured Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featuredImage?.url || '/images/default-post.jpg'}
                          alt={post.featuredImage?.altText || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full text-sm font-medium text-violet">
                          {getCategoryEmoji(post.category)} {post.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-heading font-bold mb-3 text-gray-900 dark:text-gray-100 
                                     group-hover:text-floral-pink transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {post.author.profilePicture ? (
                              <img
                                src={post.author.profilePicture}
                                alt={post.author.username}
                                className="w-8 h-8 rounded-full border-2 border-floral-pink/50"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold 
                                           flex items-center justify-center text-white text-sm">
                                {post.author.username[0].toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {post.author.username}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span>❤️ {post.likesCount}</span>
                            <span>💬 {post.commentsCount}</span>
                            <span>👁️ {post.views}</span>
                          </div>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || selectedCategory 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No posts have been published yet'
                  }
                </p>
                {user && (
                  <Link
                    to="/admin/posts/create"
                    className="glass-button inline-flex items-center space-x-2"
                  >
                    <span>✍️</span>
                    <span>Write First Post</span>
                  </Link>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-full transition-all duration-300 ${
                        page === currentPage
                          ? 'bg-gradient-to-r from-floral-pink to-rose-gold text-white shadow-lg'
                          : 'glass-button'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="glass-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogList; 