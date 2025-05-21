import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { protect } from '../middleware/auth';
import { register, login, getProfile } from '../controllers/authController';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role')
    .optional()
    .isIn(['admin', 'doctor', 'staff'])
    .withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/profile', protect, getProfile);

export default router; 