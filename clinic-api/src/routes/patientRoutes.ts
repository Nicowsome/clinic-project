import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/auth';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
} from '../controllers/patientController';

const router = express.Router();

// Validation middleware
const patientValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('address').trim().notEmpty().withMessage('Address is required'),
];

// Routes
router.get('/', getAllPatients);

router.get('/search', protect, [
  query('q').trim().notEmpty().withMessage('Search query is required'),
], validateRequest, searchPatients);

router.get('/:id', protect, [
  param('id').isMongoId().withMessage('Invalid patient ID'),
], validateRequest, getPatientById);

router.post('/', protect, authorize('admin', 'doctor'), [
  ...patientValidation,
], validateRequest, createPatient);

router.put('/:id', protect, authorize('admin', 'doctor'), [
  param('id').isMongoId().withMessage('Invalid patient ID'),
  ...patientValidation,
], validateRequest, updatePatient);

router.delete('/:id', protect, authorize('admin'), [
  param('id').isMongoId().withMessage('Invalid patient ID'),
], validateRequest, deletePatient);

export default router; 