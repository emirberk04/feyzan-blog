import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

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
  createdAt: string;
  tags: string[];
}

interface PhotoCardProps {
  photo: Photo;
  onLike: (photoId: string) => void;
  onDelete: (photoId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLike, onDelete }) => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await axios.delete(`/gallery/${photo._id}`);
      onDelete(photo._id);
      showSuccess('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('Failed to delete photo');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/30 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative group">
        <img
          src={photo.imageUrl}
          alt={photo.caption}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onLike(photo._id)}
              className={`p-2 rounded-full transition-all duration-300 ${
                photo.isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              ❤️
            </button>
            
            {user && (user._id === photo.author._id || user.role === 'admin') && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-800 mb-3 line-clamp-2">{photo.caption}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {photo.author.profilePicture ? (
              <img
                src={photo.author.profilePicture}
                alt={photo.author.username}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white text-xs">
                {photo.author.username[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-gray-600">{photo.author.username}</span>
          </div>
          
          <span className="text-xs text-gray-500">{formatDate(photo.createdAt)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">❤️ {photo.likesCount}</span>
          
          {photo.tags && photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {photo.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-floral-pink/20 text-floral-pink text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {photo.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{photo.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard; 