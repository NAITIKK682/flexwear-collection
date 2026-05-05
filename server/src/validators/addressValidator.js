const { body, param, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const validateAddAddress = [
  body('label')
    .isIn(['Home', 'Office', 'Other'])
    .withMessage('Label must be Home, Office, or Other'),
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ min: 5 })
    .withMessage('Street must be at least 5 characters'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('pin')
    .matches(/^\\d{6}$/)
    .withMessage('Pincode must be 6 digits'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array());
    }
    next();
  }
];

const validateUpdateAddress = [
  param('id')
    .isMongoId()
    .withMessage('Invalid address ID'),
  body('label')
    .optional()
    .isIn(['Home', 'Office', 'Other'])
    .withMessage('Label must be Home, Office, or Other'),
  body('street')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ min: 5 }),
  body('city')
    .optional()
    .trim()
    .notEmpty(),
  body('state')
    .optional()
    .trim()
    .notEmpty(),
  body('pin')
    .optional()
    .matches(/^\\d{6}$/),
  body('isDefault')
    .optional()
    .isBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array());
    }
    next();
  }
];

const validateDeleteAddress = [
  param('id')
    .isMongoId()
    .withMessage('Invalid address ID'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array());
    }
    next();
  }
];

const validateSetDefaultAddress = [
  param('id')
    .isMongoId()
    .withMessage('Invalid address ID'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, errors.array());
    }
    next();
  }
];

module.exports = {
  validateAddAddress,
  validateUpdateAddress,
  validateDeleteAddress,
  validateSetDefaultAddress
};

