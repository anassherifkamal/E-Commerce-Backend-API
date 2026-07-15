const express = require('express');
const orderController = require('../controllers/orderController');
const { cartItemValidationRules } = require('../middleware/validator');

const router = express.Router();

router.route('/')
  .get(orderController.getAllOrders)
  .post(orderController.createOrderFromCart);

router.route('/:id')
  .get(orderController.getOrderById);

router.route('/:id/status')
  .patch(orderController.updateOrderStatus);

module.exports = router;