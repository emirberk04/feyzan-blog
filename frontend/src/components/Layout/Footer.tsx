import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const categories = [
    { name: 'Flowers', href: '/blog/category/flowers' },
    { name: 'Insects', href: '/blog/category/insects' },
    { name: 'Garden Care', href: '/blog/category/garden-care' },
    { name: 'Photography', href: '/blog/category/photography' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: '📷', color: 'from-pink-500 to-red-500' },
    { name: 'Pinterest', href: '#', icon: '📌', color: 'from-red-500 to-pink-500' },
    { name: 'Twitter', href: '#', icon: '🐦', color: 'from-blue-400 to-blue-600' },
    { name: 'YouTube', href: '#', icon: '📺', color: 'from-red-500 to-red-700' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-petal-white via-lavender/30 to-mint-green/20 border-t border-floral-pink/20">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-floral-pink via-rose-gold to-butterfly-blue"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌺
              </motion.div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-gradient">
                  Feyzan Blog
                </h3>
                                  <p className="text-sm text-violet opacity-80">Personal Blog & Stories</p>
              </div>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
              Welcome to our blooming digital garden! 🌸 Here we share stories about flowers, insects, 
              and the beautiful world of nature. Join our community of garden enthusiasts and nature lovers.
            </p>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`p-3 rounded-full bg-gradient-to-r ${social.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-violet mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-violet hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:animate-bounce">🌿</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-violet mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-violet hover:translate-x-1 transition-all duration-200 flex items-center group"
                  >
                    <span className="mr-2 group-hover:animate-bounce">🏷️</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-floral-pink/20">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-heading font-semibold text-violet mb-2 flex items-center justify-center">
              <span className="mr-2">💌</span>
              Stay in Bloom
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for the latest garden tips and nature stories!
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full border border-floral-pink/30 focus:outline-none focus:ring-2 focus:ring-floral-pink/50 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <motion.button
                className="btn-floral"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join 🌱
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-floral-pink/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Feyzan Blog. Made with 💖 and lots of 🌸
          </p>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <motion.div
              className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>🐝</span>
              <span>Buzzing with love for nature</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 pointer-events-none">
        <motion.div
          className="absolute bottom-4 left-8 text-2xl opacity-30"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            delay: 0 
          }}
        >
          🌻
        </motion.div>
        <motion.div
          className="absolute bottom-6 right-16 text-xl opacity-30"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            delay: 1 
          }}
        >
          🦋
        </motion.div>
        <motion.div
          className="absolute bottom-2 left-1/3 text-lg opacity-30"
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            delay: 2 
          }}
        >
          🌷
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 