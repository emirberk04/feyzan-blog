import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CreatePost: React.FC = () => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'personal',
    tags: '',
    status: 'draft',
    featured: false,
    featuredImage: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const categories = [
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showError('Image size must be less than 10MB');
        return;
      }
      
      setPostData(prev => ({
        ...prev,
        featuredImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'blog-posts');

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data.data.image;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postData.title.trim() || !postData.content.trim()) {
      showError('Please fill in title and content');
      return;
    }

    if (postData.title.length < 5) {
      showError('Title must be at least 5 characters long');
      return;
    }

    if (postData.content.length < 50) {
      showError('Content must be at least 50 characters long');
      return;
    }

    setIsLoading(true);

    try {
      let featuredImageData = null;

      // Upload featured image if selected
      if (postData.featuredImage) {
        featuredImageData = await uploadImage(postData.featuredImage);
      }

      // Prepare post data
      const submitData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        excerpt: postData.excerpt.trim() || undefined,
        category: postData.category,
        tags: postData.tags ? postData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag) : [],
        status: postData.status,
        featured: postData.featured,
        featuredImage: featuredImageData
      };

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/posts`, submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        showSuccess('🌸 Post created successfully!');
        navigate('/blog');
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      showError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    setPostData(prev => ({ ...prev, status: 'draft' }));
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  const handlePublish = () => {
    setPostData(prev => ({ ...prev, status: 'published' }));
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      form?.requestSubmit();
    }, 100);
  };

  if (!user || (user.role !== 'author' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need author or admin permissions to create posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-floral-pink/10 via-lavender/10 to-mint-green/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your story with the world
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={postData.title}
                onChange={handleInputChange}
                placeholder="Enter an engaging title..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent text-lg font-medium"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {postData.title.length}/200 characters
              </p>
            </div>

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🏷️ Category *
                </label>
                <select
                  name="category"
                  value={postData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🏷️ Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={postData.tags}
                  onChange={handleInputChange}
                  placeholder="travel, photography, lifestyle..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🖼️ Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setPostData(prev => ({ ...prev, featuredImage: null }));
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="featuredImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="featuredImage"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-floral-pink to-rose-gold text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      📸 Choose Image
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📄 Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={postData.excerpt}
                onChange={handleInputChange}
                rows={2}
                placeholder="Brief description of your post..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {postData.excerpt.length}/300 characters (auto-generated if empty)
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Content *
              </label>
              <textarea
                name="content"
                value={postData.content}
                onChange={handleInputChange}
                rows={12}
                placeholder="Write your amazing content here... Share your story, experiences, thoughts, or anything you'd like to express!"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {postData.content.length} characters (minimum 50 required)
              </p>
            </div>

            {/* Featured Post Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={postData.featured}
                onChange={(e) => setPostData(prev => ({
                  ...prev,
                  featured: e.target.checked
                }))}
                className="w-4 h-4 text-floral-pink focus:ring-floral-pink border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Feature this post on homepage
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                disabled={isLoading}
                className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-floral-pink to-rose-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Publishing...' : '🚀 Publish Post'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost; 