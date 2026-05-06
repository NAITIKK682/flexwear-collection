import api from './api';

const createRazorpayOrder = async (amount, orderId) => {
  // backend expects amount and a temporary order reference
  return api.post('/payment/create', { amount, orderId });
};

const verifyPayment = async (paymentData) => {
  // backend verifies the razorpay_payment_id, razorpay_order_id, and razorpay_signature
  return api.post('/payment/verify', paymentData);
};

// Exporting as a named constant to match your Checkout.jsx imports
export const paymentService = {
  createRazorpayOrder,
  verifyPayment,
};

export default paymentService;