"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const protect = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return next(new appError_1.AppError('Not authorized to access this route', 401));
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new appError_1.AppError('No token provided', 401));
        }
        try {
            // Make sure JWT_SECRET is defined
            if (!process.env.JWT_SECRET) {
                return next(new appError_1.AppError('Server configuration error: JWT_SECRET is not defined', 500));
            }
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Add user to request
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return next(new appError_1.AppError('Token expired', 401));
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new appError_1.AppError('Invalid token', 401));
            }
            return next(new appError_1.AppError('Authentication failed', 401));
        }
    }
    catch (error) {
        next(new appError_1.AppError('Authentication failed', 401));
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new appError_1.AppError('Not authorized to access this route', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.authorize = authorize;
