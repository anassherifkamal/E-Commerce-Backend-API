const express = require('express');
const config = require('./config/config');
const connectDB = require('./db/db');

// Import your custom utility errors and handlers
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');

// Initialize the Express app
const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middlewares
app.use(express.json()); // Parses incoming JSON payloads

// 3. Mount Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handling Middleware
app.use(globalErrorHandler);

// 6. Start the Server
app.listen(config.port, () => {
  console.log(`Server running in ${config.env} mode on port ${config.port}`);
});

module.exports = app;