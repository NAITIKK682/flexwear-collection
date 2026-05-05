require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/auth');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use('/api', rateLimit);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

