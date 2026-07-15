// routes/categories.js
const express = require('express');
const router = express.Router();
const { cartItemValidationRules } = require('../middleware/validator');

// Import the category controller
const categoryController = require('../controllers/categoryController');

// Clean, chained route definitions using router.route()
router.route('/')
  .get(categoryController.getAll)
  .post(categoryController.create); 

router.route('/:id')
  .get(categoryController.getOne)
  .patch(categoryController.update)
  .delete(categoryController.remove);

module.exports = router;