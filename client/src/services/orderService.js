import api from './api';

const createOrder = async (orderData) => {
  return api.post('/orders', orderData);
};

const getMyOrders = async (params = {}) => {
  return api.get('/orders/my-orders', { params });
};

const getOrderById = async (id) => {
  return api.get(`/orders/${id}`);
};

const cancelOrder = async (id) => {
  return api.put(`/orders/${id}/cancel`);
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
