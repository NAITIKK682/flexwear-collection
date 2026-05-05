const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// 1. Get user cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price discountedPrice images stock'
  });

  if (!cart) {
    cart = new Cart({ user: req.user._id });
  }

  sendSuccess(res, 200, 'Cart fetched', cart);
});

// 2. Add to cart
const addToCart = asyncHandler(async (req, res) => {
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

  // Check if item exists
  const existingItemIndex = cart.items.findIndex(item => 
    item.product.toString() === productId && 
    item.size === size && 
    item.color === color
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size, color });
  }

  // Recalculate totals
  let totalItems = 0;
  let totalPrice = 0;
  for (let item of cart.items) {
    const prod = await Product.findById(item.product);
    const price = prod.discountedPrice || prod.price;
    totalPrice += price * item.quantity;
    totalItems += item.quantity;
  }
  
  cart.totalItems = totalItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  await cart.populate('items.product', 'name price discountedPrice images');
  
  sendSuccess(res, 200, 'Added to cart', cart);
});

// 3. Update cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return sendError(res, 404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  if (itemIndex === -1) {
    return sendError(res, 404, 'Item not found');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totals
  let totalItems = 0;
  let totalPrice = 0;
  for (let item of cart.items) {
    const prod = await Product.findById(item.product);
    const price = prod?.discountedPrice || prod?.price || 0;
    totalPrice += price * item.quantity;
    totalItems += item.quantity;
  }

  cart.totalItems = totalItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  await cart.populate('items.product', 'name price discountedPrice images');
  
  sendSuccess(res, 200, 'Cart updated', cart);
});

// 4. Remove cart item
const removeCartItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return sendError(res, 404, 'Cart not found');
  }

  cart.items = cart.items.filter(item => item._id.toString() !== itemId);

  // Recalculate totals
  let totalItems = 0;
  let totalPrice = 0;
  for (let item of cart.items) {
    const prod = await Product.findById(item.product);
    const price = prod?.discountedPrice || prod?.price || 0;
    totalPrice += price * item.quantity;
    totalItems += item.quantity;
  }

  cart.totalItems = totalItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  await cart.populate('items.product', 'name price discountedPrice images');
  
  sendSuccess(res, 200, 'Item removed', cart);
});

// 5. Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return sendError(res, 404, 'Cart not found');
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  sendSuccess(res, 200, 'Cart cleared');
});

// 6. Merge guest cart
const mergeGuestCart = asyncHandler(async (req, res) => {
  const { guestItems } = req.body; // [{productId, quantity, size, color}]

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id });
  }

  for (let guestItem of guestItems) {
    const product = await Product.findById(guestItem.productId);
    if (!product) continue;

    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === guestItem.productId &&
      item.size === guestItem.size &&
      item.color === guestItem.color
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      cart.items.push({
        product: guestItem.productId,
        quantity: guestItem.quantity,
        size: guestItem.size,
        color: guestItem.color
      });
    }
  }

  // Recalculate totals
  let totalItems = 0;
  let totalPrice = 0;
  for (let item of cart.items) {
    const prod = await Product.findById(item.product);
    const price = prod?.discountedPrice || prod?.price || 0;
    totalPrice += price * item.quantity;
    totalItems += item.quantity;
  }

  cart.totalItems = totalItems;
  cart.totalPrice = totalPrice;
  await cart.save();

  await cart.populate('items.product', 'name price discountedPrice images');
  
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

