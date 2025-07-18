import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏡' },
    { name: 'Blog', href: '/blog', icon: '📝' },
    { name: 'Gallery', href: '/gallery', icon: '📸' },
    { name: 'About', href: '/about', icon: '🌸' },
    { name: 'Contact', href: '/contact', icon: '💌' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-floral-pink/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🌺
            </motion.div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gradient">
                Feyzan Blog
              </h1>
                              <p className="text-xs text-violet opacity-80">Personal Blog & Stories</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group relative
                  ${isActivePath(item.href)
                    ? 'text-violet bg-floral-pink/20 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-violet hover:bg-floral-pink/10'
                  }
                `}
              >
                <span className="mr-2 group-hover:animate-bounce">{item.icon}</span>
                {item.name}
                {isActivePath(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-floral-pink/20 to-rose-gold/20 rounded-full -z-10"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gradient-to-r from-butterfly-blue to-lavender text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </motion.button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-floral-pink/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-floral-pink"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                  <motion.svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-floral-pink/20 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-floral-pink/10 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mr-3">👤</span>
                        Profile
                      </Link>
                      
                      {(user.role === 'admin' || user.role === 'author') && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-floral-pink/10 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="mr-3">⚙️</span>
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/posts/create"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-floral-pink/10 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="mr-3">✍️</span>
                            New Post
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <span className="mr-3">🚪</span>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-violet hover:text-floral-pink transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-floral text-sm"
                >
                  Join Garden
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-floral-pink/10 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-floral-pink/20 mt-4 pt-4 pb-4"
            >
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                      ${isActivePath(item.href)
                        ? 'text-violet bg-floral-pink/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-violet hover:bg-floral-pink/10'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {!user && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-floral-pink/10 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">🔐</span>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-floral-pink to-rose-gold text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">🌱</span>
                    Join Garden
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header; 