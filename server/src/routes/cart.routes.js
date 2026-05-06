const express = require('express');
const router = express.Router();
const { 
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { cartValidator, cartItemValidator, cartItemIdValidator, mergeGuestCartValidator } = require('../validators/cartValidator');

router.get('/', protect, getCart);
router.post('/add', protect, cartValidator, addToCart);
router.put('/update/:itemId', protect, cartItemIdValidator, cartItemValidator, updateCartItem);
router.delete('/remove/:itemId', protect, cartItemIdValidator, removeCartItem);
router.delete('/clear', protect, clearCart);
router.post('/merge', protect, mergeGuestCartValidator, mergeGuestCart);

module.exports = router;