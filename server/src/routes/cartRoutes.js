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
const { 
  cartValidator, 
  cartItemValidator, 
  cartItemIdValidator, 
  mergeGuestCartValidator 
} = require('../validators/cartValidator');

// All routes require auth
router.use(protect);

router.get('/', getCart);
router.post('/', cartValidator, addToCart);
router.put('/items/:itemId', cartItemIdValidator, cartItemValidator, updateCartItem);
router.delete('/items/:itemId', cartItemIdValidator, removeCartItem);
router.delete('/', clearCart);
router.post('/merge-guest', mergeGuestCartValidator, mergeGuestCart);

module.exports = router;

