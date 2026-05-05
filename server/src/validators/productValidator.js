const { body, param, validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { sendError } = require('../utils/apiResponse');

const productCreateValidator = [
  body('name').trim().notEmpty().withMessage('Product name required'),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('category').isIn(['men', 'women', 'kids', 'accessories']).withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

const productIdValidator = [
  param('id').isMongoId().withMessage('Valid product ID required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 required'),
  body('comment').trim().notEmpty().withMessage('Comment required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, 'Validation failed', errors.array());
    }
    next();
  }
];

module.exports = {
  productCreateValidator,
  productIdValidator,
  reviewValidator
};

