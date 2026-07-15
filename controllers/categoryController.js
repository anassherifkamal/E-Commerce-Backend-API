const Category     = require('../models/category.model');  
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

// GET /api/categories — list all categories
exports.getAll = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ status: 'success', data: categories });
});

// GET /api/categories/:id — fetch one category by ID
exports.getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  res.json({ status: 'success', data: category });
});

// POST /api/categories — create a new category
exports.create = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ status: 'success', data: category });
});

// PATCH /api/categories/:id — update a category (partial update)
exports.update = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  // Dynamically apply updates to the category document fields
  Object.keys(req.body).forEach((key) => {
    category[key] = req.body[key];
  });

  // Saving the document manually triggers the pre-save hook so the slug is recalculated
  await category.save();

  res.json({ status: 'success', data: category });
});

// DELETE /api/categories/:id — remove a category
exports.remove = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);
  res.json({ status: 'success', data: null });
});