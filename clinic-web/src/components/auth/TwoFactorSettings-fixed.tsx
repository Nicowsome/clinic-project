import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Key as KeyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import twoFactorAuthService from '../../services/twoFactorAuthService';
import TwoFactorSetup from './TwoFactorSetup';
import { useNotifications } from '../../context/NotificationContext';

interface TwoFactorSettingsProps {
  onComplete?: (enabled: boolean) => void;
}

const TwoFactorSettings: React.FC<TwoFactorSettingsProps> = ({ onComplete }) => {
  const { user, token, refreshUserData } = useAuth();
  const { addNotification } = useNotifications();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  // Check if user has 2FA enabled
  const is2FAEnabled = user?.twoFactorEnabled || false;

  const handleSetupComplete = async () => {
    setShowSetup(false);
    await refreshUserData();
    
    // Notify parent component that 2FA was enabled
    if (onComplete) {
      onComplete(true);
    }
    
    // Add notification
    addNotification({
      type: 'success',
      title: 'Two-Factor Authentication Enabled',
      message: 'Your account is now protected with two-factor authentication.',
    });
  };

  const handleDisable2FA = async () => {
    if (!password) {
      setError('Password is required');
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Password is required to disable two-factor authentication',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Authentication token is missing');

      await twoFactorAuthService.disableTwoFactor(token, password);
      setShowDisableDialog(false);
      setPassword('');
      await refreshUserData();
      
      // Notify parent component that 2FA was disabled
      if (onComplete) {
        onComplete(false);
      }
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Two-Factor Authentication has been disabled',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to disable Two-Factor Authentication';
      setError(errorMessage);
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateRecoveryCodes = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Authentication token is missing');

      const newCodes = await twoFactorAuthService.generateNewRecoveryCodes(token, password);
      setRecoveryCodes(newCodes);
      setShowRegenerateDialog(false);
      setShowRecoveryCodes(true);
      setPassword('');
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'New recovery codes generated successfully',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate new recovery codes';
      setError(errorMessage);
      
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 4, border: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center">
          <SecurityIcon fontSize="large" sx={{ color: theme.palette.primary.main, mr: 2 }} />
          <Box>
            <Typography variant="h6">Two-Factor Authentication</Typography>
            <Typography variant="body2" color="text.secondary">
              Add an extra layer of security to your account
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" gutterBottom>
              Status
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  {is2FAEnabled ? (
                    <CheckIcon color="success" />
                  ) : (
                    <CloseIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    is2FAEnabled
                      ? 'Two-Factor Authentication is enabled'
                      : 'Two-Factor Authentication is not enabled'
                  }
                  secondary={
                    is2FAEnabled
                      ? 'Your account is protected with two-factor authentication'
                      : 'Enable two-factor authentication for enhanced security'
                  }
                />
              </ListItem>
            </List>

            {is2FAEnabled && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Recovery Codes
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Recovery codes allow you to access your account if you lose your phone or
                  authenticator app. Each code can only be used once.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setShowRegenerateDialog(true);
                    setError(null);
                  }}
                  sx={{ mr: 2 }}
                >
                  Generate New Codes
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              sx={{
                bgcolor: 'background.default',
                p: 3,
                borderRadius: 1,
                height: '100%',
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {is2FAEnabled ? 'Manage 2FA' : 'Enable 2FA'}
              </Typography>
              {is2FAEnabled ? (
                <>
                  <Typography variant="body2" paragraph>
                    You've enabled two-factor authentication, which helps keep your account secure.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setShowDisableDialog(true);
                      setError(null);
                    }}
                  >
                    Disable 2FA
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body2" paragraph>
                    Enable two-factor authentication for an additional layer of security.
                    You'll need an authenticator app like Google Authenticator or Microsoft Authenticator.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowSetup(true);
                      setError(null);
                    }}
                  >
                    Enable 2FA
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Two-Factor Setup Component */}
      {showSetup && (
        <Box sx={{ mt: 4 }}>
          <TwoFactorSetup
            onComplete={handleSetupComplete}
            onCancel={() => {
              setShowSetup(false);
              setError(null);
            }}
          />
        </Box>
      )}

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onClose={() => setShowDisableDialog(false)}>
        <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove the additional layer of security from your account.
            For security reasons, please enter your password to confirm.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowDisableDialog(false);
            setPassword('');
            setError(null);
          }}>
            Cancel
          </Button>
          <Button onClick={handleDisable2FA} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Disable'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Regenerate Recovery Codes Dialog */}
      <Dialog open={showRegenerateDialog} onClose={() => setShowRegenerateDialog(false)}>
        <DialogTitle>Generate New Recovery Codes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will invalidate your existing recovery codes and generate new ones.
            For security reasons, please enter your password to confirm.
          </DialogContentText>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowRegenerateDialog(false);
            setPassword('');
            setError(null);
          }}>
            Cancel
          </Button>
          <Button onClick={handleRegenerateRecoveryCodes} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog
        open={showRecoveryCodes}
        onClose={() => setShowRecoveryCodes(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Your New Recovery Codes</DialogTitle>
        <DialogContent>
          <DialogContentText color="error">
            Save these recovery codes in a safe place. Each code can only be used once.
            You won't be able to see these codes again.
          </DialogContentText>
          
          <Alert severity="warning" sx={{ my: 2 }}>
            Please save these codes immediately. You will not be able to see them again unless you generate new ones.
          </Alert>
          
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2}>
              {recoveryCodes.map((code, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    sx={{
                      bgcolor: 'grey.100',
                      p: 1.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      textAlign: 'center',
                    }}
                  >
                    {code}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowRecoveryCodes(false)} 
            color="primary"
            variant="contained"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Memo the component to avoid unnecessary re-renders
export default React.memo(TwoFactorSettings);
