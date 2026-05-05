const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);
router.get('/', protect, requireRole('admin'), getAllOrders);
router.patch('/status', protect, requireRole('admin'), updateOrderStatus);

module.exports = router;
