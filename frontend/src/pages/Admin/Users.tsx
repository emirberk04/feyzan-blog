import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profilePicture?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await axios.patch(`/api/users/${userId}/status`, { isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-floral-pink"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gradient mb-2">
            👥 User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-floral-pink/20 focus:outline-none focus:ring-2 focus:ring-floral-pink/50 bg-white/80 dark:bg-gray-800/80"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded-full border border-floral-pink/20 focus:outline-none focus:ring-2 focus:ring-floral-pink/50 bg-white/80 dark:bg-gray-800/80"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="author">Author</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* User List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-floral-pink/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-floral-pink/20">
              <thead>
                <tr className="bg-floral-pink/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-floral-pink/20">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(255, 192, 203, 0.05)' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user._id === currentUser?._id ? (
                        <span className="text-sm text-violet font-medium">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="text-sm text-gray-900 dark:text-gray-100 bg-transparent border border-floral-pink/20 rounded-full px-3 py-1"
                        >
                          <option value="user">User</option>
                          <option value="author">Author</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user._id === currentUser?._id ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleUserStatus(user._id, !user.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-violet hover:text-floral-pink transition-colors duration-200"
                        onClick={() => {/* View user details */}}
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {users.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {users.filter(u => u.isActive).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-floral-pink/20">
            <h3 className="text-lg font-semibold text-violet mb-2">Authors</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {users.filter(u => u.role === 'author').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 