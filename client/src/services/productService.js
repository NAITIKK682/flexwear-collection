import api from './api';

const getAllProducts = async (params = {}) => {
  return api.get('/products', { params });
};

const getProductById = async (id) => {
  return api.get(`/products/${id}`);
};

const addReview = async (productId, reviewData) => {
  return api.post(`/products/${productId}/review`, reviewData);
};

export default {
  getAllProducts,
  getProductById,
  addReview,
};
