import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: '', // username or email
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.identifier.trim() || !formData.password) {
      showError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(formData.identifier.trim(), formData.password);
      
      if (success) {
        showSuccess('🌸 Welcome back to the garden!');
        const from = (location.state as any)?.from?.pathname || '/profile';
        navigate(from, { replace: true });
      } else {
        // Error is already handled in context
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-floral-pink/10 via-lavender/10 to-mint-green/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl mb-4"
          >
            🌸
          </motion.div>
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your garden to continue blooming
          </p>
        </div>

        {/* Login Form */}
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

            {/* Username/Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username or email"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-floral-pink focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
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
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🔐</span>
                  Sign In to Garden
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-floral-pink hover:text-rose-gold font-medium transition-colors duration-200"
              >
                Join the garden
              </Link>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              Forgot your password?{' '}
              <Link
                to="/forgot-password"
                className="text-floral-pink hover:text-rose-gold transition-colors duration-200"
              >
                Reset it here
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
        >
          <div className="text-center">
            <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mb-2">
              🌱 Demo Credentials
            </p>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 space-y-1">
              <div>Admin: <span className="font-mono">admin@garden.com</span> / <span className="font-mono">Admin123</span></div>
              <div>Author: <span className="font-mono">author@garden.com</span> / <span className="font-mono">Author123</span></div>
              <div>User: <span className="font-mono">user@garden.com</span> / <span className="font-mono">User123</span></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 