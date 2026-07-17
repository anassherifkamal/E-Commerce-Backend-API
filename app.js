require("dotenv").config();
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize'); // Added this
const connectDB = require('./db/db');

// Import your custom utility errors and handlers
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');

// Initialize the Express app
const app = express();

// 1. Middlewares (Must be before routes)
app.use(express.json()); 
app.use((req, res, next) => {
  // Use express-mongo-sanitize's internal method directly on the objects
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.headers) mongoSanitize.sanitize(req.headers);
  
  // Safely sanitize query without overwriting the Express 5 property itself
  if (req.query) mongoSanitize.sanitize(req.query); 
  
  next();
});

// 2. Mount Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 3. 404 Handler (After routes)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. Global Error Handling Middleware (Last)
app.use(globalErrorHandler);

// 5. Connect to MongoDB & Start the Server
const PORT = process.env.PORT || 5000; // Fixed config reference error

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Database connected & server running cleanly on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed:", err.message);
});

module.exports = app;