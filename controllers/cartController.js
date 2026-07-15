const Cart         = require('../models/cart.model');
const Product      = require('../models/product.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError     = require('../utils/AppError');

// Consistent session ID string for testing
const TEST_SESSION_ID = "test-session-123";

// 1. GET /api/cart -> View cart details
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: TEST_SESSION_ID }).populate('items.product', 'name price');
  
  if (!cart) {
    return res.status(200).json({
      status: 'success',
      message: 'Cart is empty',
      data: { user: TEST_SESSION_ID, items: [], totalPrice: 0 }
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Cart retrieved successfully',
    data: cart
  });
});

// 2. DELETE /api/cart -> Clear whole cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: TEST_SESSION_ID });
  if (cart) {
    cart.items = [];
    await cart.save(); // Triggers pre-save hook to reset totalPrice to 0
  }

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully',
    data: cart
  });
});

// 3. POST /api/cart/items -> Add new item (with Stock Validation!)
exports.addItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // 1. Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  // 2. Check if the product is completely out of stock
  if (product.stock <= 0) {
    throw new AppError(`"${product.name}" is completely out of stock.`, 400);
  }

  // 3. Find cart matching this session ID or create a new one
  let cart = await Cart.findOne({ user: TEST_SESSION_ID });
  if (!cart) {
    cart = new Cart({ user: TEST_SESSION_ID, items: [] });
  }

  // 4. Calculate what the final requested quantity would be
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  let finalQuantity = Number(quantity);
  if (existingItemIndex > -1) {
    finalQuantity += cart.items[existingItemIndex].quantity;
  }

  // 5. Verify the combined quantity doesn't exceed available stock
  if (product.stock < finalQuantity) {
    throw new AppError(
      `Cannot add more items. Available stock for "${product.name}" is ${product.stock}, but your cart would have ${finalQuantity}.`,
      400
    );
  }

  // 6. Save item
  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity = finalQuantity;
    cart.items[existingItemIndex].price = product.price;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  await cart.save(); // Triggers automatic totalPrice calculation

  res.status(200).json({
    status: 'success',
    message: 'Item added to cart successfully',
    data: cart
  });
});

// 4. PATCH /api/cart/items/:productId -> Change qty (with Stock Validation!)
exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new AppError('Quantity must be at least 1.', 400);
  }

  // 1. Find product to check real stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  // 2. Validate stock limit
  if (product.stock < quantity) {
    throw new AppError(
      `Cannot update quantity. Available stock for "${product.name}" is only ${product.stock}.`,
      400
    );
  }

  const cart = await Cart.findOne({ user: TEST_SESSION_ID });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new AppError('Product not found in cart.', 404);
  }

  // Update quantity
  cart.items[itemIndex].quantity = Number(quantity);

  await cart.save(); // Recalculates totalPrice automatically

  res.status(200).json({
    status: 'success',
    message: 'Cart item quantity updated successfully',
    data: cart
  });
});

// 5. DELETE /api/cart/items/:productId -> Wipe single item
exports.removeItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: TEST_SESSION_ID });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  // Filter out the item to delete it
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save(); // Recalculates totalPrice automatically

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart successfully',
    data: cart
  });
});