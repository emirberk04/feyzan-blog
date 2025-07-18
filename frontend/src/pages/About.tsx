import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const features = [
    {
      icon: '✍️',
      title: 'Creative Writing',
      description: 'Share your thoughts and stories through beautifully crafted blog posts.'
    },
    {
      icon: '📸',
      title: 'Visual Stories',
      description: 'Upload and showcase your photography and visual content.'
    },
    {
      icon: '💭',
      title: 'Personal Space',
      description: 'Your own corner on the internet to express yourself freely.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Connect with like-minded creators and build meaningful relationships.'
    },
    {
      icon: '🎨',
      title: 'Creative Freedom',
      description: 'Multiple categories and formats to suit your creative style.'
    }
  ];

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
              🌸 About Feyzan Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              A beautiful space for sharing stories, memories, and creative content. Express yourself through words, photos, and videos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-gradient mb-6">
                My Mission 🎯
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Welcome to my little corner of the internet! Here, I simply share photos and give you a glimpse into my daily life.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
              It makes me incredibly happy if seeing glimpses of my life can bring a smile to your face.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/images/about-mission.jpg"
                  alt="Blog mission"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://res.cloudinary.com/di8nysbyk/image/upload/v1752828969/IMG_8543_y3hf9e.jpg';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-gradient mb-12 text-center">
            What We Offer ✨
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="card-floral p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-gradient-to-br from-violet/10 via-floral-pink/5 to-butterfly-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-heading font-bold text-gradient mb-6">
              Join Our Blooming Community 🌺
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Ready to start sharing your stories? Join our community of creative minds 
              and begin your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="btn-floral flex items-center space-x-2"
              >
                <span>🌱</span>
                <span>Start Your Journey</span>
              </Link>
              <Link
                to="/contact"
                className="btn-floral bg-white/80 text-violet border-2 border-floral-pink hover:bg-floral-pink/10"
              >
                <span>💌 Get in Touch</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About; 