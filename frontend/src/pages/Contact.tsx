import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNotification } from '../contexts/NotificationContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'bravomadam7@gmail.com',
      link: 'mailto:bravomadam7@gmail.com'
    },
    {
      icon: '📱',
      title: 'Social Media',
      value: '@feysanberra',
      link: 'https://www.instagram.com/feysanberra/'
    },
    {
      icon: '📍',
      title: 'Location',
      value: 'Ankara, Turkey',
      link: 'https://maps.google.com/?q=Ankara'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        showSuccess('Message sent successfully! We will get back to you soon. 🌸');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      showError('Failed to send message. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setIsLoading(false);
    }
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
              💌 Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            If you ever wish to whisper hello, you can find me right here!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card-floral p-8"
            >
              <h2 className="text-3xl font-heading font-bold text-gradient mb-6">
                Send a Message ✉️
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter message subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-floral-pink focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Type your message here..."
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="btn-floral w-full flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">Send Message</span>
                      <span>✈️</span>
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="card-floral p-8">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-8">
                  Contact Information 📱
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <motion.a
                      key={info.title}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-lg hover:bg-floral-pink/10 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-3xl mr-4">{info.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {info.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="card-floral p-8">
                <h2 className="text-3xl font-heading font-bold text-gradient mb-8">
                  Follow Us 🦋
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    href="https://www.instagram.com/feysanberra/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 rounded-lg hover:bg-floral-pink/10 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mr-2">📸</span>
                    <span>Instagram</span>
                  </motion.a>
                  <motion.a
                    href="https://x.com/iloveunme7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 rounded-lg hover:bg-floral-pink/10 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mr-2">🐦</span>
                    <span>Twitter</span>
                  </motion.a>
                  <motion.a
                    href="https://tr.pinterest.com/bravomadam7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 rounded-lg hover:bg-floral-pink/10 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mr-2">📌</span>
                    <span>Pinterest</span>
                  </motion.a>
                  <motion.a
                    href="https://youtube.com/feyzanblog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 rounded-lg hover:bg-floral-pink/10 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-3xl mr-2">🎥</span>
                    <span>YouTube</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 