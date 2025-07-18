import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Loading from '../components/Common/Loading';

// Lazy load PhotoCard component
const PhotoCard = lazy(() => import('../components/Gallery/PhotoCard'));

interface Photo {
  _id: string;
  imageUrl: string;
  caption: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  likesCount: number;
  isLiked: boolean;
  tags: string[];
  createdAt: string;
}

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('/gallery');
      if (response.data.success) {
        // Transform backend data to match our interface
        const transformedPhotos = response.data.data.photos.map((photo: any) => ({
          ...photo,
          likesCount: photo.likes || 0,
          isLiked: photo.isLiked || false,
          tags: photo.tags || []
        }));
        setPhotos(transformedPhotos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        showError('Please select an image file');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select an image to upload');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);

    try {
      // First upload the image
      const uploadResponse = await axios.post('/upload/gallery-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (uploadResponse.data.success) {
        // Then create the gallery entry
        const response = await axios.post('/gallery', {
          imageUrl: uploadResponse.data.data.image.url,
          caption
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          showSuccess('Photo uploaded successfully! 🌸');
          setSelectedFile(null);
          setCaption('');
          setShowUploadForm(false);
          fetchPhotos();
        }
      }
    } catch (error) {
      showError('Failed to upload photo. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLike = async (photoId: string) => {
    try {
      const response = await axios.put(`/gallery/${photoId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setPhotos(photos.map(photo => 
          photo._id === photoId 
            ? { 
                ...photo, 
                likesCount: response.data.data.likes || response.data.data.likesCount || photo.likesCount,
                isLiked: response.data.data.isLiked !== undefined ? response.data.data.isLiked : !photo.isLiked 
              }
            : photo
        ));
      }
    } catch (error) {
      showError('Failed to like photo');
      console.error('Like error:', error);
    }
  };

  const handleDelete = (photoId: string) => {
    setPhotos(photos.filter(photo => photo._id !== photoId));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-floral-pink/5 to-butterfly-blue/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gradient mb-6">
              📸 Photo Gallery
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Share your beautiful moments and memories through photographs.
            </p>
            {user && (
              <motion.button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="btn-floral flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>📸</span>
                <span>{showUploadForm ? 'Cancel Upload' : 'Share a Photo'}</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Upload Form */}
      {showUploadForm && user && (
        <section className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-floral p-8"
            >
              <h2 className="text-2xl font-heading font-bold text-gradient mb-6">
                Upload a Photo 📸
              </h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption for your photo..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={uploadLoading || !selectedFile}
                  className="btn-floral w-full flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {uploadLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">Upload Photo</span>
                      <span>✨</span>
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <Suspense
                  key={photo._id}
                  fallback={
                    <div className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-xl mb-4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  }
                >
                  <PhotoCard
                    photo={photo}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No photos yet. Be the first to share a moment! ✨
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery; 