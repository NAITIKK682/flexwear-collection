const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// ✅ Routes for Razorpay Integration
router.post('/create', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

// ✅ Webhook for asynchronous payment updates (no protect middleware needed here)
router.post('/webhook', handleWebhook);

module.exports = router;