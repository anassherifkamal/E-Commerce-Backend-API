// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { cartItemValidationRules } = require('../middleware/validator');

// Global Cart Actions
router.route('/')
  .get(cartController.getCart)       // GET /api/cart -> View cart details
  .delete(cartController.clearCart); // DELETE /api/cart -> Clear whole cart

// Cart Items Management
router.route('/items')
  .post(cartController.addItem);     // POST /api/cart/items -> Add new item

router.route('/items/:productId')
  .patch(cartController.updateItemQuantity) // PATCH /api/cart/items/:productId -> Change qty
  .delete(cartController.removeItem);       // DELETE /api/cart/items/:productId -> Wipe single item

module.exports = router;