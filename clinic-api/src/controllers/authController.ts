import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/appError';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(AppError.badRequest('Email already registered'));
    }

    // Create new user
    const user = await User.create({
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
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(AppError.badRequest('Please provide email and password'));
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(AppError.unauthorized('Invalid credentials'));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(AppError.unauthorized('Account is deactivated'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(AppError.unauthorized('Invalid credentials'));
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
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return next(AppError.unauthorized());
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(AppError.notFound('User not found'));
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
  } catch (error) {
    next(error);
  }
}; 