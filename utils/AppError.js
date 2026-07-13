// utils/AppError.js
// Custom error class used across the backend so controllers can
// handle errors consistently via the centralized error middleware.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // isOperational = true => expected error app is operational after the error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
