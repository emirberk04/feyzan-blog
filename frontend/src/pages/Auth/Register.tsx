import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    favoriteFlowers: [] as string[],
    favoriteInsects: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const { register, user, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Popular flowers and insects for quick selection
  const popularFlowers = [
    'rose', 'tulip', 'sunflower', 'daisy', 'lily', 'orchid', 'jasmine', 'lavender'
  ];

  const popularInsects = [
    'butterfly', 'bee', 'ladybug', 'dragonfly', 'firefly', 'ant', 'grasshopper'
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validate password
  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const toggleInterest = (type: 'flowers' | 'insects', item: string) => {
    const field = type === 'flowers' ? 'favoriteFlowers' : 'favoriteInsects';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      showError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.email.trim()) {
      showError('Email is required');
      return false;
    }
    if (!formData.password) {
      showError('Password is required');
      return false;
    }
    if (!Object.values(passwordValidation).every(v => v)) {
      showError('Please meet all password requirements');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      
      if (success) {
        showSuccess('🌱 Welcome to the garden! Your account has been created.');
        const from = (location.state as any)?.from?.pathname || '/profile';
        navigate(from, { replace: true });
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-floral-pink/10 via-lavender/10 to-mint-green/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🌱
          </motion.div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            Join Our Garden
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start your blooming journey
          </p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-floral-pink/20 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3"
              >
                <div className="flex items-center">
                  <span className="text-red-500 text-lg mr-2">⚠️</span>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                    placeholder="Choose a username"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-400 text-lg">📧</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation */}
            {formData.password && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-1">{passwordValidation.length ? '✅' : '❌'}</span>
                    At least 6 characters
                  </div>
                  <div className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-1">{passwordValidation.uppercase ? '✅' : '❌'}</span>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-1">{passwordValidation.lowercase ? '✅' : '❌'}</span>
                    One lowercase letter
                  </div>
                  <div className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-1">{passwordValidation.number ? '✅' : '❌'}</span>
                    One number
                  </div>
                </div>
              </div>
            )}

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about yourself and your love for nature..."
                disabled={isLoading}
              />
            </div>

            {/* Interests */}
            <div className="space-y-4">
              {/* Favorite Flowers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Favorite Flowers (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularFlowers.map((flower) => (
                    <button
                      key={flower}
                      type="button"
                      onClick={() => toggleInterest('flowers', flower)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        formData.favoriteFlowers.includes(flower)
                          ? 'bg-floral-pink text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-floral-pink/20'
                      }`}
                      disabled={isLoading}
                    >
                      🌸 {flower.charAt(0).toUpperCase() + flower.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite Insects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Favorite Insects (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularInsects.map((insect) => (
                    <button
                      key={insect}
                      type="button"
                      onClick={() => toggleInterest('insects', insect)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        formData.favoriteInsects.includes(insect)
                          ? 'bg-mint-green text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-mint-green/20'
                      }`}
                      disabled={isLoading}
                    >
                      🦋 {insect.charAt(0).toUpperCase() + insect.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-floral-pink to-rose-gold text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🌱</span>
                  Join the Garden
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-floral-pink hover:text-rose-gold font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register; 