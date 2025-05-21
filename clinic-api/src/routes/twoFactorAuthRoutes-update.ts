import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  setupTwoFactor,
  verifyAndEnableTwoFactor,
  disableTwoFactor,
  validateTwoFactorToken,
  generateNewRecoveryCodes,
  getTwoFactorStatus
} from '../controllers/twoFactorAuthController';

const router = express.Router();

// Public routes
router.post('/validate', validateTwoFactorToken);
router.post('/recovery', validateTwoFactorToken); // Use the same controller for recovery codes

// Protected routes
router.use(protect);
router.get('/status', getTwoFactorStatus);
router.post('/setup', setupTwoFactor);
router.post('/verify', verifyAndEnableTwoFactor);
router.post('/disable', disableTwoFactor);
router.post('/recovery-codes', generateNewRecoveryCodes);

export default router;
