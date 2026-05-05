const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return sendError(res, 400, 'Order items are required');
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pin || !shippingAddress.phone) {
    return sendError(res, 400, 'Valid shipping address is required');
  }

  const validPaymentMethods = ['cod', 'razorpay'];
  if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
    return sendError(res, 400, 'Payment method must be cod or razorpay');
  }

  const productTotals = {};
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const { productId, quantity, size, color } = item || {};

    if (!productId || !quantity || !size || !color) {
      return sendError(res, 400, 'Each item must include productId, quantity, size and color');
    }

    if (quantity <= 0) {
      return sendError(res, 400, 'Item quantity must be at least 1');
    }

    if (!productTotals[productId]) {
      productTotals[productId] = { quantity: 0 };
    }

    productTotals[productId].quantity += quantity;
    orderItems.push({ productId, quantity, size, color });
  }

  const productIds = Object.keys(productTotals);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    return sendError(res, 400, 'One or more products are invalid');
  }

  const productMap = products.reduce((map, product) => {
    map[product._id.toString()] = product;
    return map;
  }, {});

  for (const productId of productIds) {
    const product = productMap[productId];
    const requiredQuantity = productTotals[productId].quantity;

    if (!product) {
      return sendError(res, 404, `Product not found: ${productId}`);
    }

    if (product.stock < requiredQuantity) {
      return sendError(res, 400, `Insufficient stock for ${product.name}`);
    }
  }

  const itemsSnapshot = orderItems.map(item => {
    const product = productMap[item.productId];
    const price = product.discountedPrice || product.price;
    totalAmount += price * item.quantity;

    return {
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price,
      size: item.size,
      color: item.color
    };
  });

  const order = await Order.create({
    user: req.user._id,
    items: itemsSnapshot,
    shippingAddress,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'paid' : 'pending',
    orderStatus: 'pending'
  });

  const stockUpdates = products.map(product => {
    const decrement = productTotals[product._id.toString()].quantity;
    return Product.findByIdAndUpdate(product._id, { $inc: { stock: -decrement } }, { new: true });
  });
  await Promise.all(stockUpdates);

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], totalItems: 0, totalPrice: 0 },
    { new: true }
  );

  sendSuccess(res, 201, 'Order created', { order, orderId: order._id });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  sendSuccess(res, 200, 'Orders fetched', { orders, total, page, limit });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 403, 'Not authorized to view this order');
  }

  sendSuccess(res, 200, 'Order fetched', order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return sendError(res, 403, 'Not authorized to cancel this order');
  }

  if (!['pending', 'processing'].includes(order.orderStatus)) {
    return sendError(res, 400, 'Order cannot be cancelled at this stage');
  }

  order.orderStatus = 'cancelled';
  await order.save();

  const restoreStock = order.items.map(item =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
  );
  await Promise.all(restoreStock);

  sendSuccess(res, 200, 'Order cancelled', order);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const { status } = req.query;

  const filter = {};
  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (status) {
    if (!allowedStatuses.includes(status)) {
      return sendError(res, 400, `Invalid order status filter: ${status}`);
    }
    filter.orderStatus = status;
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  sendSuccess(res, 200, 'Orders fetched', { orders, total, page, limit });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!orderId || !status) {
    return sendError(res, 400, 'orderId and status are required');
  }

  if (!allowedStatuses.includes(status)) {
    return sendError(res, 400, 'Invalid order status');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  order.orderStatus = status;
  if (status === 'delivered') {
    order.paymentStatus = 'paid';
  }

  await order.save();

  sendSuccess(res, 200, 'Order status updated', order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};
