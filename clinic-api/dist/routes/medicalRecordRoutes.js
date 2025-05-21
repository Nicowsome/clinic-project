"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_1 = require("../middleware/auth");
const medicalRecordController_1 = require("../controllers/medicalRecordController");
const router = express_1.default.Router();
// Validation middleware
const recordValidation = [
    (0, express_validator_1.body)('patientId').isMongoId().withMessage('Invalid patient ID'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
    (0, express_validator_1.body)('treatment').trim().notEmpty().withMessage('Treatment is required'),
    (0, express_validator_1.body)('doctor').trim().notEmpty().withMessage('Doctor name is required'),
];
// Routes
router.get('/patient/:patientId', auth_1.protect, [
    (0, express_validator_1.param)('patientId').isMongoId().withMessage('Invalid patient ID'),
], validateRequest_1.validateRequest, medicalRecordController_1.getPatientRecords);
router.get('/patient/:patientId/date-range', auth_1.protect, [
    (0, express_validator_1.param)('patientId').isMongoId().withMessage('Invalid patient ID'),
    (0, express_validator_1.query)('startDate').isISO8601().withMessage('Invalid start date'),
    (0, express_validator_1.query)('endDate').isISO8601().withMessage('Invalid end date'),
], validateRequest_1.validateRequest, medicalRecordController_1.getRecordsByDateRange);
router.get('/doctor/:doctor', auth_1.protect, [
    (0, express_validator_1.param)('doctor').trim().notEmpty().withMessage('Doctor name is required'),
], validateRequest_1.validateRequest, medicalRecordController_1.getRecordsByDoctor);
router.get('/:id', auth_1.protect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid record ID'),
], validateRequest_1.validateRequest, medicalRecordController_1.getRecordById);
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin', 'doctor'), [
    ...recordValidation,
], validateRequest_1.validateRequest, medicalRecordController_1.createRecord);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'doctor'), [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid record ID'),
    ...recordValidation,
], validateRequest_1.validateRequest, medicalRecordController_1.updateRecord);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid record ID'),
], validateRequest_1.validateRequest, medicalRecordController_1.deleteRecord);
exports.default = router;
