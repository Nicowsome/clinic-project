"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordsByDoctor = exports.getRecordsByDateRange = exports.deleteRecord = exports.updateRecord = exports.createRecord = exports.getRecordById = exports.getPatientRecords = void 0;
const MedicalRecord_1 = require("../models/MedicalRecord");
const errorHandler_1 = require("../middleware/errorHandler");
// Get all records for a patient
const getPatientRecords = async (req, res, next) => {
    try {
        const records = await MedicalRecord_1.MedicalRecord.find({ patientId: req.params.patientId })
            .sort({ date: -1 })
            .populate('patientId', 'firstName lastName');
        res.json(records);
    }
    catch (error) {
        next(error);
    }
};
exports.getPatientRecords = getPatientRecords;
// Get record by ID
const getRecordById = async (req, res, next) => {
    try {
        const record = await MedicalRecord_1.MedicalRecord.findById(req.params.id)
            .populate('patientId', 'firstName lastName');
        if (!record) {
            throw new errorHandler_1.AppError('Medical record not found', 404);
        }
        res.json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.getRecordById = getRecordById;
// Create new record
const createRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord_1.MedicalRecord.create(req.body);
        await record.populate('patientId', 'firstName lastName');
        res.status(201).json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.createRecord = createRecord;
// Update record
const updateRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord_1.MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('patientId', 'firstName lastName');
        if (!record) {
            throw new errorHandler_1.AppError('Medical record not found', 404);
        }
        res.json(record);
    }
    catch (error) {
        next(error);
    }
};
exports.updateRecord = updateRecord;
// Delete record
const deleteRecord = async (req, res, next) => {
    try {
        const record = await MedicalRecord_1.MedicalRecord.findByIdAndDelete(req.params.id);
        if (!record) {
            throw new errorHandler_1.AppError('Medical record not found', 404);
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRecord = deleteRecord;
// Get records by date range
const getRecordsByDateRange = async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const { startDate, endDate } = req.query;
        const records = await MedicalRecord_1.MedicalRecord.find({
            patientId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        })
            .sort({ date: -1 })
            .populate('patientId', 'firstName lastName');
        res.json(records);
    }
    catch (error) {
        next(error);
    }
};
exports.getRecordsByDateRange = getRecordsByDateRange;
// Get records by doctor
const getRecordsByDoctor = async (req, res, next) => {
    try {
        const records = await MedicalRecord_1.MedicalRecord.find({ doctor: req.params.doctor })
            .sort({ date: -1 })
            .populate('patientId', 'firstName lastName');
        res.json(records);
    }
    catch (error) {
        next(error);
    }
};
exports.getRecordsByDoctor = getRecordsByDoctor;
