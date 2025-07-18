import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-floral-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-floral-pink/20">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-floral-pink/20">
            {users.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(255, 192, 203, 0.05)' }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-floral-pink to-rose-gold flex items-center justify-center text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
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
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    className="text-sm text-gray-900 dark:text-gray-100 bg-transparent border border-floral-pink/20 rounded-full px-3 py-1"
                  >
                    <option value="user">User</option>
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-violet hover:text-floral-pink transition-colors duration-200"
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-violet mb-4">User Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedUser.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Joined</label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 