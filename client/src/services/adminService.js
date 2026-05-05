import api from './api';

const getStats = async () => api.get('/admin/stats');

const getProducts = async (params = {}) => api.get('/admin/products', { params });

const createProduct = async (productData) => api.post('/admin/products', productData);

const updateProduct = async (id, productData) => api.put(`/admin/products/${id}`, productData);

const deleteProduct = async (id) => api.delete(`/admin/products/${id}`);

const getLowStockProducts = async () => api.get('/admin/low-stock');

const getRecentOrders = async (params = {}) => api.get('/admin/recent-orders', { params });

const getOrders = async (params = {}) => api.get('/admin/orders', { params });

const getOrder = async (id) => api.get(`/admin/orders/${id}`);

const updateOrderStatus = async (id, status) => api.patch(`/admin/orders/${id}/status`, { status });

const getUsers = async (params = {}) => api.get('/admin/users', { params });

const updateUserRole = async (id, role) => api.patch(`/admin/users/${id}/role`, { role });

const blockUser = async (id) => api.patch(`/admin/users/${id}/block`);

export default {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getRecentOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUsers,
  updateUserRole,
  blockUser,
};

