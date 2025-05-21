"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, errors) {
        return new AppError(message, 400, errors);
    }
    static unauthorized(message = 'Not authorized') {
        return new AppError(message, 401);
    }
    static forbidden(message = 'Forbidden') {
        return new AppError(message, 403);
    }
    static notFound(message = 'Resource not found') {
        return new AppError(message, 404);
    }
    static validationError(message, errors) {
        return new AppError(message, 422, errors);
    }
}
exports.AppError = AppError;
