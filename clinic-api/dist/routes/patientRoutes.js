"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_1 = require("../middleware/auth");
const patientController_1 = require("../controllers/patientController");
const router = express_1.default.Router();
// Validation middleware
const patientValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
    (0, express_validator_1.body)('gender').isIn(['Male', 'Female']).withMessage('Gender must be either Male or Female'),
    (0, express_validator_1.body)('phone').trim().notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('address').trim().notEmpty().withMessage('Address is required'),
];
// Routes
router.get('/', patientController_1.getAllPatients);
router.get('/search', auth_1.protect, [
    (0, express_validator_1.query)('q').trim().notEmpty().withMessage('Search query is required'),
], validateRequest_1.validateRequest, patientController_1.searchPatients);
router.get('/:id', auth_1.protect, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid patient ID'),
], validateRequest_1.validateRequest, patientController_1.getPatientById);
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin', 'doctor'), [
    ...patientValidation,
], validateRequest_1.validateRequest, patientController_1.createPatient);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('admin', 'doctor'), [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid patient ID'),
    ...patientValidation,
], validateRequest_1.validateRequest, patientController_1.updatePatient);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('admin'), [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid patient ID'),
], validateRequest_1.validateRequest, patientController_1.deletePatient);
exports.default = router;
