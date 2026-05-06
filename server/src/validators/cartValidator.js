const { body, param, validationResult } = require('express-validator'); // ✅ Fix: Added missing validationResult import
const asyncHandler = require('../utils/asyncHandler');
const { sendError } = require('../utils/apiResponse');

const cartValidator = [
  body('productId').isMongoId().withMessage('Valid product ID required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('size').optional().isLength({ min: 1, max: 10 }).withMessage('Invalid size'),
  body('color').optional().isLength({ min: 1, max: 20 }).withMessage('Invalid color'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

const cartItemValidator = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

const cartItemIdValidator = [
  param('itemId').isMongoId().withMessage('Valid item ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

const mergeGuestCartValidator = [
  body('guestItems').isArray({ min: 1 }).withMessage('Guest items required'),
  body('guestItems.*.productId').isMongoId().withMessage('Valid product ID required'),
  body('guestItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity >= 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

module.exports = {
  cartValidator,
  cartItemValidator,
  cartItemIdValidator,
  mergeGuestCartValidator
};