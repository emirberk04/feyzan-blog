import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    favoriteFlowers: [] as string[],
    favoriteInsects: [] as string[],
    socialLinks: {
      instagram: '',
      twitter: '',
      pinterest: '',
      website: ''
    },
    preferences: {
      newsletter: true,
      emailNotifications: true,
      theme: 'light' as 'light' | 'dark' | 'auto'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Popular options for selection
  const availableFlowers = ['rose', 'daisy', 'lavender', 'sunflower', 'tulip', 'lily', 'orchid', 'jasmine'];
  const availableInsects = ['butterfly', 'bee', 'ladybug', 'dragonfly', 'firefly', 'ant', 'grasshopper'];

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        favoriteFlowers: user.favoriteFlowers || [],
        favoriteInsects: user.favoriteInsects || [],
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || '',
          pinterest: user.socialLinks?.pinterest || '',
          website: user.socialLinks?.website || ''
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          emailNotifications: user.preferences?.emailNotifications ?? true,
          theme: user.preferences?.theme || 'light'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }));
    } else if (name.startsWith('preferences.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const toggleInterest = (type: 'flowers' | 'insects', item: string) => {
    const field = type === 'flowers' ? 'favoriteFlowers' : 'favoriteInsects';
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await updateProfile(profileData);
      if (success) {
        showSuccess('🌸 Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        showSuccess('🔒 Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess('👋 You have been logged out. See you in the garden!');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'author': return '✍️';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-600';
      case 'author': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌸</div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading your garden profile...
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
          <div className="text-6xl mb-4">🌺</div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            Your Garden Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your blooming presence in our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-floral-pink to-rose-gold rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                  {user.username}
                </h2>
                <div className={`flex items-center justify-center gap-2 ${getRoleColor(user.role)}`}>
                  <span>{getRoleIcon(user.role)}</span>
                  <span className="text-sm font-medium capitalize">{user.role}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-floral-pink/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-mint-green/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last login</span>
                  <span className="text-sm font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-floral-pink to-rose-gold text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  {isEditing ? '👁️ View Profile' : '✏️ Edit Profile'}
                </button>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  🔒 Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {isChangingPassword ? (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 p-6"
                >
                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                    🔒 Change Password
                  </h3>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 p-6"
                >
                  {isEditing ? (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                        ✏️ Edit Profile
                      </h3>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent resize-none"
                          placeholder="Tell us about yourself and your love for nature..."
                        />
                      </div>

                      {/* Interests */}
                      <div className="space-y-4">
                        {/* Flowers */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Favorite Flowers
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableFlowers.map((flower) => (
                              <button
                                key={flower}
                                type="button"
                                onClick={() => toggleInterest('flowers', flower)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                  profileData.favoriteFlowers.includes(flower)
                                    ? 'bg-floral-pink text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-floral-pink/20'
                                }`}
                              >
                                🌸 {flower}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Insects */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Favorite Insects
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableInsects.map((insect) => (
                              <button
                                key={insect}
                                type="button"
                                onClick={() => toggleInterest('insects', insect)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                  profileData.favoriteInsects.includes(insect)
                                    ? 'bg-mint-green text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-mint-green/20'
                                }`}
                              >
                                🦋 {insect}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Social Links
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">📷</span>
                              <input
                                type="url"
                                name="socialLinks.instagram"
                                value={profileData.socialLinks.instagram}
                                onChange={handleInputChange}
                                placeholder="Instagram URL"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">🐦</span>
                              <input
                                type="url"
                                name="socialLinks.twitter"
                                value={profileData.socialLinks.twitter}
                                onChange={handleInputChange}
                                placeholder="Twitter URL"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">📌</span>
                              <input
                                type="url"
                                name="socialLinks.pinterest"
                                value={profileData.socialLinks.pinterest}
                                onChange={handleInputChange}
                                placeholder="Pinterest URL"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">🌐</span>
                              <input
                                type="url"
                                name="socialLinks.website"
                                value={profileData.socialLinks.website}
                                onChange={handleInputChange}
                                placeholder="Website URL"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Preferences
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="preferences.newsletter"
                              checked={profileData.preferences.newsletter}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-floral-pink focus:ring-floral-pink"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              📧 Subscribe to newsletter
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="preferences.emailNotifications"
                              checked={profileData.preferences.emailNotifications}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-floral-pink focus:ring-floral-pink"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              🔔 Email notifications
                            </span>
                          </label>
                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                              🎨 Theme preference
                            </label>
                            <select
                              name="preferences.theme"
                              value={profileData.preferences.theme}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-floral-pink focus:border-transparent"
                            >
                              <option value="light">☀️ Light</option>
                              <option value="dark">🌙 Dark</option>
                              <option value="auto">🔄 Auto</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-floral-pink to-rose-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : '💾 Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                        👤 Profile Information
                      </h3>

                      {/* Bio */}
                      {user.bio && (
                        <div className="p-4 bg-gradient-to-r from-floral-pink/10 to-rose-gold/10 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">About Me</h4>
                          <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                        </div>
                      )}

                      {/* Interests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.favoriteFlowers && user.favoriteFlowers.length > 0 && (
                          <div className="p-4 bg-floral-pink/10 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🌸 Favorite Flowers</h4>
                            <div className="flex flex-wrap gap-2">
                              {user.favoriteFlowers.map((flower) => (
                                <span
                                  key={flower}
                                  className="px-3 py-1 bg-floral-pink text-white text-sm rounded-full"
                                >
                                  {flower}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {user.favoriteInsects && user.favoriteInsects.length > 0 && (
                          <div className="p-4 bg-mint-green/10 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🦋 Favorite Insects</h4>
                            <div className="flex flex-wrap gap-2">
                              {user.favoriteInsects.map((insect) => (
                                <span
                                  key={insect}
                                  className="px-3 py-1 bg-mint-green text-white text-sm rounded-full"
                                >
                                  {insect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Social Links */}
                      {(user.socialLinks?.instagram || user.socialLinks?.twitter || user.socialLinks?.pinterest || user.socialLinks?.website) && (
                        <div className="p-4 bg-lavender/10 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">🔗 Social Links</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {user.socialLinks.instagram && (
                              <a
                                href={user.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                              >
                                <span>📷</span>
                                <span className="text-sm">Instagram</span>
                              </a>
                            )}
                            {user.socialLinks.twitter && (
                              <a
                                href={user.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                              >
                                <span>🐦</span>
                                <span className="text-sm">Twitter</span>
                              </a>
                            )}
                            {user.socialLinks.pinterest && (
                              <a
                                href={user.socialLinks.pinterest}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                              >
                                <span>📌</span>
                                <span className="text-sm">Pinterest</span>
                              </a>
                            )}
                            {user.socialLinks.website && (
                              <a
                                href={user.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                              >
                                <span>🌐</span>
                                <span className="text-sm">Website</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Account Info */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">📋 Account Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{user.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Role:</span>
                            <span className="ml-2 text-gray-900 dark:text-white capitalize">{user.role}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="ml-2 text-green-600">
                              {user.isActive ? '✅ Active' : '❌ Inactive'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
                            <span className="ml-2">
                              {user.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 