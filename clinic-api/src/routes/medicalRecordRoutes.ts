import express from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { protect, authorize } from '../middleware/auth';
import {
  getPatientRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordsByDateRange,
  getRecordsByDoctor,
} from '../controllers/medicalRecordController';

const router = express.Router();

// Validation middleware
const recordValidation = [
  body('patientId').isMongoId().withMessage('Invalid patient ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
  body('treatment').trim().notEmpty().withMessage('Treatment is required'),
  body('doctor').trim().notEmpty().withMessage('Doctor name is required'),
];

// Routes
router.get('/patient/:patientId', protect, [
  param('patientId').isMongoId().withMessage('Invalid patient ID'),
], validateRequest, getPatientRecords);

router.get('/patient/:patientId/date-range', protect, [
  param('patientId').isMongoId().withMessage('Invalid patient ID'),
  query('startDate').isISO8601().withMessage('Invalid start date'),
  query('endDate').isISO8601().withMessage('Invalid end date'),
], validateRequest, getRecordsByDateRange);

router.get('/doctor/:doctor', protect, [
  param('doctor').trim().notEmpty().withMessage('Doctor name is required'),
], validateRequest, getRecordsByDoctor);

router.get('/:id', protect, [
  param('id').isMongoId().withMessage('Invalid record ID'),
], validateRequest, getRecordById);

router.post('/', protect, authorize('admin', 'doctor'), [
  ...recordValidation,
], validateRequest, createRecord);

router.put('/:id', protect, authorize('admin', 'doctor'), [
  param('id').isMongoId().withMessage('Invalid record ID'),
  ...recordValidation,
], validateRequest, updateRecord);

router.delete('/:id', protect, authorize('admin'), [
  param('id').isMongoId().withMessage('Invalid record ID'),
], validateRequest, deleteRecord);

export default router; 