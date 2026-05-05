import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const roles = ['user', 'admin'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalUsers, setTotalUsers] = useState(0);

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const fetchUsers = async (page = currentPage, searchVal = search) => {
    try {
      setLoading(true);
      const params = { page, limit: itemsPerPage, search: searchVal };
      const res = await adminService.getUsers(params);
      setUsers(res.data.data || res.data || []);
      setTotalUsers(res.data.total || 0);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers(); // Refresh
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const toggleBlockUser = async (userId) => {
    try {
      await adminService.blockUser(userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to block/unblock user');
    }
  };

  const SkeletonRow = () => (
    <div className="h-20 bg-slate-200 rounded-lg animate-pulse" />
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full max-w-md px-6 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8">
          {error} <button onClick={() => setError('')} className="ml-auto underline hover:no-underline">×</button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-24 text-center py-32">
            <div className="text-7xl mb-8 opacity-20">👥</div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">No users found</h3>
            <p className="text-xl text-slate-600 max-w-md mx-auto">Try adjusting your search query</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Name</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Email</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Role</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Orders</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-500">ID: {user._id?.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-900 font-medium">{user.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {user.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-900">{user.orderCount || 0}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white shadow-sm hover:shadow-md transition"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>{role.toUpperCase()}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => toggleBlockUser(user._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                              user.isBlocked
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-8 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages} - Total {totalUsers} users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-3 border border-slate-300 rounded-xl font-semibold hover:shadow-md disabled:opacity-50 transition-all"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1 px-3 py-3 font-semibold text-slate-700">
                      {Array.from({ length: 5 }, (_, i) => {
                        const page = currentPage + i - 2;
                        if (page < 1 || page > totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-lg scale-110'
                                : 'hover:bg-slate-100 border border-slate-200'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-3 border border-slate-300 rounded-xl font-semibold hover:shadow-md disabled:opacity-50 transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

