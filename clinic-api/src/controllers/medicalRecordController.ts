import { Request, Response, NextFunction } from 'express';
import { MedicalRecord } from '../models/MedicalRecord';
import { AppError } from '../middleware/errorHandler';

// Get all records for a patient
export const getPatientRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .sort({ date: -1 })
      .populate('patientId', 'firstName lastName');
    res.json(records);
  } catch (error) {
    next(error);
  }
};

// Get record by ID
export const getRecordById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'firstName lastName');
    if (!record) {
      throw new AppError('Medical record not found', 404);
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

// Create new record
export const createRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await MedicalRecord.create(req.body);
    await record.populate('patientId', 'firstName lastName');
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// Update record
export const updateRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId', 'firstName lastName');

    if (!record) {
      throw new AppError('Medical record not found', 404);
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

// Delete record
export const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      throw new AppError('Medical record not found', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get records by date range
export const getRecordsByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const records = await MedicalRecord.find({
      patientId,
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    })
      .sort({ date: -1 })
      .populate('patientId', 'firstName lastName');

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// Get records by doctor
export const getRecordsByDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.params.doctor })
      .sort({ date: -1 })
      .populate('patientId', 'firstName lastName');
    res.json(records);
  } catch (error) {
    next(error);
  }
}; 