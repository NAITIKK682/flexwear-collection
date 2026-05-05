const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
