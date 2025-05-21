import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  Tab,
  Tabs,
  Link,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import twoFactorAuthService from '../../services/twoFactorAuthService';

interface TwoFactorVerificationProps {
  email: string;
  onSuccess: (data: any) => void;
  onBack: () => void;
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ 
  email, 
  onSuccess, 
  onBack 
}) => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter the verification code',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await twoFactorAuthService.validateTwoFactorToken(email, verificationCode);
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Two-factor authentication verified successfully',
      });
      
      onSuccess(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to verify code. Please try again.';
      setError(errorMessage);
      
      addNotification({
        type: 'error',
        title: 'Authentication Failed',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!recoveryCode) {
      setError('Please enter a recovery code');
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a recovery code',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await twoFactorAuthService.useRecoveryCode(email, recoveryCode);
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Recovery code accepted. Please set up two-factor authentication again.',
      });
      
      onSuccess(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid recovery code. Please try again.';
      setError(errorMessage);
      
      addNotification({
        type: 'error',
        title: 'Authentication Failed',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, method: 'verify' | 'recovery') => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (method === 'verify') {
        handleVerify();
      } else {
        handleRecovery();
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Two-Factor Authentication
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          Additional verification is required for {email}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ p: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Authentication Code" />
          <Tab label="Recovery Code" />
        </Tabs>

        {tabValue === 0 ? (
          <Box>
            <Typography variant="body2" paragraph>
              Enter the 6-digit verification code from your authenticator app.
            </Typography>
            <TextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'verify')}
              placeholder="123456"
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 6 }}
              autoFocus
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleVerify}
              disabled={loading || !verificationCode}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" paragraph>
              Enter one of your recovery codes. Note that each recovery code can only be used once.
            </Typography>
            <TextField
              fullWidth
              label="Recovery Code"
              variant="outlined"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'recovery')}
              placeholder="XXXXX-XXXXX"
              sx={{ mb: 3 }}
              autoFocus
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRecovery}
              disabled={loading || !recoveryCode}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            onClick={onBack} 
            variant="text" 
            sx={{ color: theme.palette.text.secondary }}
          >
            Back to Login
          </Button>
          
          <Link
            component="button"
            variant="body2"
            onClick={() => setTabValue(tabValue === 0 ? 1 : 0)}
            underline="hover"
          >
            {tabValue === 0 ? "Use recovery code instead" : "Use authenticator app instead"}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

// Memo the component to avoid unnecessary re-renders
export default React.memo(TwoFactorVerification);
