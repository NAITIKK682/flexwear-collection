const crypto = require('crypto');
const Razorpay = require('razorpay');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return sendError(res, 400, 'Valid amount is required');
  }

  if (!orderId) {
    return sendError(res, 400, 'orderId is required');
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: String(orderId),
    notes: {
      orderId: String(orderId)
    }
  };

  const razorpayOrder = await razorpay.orders.create(options);

  sendSuccess(res, 200, 'Razorpay order created', {
    order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return sendError(res, 400, 'Payment verification payload is incomplete');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return sendError(res, 400, 'Invalid payment signature');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'processing';
  order.paymentId = razorpay_payment_id;
  await order.save();

  sendSuccess(res, 200, 'Payment verified successfully', order);
});

const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).send('Missing webhook signature');
  }

  const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).send('Invalid webhook signature');
  }

  const event = req.body.event;
  let orderId = null;

  if (req.body?.payload?.payment?.entity?.notes?.orderId) {
    orderId = req.body.payload.payment.entity.notes.orderId;
  }

  if (!orderId && req.body?.payload?.order?.entity?.receipt) {
    orderId = req.body.payload.order.entity.receipt;
  }

  if (!orderId) {
    return res.status(400).send('Unable to identify order from webhook payload');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).send('Order not found');
  }

  if (event === 'payment.captured') {
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    order.paymentId = req.body.payload.payment.entity.id;
  } else if (event === 'payment.failed') {
    order.paymentStatus = 'failed';
    order.orderStatus = 'pending';
  } else if (event === 'order.paid') {
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
  } else {
    return res.status(200).json({ success: true, message: 'Webhook event ignored' });
  }

  await order.save();
  return res.status(200).json({ success: true, message: 'Webhook handled' });
});

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook
};
