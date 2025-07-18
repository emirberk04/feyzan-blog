import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserManagement from '../../components/Admin/UserManagement';

interface DashboardStats {
  totalPosts: number;
  totalPhotos: number;
  totalUsers: number;
  recentActivity: {
    date: string;
    count: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalPhotos: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, photosRes, usersRes] = await Promise.all([
          axios.get('/api/posts/stats'),
          axios.get('/api/gallery/stats'),
          axios.get('/api/users/stats')
        ]);

        setStats({
          totalPosts: postsRes.data.total,
          totalPhotos: photosRes.data.total,
          totalUsers: usersRes.data.total,
          recentActivity: postsRes.data.recentActivity
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-violet mt-1">{value}</h3>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening in your garden today.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'content', 'users', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-floral-pink/20 text-violet'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-floral-pink/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Posts" value={stats.totalPosts} icon="📝" />
              <StatCard title="Total Photos" value={stats.totalPhotos} icon="📸" />
              <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
              <h3 className="text-lg font-semibold text-violet mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/admin/posts/create"
                  className="flex items-center p-4 rounded-lg bg-floral-pink/10 hover:bg-floral-pink/20 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">✍️</span>
                  <div>
                    <h4 className="font-medium text-violet">New Post</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create a blog post</p>
                  </div>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center p-4 rounded-lg bg-butterfly-blue/10 hover:bg-butterfly-blue/20 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <h4 className="font-medium text-violet">Manage Users</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View and edit users</p>
                  </div>
                </Link>
                <Link
                  to="/admin/gallery"
                  className="flex items-center p-4 rounded-lg bg-rose-gold/10 hover:bg-rose-gold/20 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">🖼️</span>
                  <div>
                    <h4 className="font-medium text-violet">Gallery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage photos</p>
                  </div>
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center p-4 rounded-lg bg-lavender/10 hover:bg-lavender/20 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">⚙️</span>
                  <div>
                    <h4 className="font-medium text-violet">Settings</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configure site</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
              <h3 className="text-lg font-semibold text-violet mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📊</span>
                      <div>
                        <p className="font-medium text-violet">{activity.count} new items</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-4">Content Management</h3>
            {/* Content management components will be added here */}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-4">User Management</h3>
            <UserManagement />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-4">Site Settings</h3>
            {/* Settings components will be added here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 