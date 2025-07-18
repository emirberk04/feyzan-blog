import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-heading font-bold text-gradient mb-4">
          🥀 404
        </h1>
        <h2 className="text-2xl font-semibold text-violet mb-4">
          This flower hasn't bloomed yet
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist in our garden.
        </p>
      </div>
    </div>
  );
};

export default NotFound; 