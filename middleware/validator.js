const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Middleware to handle and return validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Collect all error messages and pass them to our global error handler
    const errorMessages = errors.array().map(err => err.msg).join(' | ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Rules for creating/updating a Category
exports.categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.'),
  validate
];

// Rules for creating/updating a Product
exports.productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required.'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  body('category')
    .notEmpty().withMessage('Category ID is required.')
    .isMongoId().withMessage('Invalid Category ID format.'),
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a positive integer or zero.'),
  validate
];

// Rules for adding items to the Cart
exports.cartItemValidationRules = [
  body('productId')
    .notEmpty().withMessage('Product ID is required.')
    .isMongoId().withMessage('Invalid Product ID format.'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity is required and must be at least 1.'),
  validate
];

// Rules for checking out / placing an Order
exports.orderValidationRules = [
  body('street').trim().notEmpty().withMessage('Street address is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('country').trim().notEmpty().withMessage('Country is required.'),
  validate
];