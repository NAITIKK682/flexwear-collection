const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// 1. Get user cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price discountedPrice images stock'
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  sendSuccess(res, 200, 'Cart fetched', cart);
});

// 2. Add to cart
const addToCart = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Console log lagaya hai taaki aap terminal mein dekh sakein exact error kya hai
    console.log("Validation Errors:", errors.array());
    return sendError(res, 400, errors.array()[0].msg);
  }

  const { productId, quantity = 1, size, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }
  
  if (product.stock < quantity) {
    return sendError(res, 400, 'Insufficient stock');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id });
  }

  const existingItemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId && 
    item.size === size && 
    item.color === color
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), size, color });
  }

  // ✅ Optimization: Model ka pre-save middleware khud totals handle karega
  await cart.save();
  await cart.populate('items.product', 'name price discountedPrice images stock');
  
  sendSuccess(res, 200, 'Added to cart', cart);
});

// 3. Update cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.itemId; // Note: Frontend should send the _id of the item in the array

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendError(res, 404, 'Cart not found');

  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  
  // Fallback: Agar itemId match na ho, toh productId se try karein
  const finalIndex = itemIndex > -1 ? itemIndex : cart.items.findIndex(item => item.product.toString() === itemId);

  if (finalIndex === -1) {
    return sendError(res, 404, 'Item not found in cart');
  }

  if (quantity <= 0) {
    cart.items.splice(finalIndex, 1);
  } else {
    cart.items[finalIndex].quantity = Number(quantity);
  }

  await cart.save();
  await cart.populate('items.product', 'name price discountedPrice images stock');
  
  sendSuccess(res, 200, 'Cart updated', cart);
});

// 4. Remove cart item
const removeCartItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return sendError(res, 404, 'Cart not found');

  // Filter out by either sub-item _id or the product ID
  cart.items = cart.items.filter(item => 
    item._id.toString() !== itemId && item.product.toString() !== itemId
  );

  await cart.save();
  await cart.populate('items.product', 'name price discountedPrice images stock');
  
  sendSuccess(res, 200, 'Item removed', cart);
});

// 5. Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  sendSuccess(res, 200, 'Cart cleared');
});

// 6. Merge guest cart
const mergeGuestCart = asyncHandler(async (req, res) => {
  const { guestItems } = req.body;

  if (!Array.isArray(guestItems)) {
    return sendError(res, 400, 'Invalid guest items format');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id });
  }

  for (let guestItem of guestItems) {
    // Skip if productId is missing
    if (!guestItem.productId) continue;

    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === guestItem.productId &&
      item.size === guestItem.size &&
      item.color === guestItem.color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(guestItem.quantity);
    } else {
      cart.items.push({
        product: guestItem.productId,
        quantity: Number(guestItem.quantity),
        size: guestItem.size,
        color: guestItem.color
      });
    }
  }

  await cart.save();
  await cart.populate('items.product', 'name price discountedPrice images stock');
  
  sendSuccess(res, 200, 'Guest cart merged', cart);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeGuestCart
};