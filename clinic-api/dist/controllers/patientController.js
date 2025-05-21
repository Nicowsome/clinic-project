"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPatients = exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientById = exports.getAllPatients = void 0;
const Patient_1 = require("../models/Patient");
const errorHandler_1 = require("../middleware/errorHandler");
// Get all patients
const getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient_1.Patient.find().sort({ lastName: 1, firstName: 1 });
        res.json(patients);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPatients = getAllPatients;
// Get patient by ID
const getPatientById = async (req, res, next) => {
    try {
        const patient = await Patient_1.Patient.findById(req.params.id);
        if (!patient) {
            throw new errorHandler_1.AppError('Patient not found', 404);
        }
        res.json(patient);
    }
    catch (error) {
        next(error);
    }
};
exports.getPatientById = getPatientById;
// Create new patient
const createPatient = async (req, res, next) => {
    try {
        const patient = await Patient_1.Patient.create(req.body);
        res.status(201).json(patient);
    }
    catch (error) {
        if (error.code === 11000) {
            next(new errorHandler_1.AppError('A patient with this name already exists', 400));
        }
        else {
            next(error);
        }
    }
};
exports.createPatient = createPatient;
// Update patient
const updatePatient = async (req, res, next) => {
    try {
        const patient = await Patient_1.Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patient) {
            throw new errorHandler_1.AppError('Patient not found', 404);
        }
        res.json(patient);
    }
    catch (error) {
        if (error.code === 11000) {
            next(new errorHandler_1.AppError('A patient with this name already exists', 400));
        }
        else {
            next(error);
        }
    }
};
exports.updatePatient = updatePatient;
// Delete patient
const deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient_1.Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            throw new errorHandler_1.AppError('Patient not found', 404);
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deletePatient = deletePatient;
// Search patients
const searchPatients = async (req, res, next) => {
    try {
        const query = req.query.q;
        const searchRegex = new RegExp(query, 'i');
        const patients = await Patient_1.Patient.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
            ],
        }).sort({ lastName: 1, firstName: 1 });
        res.json(patients);
    }
    catch (error) {
        next(error);
    }
};
exports.searchPatients = searchPatients;
