import axios, { AxiosError } from 'axios';

// Use import.meta for Vite projects instead of process.env
const API_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Error class for Two-Factor Authentication errors
 */
export class TwoFactorAuthError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TwoFactorAuthError';
    this.status = status;
  }
}

/**
 * Interface for 2FA setup response
 */
export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  recoveryCodes: string[];
}

/**
 * Process API errors consistently
 */
const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data as any;
    const errorMessage = responseData?.message || 'An error occurred with Two-Factor Authentication';
    throw new TwoFactorAuthError(errorMessage, status);
  }
  throw new TwoFactorAuthError(error.message || 'An unexpected error occurred');
};

/**
 * Service for handling Two-Factor Authentication operations
 */
const twoFactorAuthService = {
  /**
   * Get current 2FA status for the user
   * @param token Authentication token
   * @returns Status object including whether 2FA is enabled
   */
  getTwoFactorStatus: async (token: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/two-factor/status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting 2FA status:', error);
      return handleApiError(error);
    }
  },

  /**
   * Setup 2FA for the current user
   * @param token Authentication token
   * @returns Setup data including QR code and recovery codes
   */
  setupTwoFactor: async (token: string): Promise<TwoFactorSetupResponse> => {
    try {
      const response = await axios.post(
        `${API_URL}/two-factor/setup`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      return handleApiError(error);
    }
  },

  /**
   * Verify and enable 2FA for the current user
   * @param token Authentication token
   * @param verificationCode TOTP code from authenticator app
   * @returns Success message
   */
  verifyAndEnableTwoFactor: async (token: string, verificationCode: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${API_URL}/two-factor/verify`,
        { token: verificationCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return handleApiError(error);
    }
  },

  /**
   * Disable 2FA for the current user
   * @param token Authentication token
   * @param password User's current password
   * @returns Success message
   */
  disableTwoFactor: async (token: string, password: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${API_URL}/two-factor/disable`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return handleApiError(error);
    }
  },

  /**
   * Validate a 2FA token during login
   * @param email User's email
   * @param verificationCode TOTP code from authenticator app
   * @returns Authentication data including token and user info
   */
  validateTwoFactorToken: async (email: string, verificationCode: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/two-factor/validate`, {
        email,
        token: verificationCode,
      });
      return response.data;
    } catch (error) {
      console.error('Error validating 2FA token:', error);
      return handleApiError(error);
    }
  },

  /**
   * Use a recovery code during login
   * @param email User's email
   * @param recoveryCode Recovery code
   * @returns Authentication data including token and user info
   */
  useRecoveryCode: async (email: string, recoveryCode: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/two-factor/recovery`, {
        email,
        recoveryCode,
      });
      return response.data;
    } catch (error) {
      console.error('Error using recovery code:', error);
      return handleApiError(error);
    }
  },

  /**
   * Generate new recovery codes
   * @param token Authentication token
   * @param password User's current password
   * @returns New recovery codes
   */
  generateNewRecoveryCodes: async (token: string, password: string): Promise<string[]> => {
    try {
      const response = await axios.post(
        `${API_URL}/two-factor/recovery-codes`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data.recoveryCodes;
    } catch (error) {
      console.error('Error generating new recovery codes:', error);
      return handleApiError(error);
    }
  },
};

export default twoFactorAuthService;
