const express = require('express');
const productsController = require('../controllers/productsController');
const { cartItemValidationRules } = require('../middleware/validator');

const router = express.Router();

router.route('/')
  .get(productsController.getAll)
  .post(productsController.create);

router.route('/:id')
  .get(productsController.getOne)
  .patch(productsController.update)
  .delete(productsController.remove);

module.exports = router;