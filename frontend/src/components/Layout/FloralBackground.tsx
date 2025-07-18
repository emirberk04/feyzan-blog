import React from 'react';
import { motion } from 'framer-motion';

const FloralBackground: React.FC = () => {
  const floralElements = [
    { emoji: '🌸', size: 'text-2xl', delay: 0 },
    { emoji: '🌺', size: 'text-3xl', delay: 2 },
    { emoji: '🌻', size: 'text-4xl', delay: 4 },
    { emoji: '🌷', size: 'text-2xl', delay: 1 },
    { emoji: '🦋', size: 'text-xl', delay: 3 },
    { emoji: '🐝', size: 'text-lg', delay: 5 },
    { emoji: '🌿', size: 'text-xl', delay: 2.5 },
    { emoji: '🍃', size: 'text-lg', delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-petal-white via-lavender/30 to-mint-green/20"></div>
      
      {/* Animated Floating Elements */}
      {floralElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} opacity-20 dark:opacity-10`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: element.delay,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        >
          {element.emoji}
        </motion.div>
      ))}

      {/* Stationary Background Elements */}
      <motion.div
        className="absolute top-20 left-10 text-6xl opacity-10 dark:opacity-5"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌺
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-20 text-4xl opacity-10 dark:opacity-5"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        🦋
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/4 text-5xl opacity-10 dark:opacity-5"
        animate={{
          rotate: [0, -15, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        🌻
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 text-3xl opacity-10 dark:opacity-5"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        🌿
      </motion.div>

      {/* Subtle Particle Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-floral-pink/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloralBackground; 