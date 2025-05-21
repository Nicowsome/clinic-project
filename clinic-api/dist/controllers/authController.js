"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
// Register a new user
const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return next(appError_1.AppError.badRequest('Email already registered'));
        }
        // Create new user
        const user = await User_1.User.create({
            email,
            password,
            firstName,
            lastName,
            role: role || 'staff' // Default to staff if role not specified
        });
        // Generate token
        const token = user.generateAuthToken();
        // Send response without password
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive
        };
        res.status(201).json({
            status: 'success',
            token,
            data: { user: userResponse }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return next(appError_1.AppError.badRequest('Please provide email and password'));
        }
        // Find user and include password for comparison
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user) {
            return next(appError_1.AppError.unauthorized('Invalid credentials'));
        }
        // Check if user is active
        if (!user.isActive) {
            return next(appError_1.AppError.unauthorized('Account is deactivated'));
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(appError_1.AppError.unauthorized('Invalid credentials'));
        }
        // Generate token
        const token = user.generateAuthToken();
        // Send response without password
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive
        };
        res.json({
            status: 'success',
            token,
            data: { user: userResponse }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// Get current user profile
const getProfile = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next(appError_1.AppError.unauthorized());
        }
        const user = await User_1.User.findById(req.user.id);
        if (!user) {
            return next(appError_1.AppError.notFound('User not found'));
        }
        res.json({
            status: 'success',
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isActive: user.isActive
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
