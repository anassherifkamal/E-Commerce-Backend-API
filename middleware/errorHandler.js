// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let status = 'error';

  // 1. Mongoose Validation Error (Status 400)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(el => el.message).join(', ');
  }

  // 2. Mongoose Cast Error / Bad ObjectId Format (Status 400)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for path: ${err.path}`;
  }

  // 3. MongoDB Duplicate Key Error (Status 409)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for: "${field}". Please use another value.`;
  }

  // Log the error to your terminal so you can still debug easily while developing
  console.error('Error Intercepted:', err);

  // Return the exact structure expected by your curriculum grading system
  res.status(statusCode).json({
    status: status,
    message: message,
    data: null 
  });
};