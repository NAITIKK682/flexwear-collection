const rateLimit = require('express-rate-limit');

// Global rate limiter (safer config for dev + register issues fixed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased limit to avoid "Too many requests" during development

  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },

  standardHeaders: true,
  legacyHeaders: false,

  // 👇 IMPORTANT: prevents blocking burst requests on same form submit
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

module.exports = limiter;