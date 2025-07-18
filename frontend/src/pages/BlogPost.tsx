import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface PostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
    bio?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      pinterest?: string;
      website?: string;
    };
  };
  category: string;
  tags: string[];
  featuredImage?: {
    url: string;
    altText: string;
    caption?: string;
  };
  publishedAt: string;
  readingTime: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  relatedPosts?: {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: {
      url: string;
    };
    publishedAt: string;
  }[];
}

interface BlogPostResponse {
  success: boolean;
  data: {
    post: PostData;
    isLiked: boolean;
    comments: any[];
  };
}

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const navigate = useNavigate();

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

  const fetchPost = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get<BlogPostResponse>(`${API_BASE_URL}/posts/${slug}`, { headers });
      
      if (response.data.success) {
        setPost(response.data.data.post);
        setIsLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.post.likesCount);
      }
    } catch (error: any) {
      console.error('Fetch post error:', error);
      if (error.response?.status === 404) {
        showError('Post not found');
        navigate('/blog');
      } else {
        showError(error.response?.data?.message || 'Failed to load post');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) {
      showError('Please login to like posts');
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/posts/${post._id}/like`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.likesCount);
        showSuccess(response.data.message);
      }
    } catch (error: any) {
      console.error('Like post error:', error);
      showError(error.response?.data?.message || 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/posts/${post?._id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      showSuccess('🗑️ Post deleted successfully');
      navigate('/blog');
    } catch (error: any) {
      console.error('Delete post error:', error);
      showError(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple line break formatting
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-floral-pink/10 via-lavender/10 to-mint-green/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-floral-pink to-rose-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-floral-pink/10 via-lavender/10 to-mint-green/10">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto pt-4 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-floral-pink hover:text-rose-gold transition-colors"
          >
            ← Back to Blog
          </Link>
        </motion.div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 overflow-hidden"
        >
          {/* Featured Image */}
          {post.featuredImage?.url && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.altText || post.title}
                className="w-full h-full object-cover"
              />
              {post.featuredImage.caption && (
                <p className="text-sm text-gray-500 text-center mt-2 px-6">
                  {post.featuredImage.caption}
                </p>
              )}
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header */}
            <header className="mb-8">
              {/* Category */}
              <div className="mb-4">
                <Link
                  to={`/blog/category/${post.category}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-floral-pink/20 to-rose-gold/20 text-floral-pink text-sm font-medium rounded-full hover:shadow-md transition-all"
                >
                  {categories[post.category as keyof typeof categories] || '📝'} {post.category}
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  {post.author.profilePicture ? (
                    <img
                      src={post.author.profilePicture}
                      alt={post.author.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white text-xs font-bold">
                      {post.author.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{post.author.username}</span>
                </div>
                <span>•</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readingTime} min read</span>
                <span>•</span>
                <span>👁️ {post.views} views</span>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !user}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isLiked
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-floral-pink/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLiked ? '❤️' : '🤍'} {likesCount}
                </button>

                <div className="flex items-center gap-2 text-gray-500">
                  <span>💬 {post.commentsCount}</span>
                </div>

                {user && (user.role === 'admin' || post.author._id === user._id) && (
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/admin/posts/edit/${post._id}`}
                      className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mint-green to-lavender text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      ✏️ Edit Post
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-gold text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      🗑️ Delete Post
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-lg leading-relaxed">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-gradient-to-r from-floral-pink/10 to-lavender/10 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-4">
                About the Author
              </h3>
              <div className="flex items-start gap-4">
                {post.author.profilePicture ? (
                  <img
                    src={post.author.profilePicture}
                    alt={post.author.username}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white text-xl font-bold">
                    {post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {post.author.username}
                  </h4>
                  {post.author.bio && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {post.author.bio}
                    </p>
                  )}
                  {post.author.socialLinks && (
                    <div className="flex gap-3">
                      {post.author.socialLinks.instagram && (
                        <a
                          href={post.author.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-floral-pink hover:text-rose-gold transition-colors"
                        >
                          📷 Instagram
                        </a>
                      )}
                      {post.author.socialLinks.twitter && (
                        <a
                          href={post.author.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-floral-pink hover:text-rose-gold transition-colors"
                        >
                          🐦 Twitter
                        </a>
                      )}
                      {post.author.socialLinks.website && (
                        <a
                          href={post.author.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-floral-pink hover:text-rose-gold transition-colors"
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              Related Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-floral-pink/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                    {relatedPost.featuredImage?.url ? (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage.url}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-floral-pink/20 to-lavender/20 flex items-center justify-center">
                        <div className="text-2xl">📝</div>
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-floral-pink transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(relatedPost.publishedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
};

export default BlogPost; 