import { Request, Response, NextFunction } from 'express';
import { Patient } from '../models/Patient';
import { AppError } from '../middleware/errorHandler';

// Get all patients
export const getAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patients = await Patient.find().sort({ lastName: 1, firstName: 1 });
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

// Get patient by ID
export const getPatientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
};

// Create new patient
export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    if (error.code === 11000) {
      next(new AppError('A patient with this name already exists', 400));
    } else {
      next(error);
    }
  }
};

// Update patient
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    res.json(patient);
  } catch (error) {
    if (error.code === 11000) {
      next(new AppError('A patient with this name already exists', 400));
    } else {
      next(error);
    }
  }
};

// Delete patient
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Search patients
export const searchPatients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;
    const searchRegex = new RegExp(query, 'i');

    const patients = await Patient.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ],
    }).sort({ lastName: 1, firstName: 1 });

    res.json(patients);
  } catch (error) {
    next(error);
  }
}; 