"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        ...(err instanceof appError_1.AppError ? { statusCode: err.statusCode, status: err.status } : {})
    });
    // Handle Mongoose validation errors
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(422).json({
            status: 'fail',
            message: 'Validation Error',
            errors
        });
    }
    // Handle Mongoose duplicate key errors
    if (err instanceof mongoose_1.default.Error && err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            status: 'fail',
            message: `Duplicate field value: ${field}. Please use another value.`
        });
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token. Please log in again.'
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'fail',
            message: 'Your token has expired. Please log in again.'
        });
    }
    // Handle AppError instances
    if (err instanceof appError_1.AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.errors && { errors: err.errors })
        });
    }
    // Handle unexpected errors
    const statusCode = err.statusCode || 500;
    const status = statusCode === 500 ? 'error' : 'fail';
    const message = statusCode === 500
        ? 'Something went wrong on the server'
        : err.message;
    return res.status(statusCode).json({
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
