import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

export interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    try {
      // Make sure JWT_SECRET is defined
      if (!process.env.JWT_SECRET) {
        return next(new AppError('Server configuration error: JWT_SECRET is not defined', 500));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      
      // Add user to request
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError('Token expired', 401));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError('Invalid token', 401));
      }
      return next(new AppError('Authentication failed', 401));
    }
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; 