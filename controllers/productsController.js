const Product      = require('../models/product.model');
const Category     = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

// GET /api/products — list all products with support for dynamic filtering
exports.getAll = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  const filterQuery = {};

  // 1. Filter by Category
  if (category) {
    filterQuery.category = category;
  }

  // 2. Filter by Price Range (minPrice / maxPrice)
  if (minPrice || maxPrice) {
    filterQuery.price = {};
    if (minPrice) filterQuery.price.$gte = Number(minPrice);
    if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
  }

  // 3. Filter for available products only (inStock)
  if (inStock) {
    // Converts string 'true' / 'false' to actual Boolean
    filterQuery.inStock = inStock === 'true';
  }

  // 4. Search keyword in name and description (using Case-Insensitive $regex)
  if (search) {
    filterQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Run database query with lighter populate (just name for category)
  const products = await Product.find(filterQuery).populate('category', 'name');

  res.status(200).json({
  status: 'success',
  message: 'Products retrieved successfully',
  data: {
    products: products
  }
});
});

// GET /api/products/:id — fetch single product with full category details
exports.getOne = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name description');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Product retrieved successfully',
    data: product
  });
});

// POST /api/products — create a new product
exports.create = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  // Verify the category exists in the database first
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new AppError('Category not found. Please provide a valid category ID.', 404);
  }

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: newProduct
  });
});

// PATCH /api/products/:id — update an existing product
exports.update = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  // If category is being updated, verify it exists first
  if (category) {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new AppError('Category not found. Cannot link product to an invalid category ID.', 404);
    }
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Manually assign attributes so our model 'save' hook runs and recalculates 'inStock' if stock changes
  Object.keys(req.body).forEach(key => {
    product[key] = req.body[key];
  });

  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: product
  });
});

// DELETE /api/products/:id — remove a product
exports.remove = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: null
  });
});