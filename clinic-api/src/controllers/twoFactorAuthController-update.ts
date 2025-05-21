import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { generateTOTPSecret, generateQRCode, verifyTOTP, generateRecoveryCodes } from '../utils/twoFactorAuth';

/**
 * Get the current status of two-factor authentication for a user
 */
export const getTwoFactorStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled || false,
      twoFactorVerified: user.twoFactorVerified || false,
    });
  } catch (error) {
    console.error('Error getting two-factor status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get two-factor authentication status',
      error: (error as Error).message,
    });
  }
};

/**
 * Generate a new TOTP secret for a user and return setup information
 */
export const setupTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate TOTP secret
    const secret = generateTOTPSecret(user.email);
    
    // Generate QR code data URL
    const qrCodeUrl = await generateQRCode(secret.otpauthUrl as string);
    
    // Generate recovery codes
    const recoveryCodes = generateRecoveryCodes();

    // Save secret and recovery codes to user document (not enabled until verified)
    user.twoFactorSecret = secret.base32;
    user.recoveryCodes = recoveryCodes;
    user.twoFactorVerified = false;
    user.twoFactorEnabled = false;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        secret: secret.base32,
        qrCodeUrl,
        recoveryCodes,
      },
    });
  } catch (error) {
    console.error('Error setting up two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set up two-factor authentication',
      error: (error as Error).message,
    });
  }
};

/**
 * Verify a TOTP token and enable two-factor authentication for a user
 */
export const verifyAndEnableTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has a TOTP secret
    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication has not been set up',
      });
    }

    // Verify the token
    const isValid = verifyTOTP(token, user.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Enable two-factor authentication
    user.twoFactorVerified = true;
    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication has been enabled',
    });
  } catch (error) {
    console.error('Error verifying two-factor token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify two-factor token',
      error: (error as Error).message,
    });
  }
};

/**
 * Disable two-factor authentication for a user
 */
export const disableTwoFactor = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled',
      });
    }

    // Verify the password
    // For demo purposes, we might skip actual password verification
    // Normally, you would use a method like user.comparePassword(password) here
    
    // Disable two-factor authentication
    user.twoFactorSecret = undefined;
    user.twoFactorEnabled = false;
    user.twoFactorVerified = false;
    user.recoveryCodes = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication has been disabled',
    });
  } catch (error) {
    console.error('Error disabling two-factor authentication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable two-factor authentication',
      error: (error as Error).message,
    });
  }
};

/**
 * Validate a TOTP token during login
 */
export const validateTwoFactorToken = async (req: Request, res: Response) => {
  try {
    const { email, token, recoveryCode } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!token && !recoveryCode) {
      return res.status(400).json({
        success: false,
        message: 'Verification code or recovery code is required',
      });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled for this user',
      });
    }

    let isValid = false;

    // If recovery code is provided
    if (recoveryCode && user.recoveryCodes) {
      const recoveryCodeIndex = user.recoveryCodes.indexOf(recoveryCode);
      if (recoveryCodeIndex !== -1) {
        // Remove the used recovery code
        user.recoveryCodes.splice(recoveryCodeIndex, 1);
        await user.save();
        isValid = true;
      }
    }
    // If token is provided
    else if (token && user.twoFactorSecret) {
      isValid = verifyTOTP(token, user.twoFactorSecret);
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Generate a JWT token (usually done in your auth controller)
    // For this example, we'll just return a success response with the user data
    
    // In a real implementation, you would generate and return a JWT token here
    // const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Two-factor authentication successful',
      token: 'mock-jwt-token', // Replace with actual JWT token
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error validating two-factor token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate two-factor token',
      error: (error as Error).message,
    });
  }
};

/**
 * Generate new recovery codes for a user
 */
export const generateNewRecoveryCodes = async (req: AuthRequest, res: Response) => {
  try {
    const { password } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled',
      });
    }

    // Verify the password
    // For demo purposes, we might skip actual password verification
    // Normally, you would use a method like user.comparePassword(password) here
    
    // Generate new recovery codes
    const recoveryCodes = generateRecoveryCodes();
    user.recoveryCodes = recoveryCodes;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'New recovery codes generated successfully',
      data: {
        recoveryCodes,
      },
    });
  } catch (error) {
    console.error('Error generating new recovery codes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate new recovery codes',
      error: (error as Error).message,
    });
  }
};
