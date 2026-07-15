// utils/AppError.js

class AppError extends Error {
  constructor(message, statusCode) {
    // 1. Call the parent Error constructor with the error message
    super(message);

    // 2. Attach the HTTP status code (e.g., 404, 400, 500)
    this.statusCode = statusCode;
    
    // 3. Automatically determine status style ('fail' for 4xx errors, 'error' for 5xx errors)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // 4. Mark it as operational so our global error handler knows it's a trusted, handled error
    this.isOperational = true;

    // 5. Capture the stack trace so we can see exactly where the error occurred in our logs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;