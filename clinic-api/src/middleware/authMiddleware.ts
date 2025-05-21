import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';

// Extended Request interface with user property
export interface AuthRequest extends Request {
  user?: any;
}

// Protect routes - Only authenticated users can access
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1) Get token from Authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // 2) Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded: any = await promisify<string, string, any>(jwt.verify)(token, jwtSecret);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user associated with this token no longer exists.',
      });
    }

    // 4) Set user in request object
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: (error as Error).message,
    });
  }
};

// Grant access to specific roles
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};
