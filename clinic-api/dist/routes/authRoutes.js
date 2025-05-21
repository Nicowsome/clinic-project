"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Validation middleware
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'doctor', 'staff'])
        .withMessage('Invalid role')
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
];
// Routes
router.post('/register', registerValidation, validateRequest_1.validateRequest, authController_1.register);
router.post('/login', loginValidation, validateRequest_1.validateRequest, authController_1.login);
router.get('/profile', auth_1.protect, authController_1.getProfile);
exports.default = router;
