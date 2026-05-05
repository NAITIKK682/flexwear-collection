import api from './api';

const createRazorpayOrder = async (amount, orderId) => {
  return api.post('/payment/create', { amount, orderId });
};

const verifyPayment = async (paymentData) => {
  return api.post('/payment/verify', paymentData);
};

export default {
  createRazorpayOrder,
  verifyPayment,
};
