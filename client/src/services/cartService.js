import api from './api';

const getCart = async () => {
  return api.get('/cart');
};

const addToCart = async ({ productId, quantity, size, color }) => {
  return api.post('/cart/add', { productId, quantity, size, color });
};

const updateCartItem = async (itemId, quantity) => {
  return api.put(`/cart/update/${itemId}`, { quantity });
};

const removeCartItem = async (itemId) => {
  return api.delete(`/cart/remove/${itemId}`);
};

const clearCart = async () => {
  return api.delete('/cart/clear');
};

const mergeCart = async ({ guestItems }) => {
  return api.post('/cart/merge', { guestItems });
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
