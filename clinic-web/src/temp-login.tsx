import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  useTheme,
  CircularProgress,
} from '@mui/material';
import loginLogo from '../assets/login-logo.png';
import TwoFactorVerification from '../components/auth/TwoFactorVerification';

interface LoginFormData {
  username: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

const initialFormData: LoginFormData = {
  username: '',
  password: '',
};

// Token management functions
const setAuthToken = (token: string, role: string) => {
  try {
    const tokenExpiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', tokenExpiry.toString());
    localStorage.setItem('userRole', role);
    // Verify token was set
    const storedToken = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('tokenExpiry');
    if (!storedToken || !storedExpiry) {
      throw new Error('Failed to set authentication token');
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
    clearAuthToken();
    throw new Error('Failed to set authentication token');
  }
};

const clearAuthToken = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('userRole');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  
  // Two-factor authentication state
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (token && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry);
      if (expiryTime > Date.now()) {
        const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        clearAuthToken();
      }
    }
  }, [navigate, location]);

  // Handle successful two-factor authentication
  const handleTwoFactorSuccess = (data: any) => {
    try {
      if (data.token && data.user?.role) {
        // Set auth token with proper role from the API response
        setAuthToken(data.token, data.user.role);
        
        // Verify token was set before redirecting
        const token = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        if (!token || !tokenExpiry) {
          throw new Error('Authentication failed');
        }

        // Redirect to the page they tried to visit or dashboard
        const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login. Please try again.');
      clearAuthToken();
      setShowTwoFactor(false);
    }
  };

  // Go back to the login form from 2FA screen
  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setUserEmail('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.username || !formData.password) {
        throw new Error('Please enter both username and password');
      }

      // Call the authentication API
      try {
        const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.username,
            password: formData.password
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid credentials');
        }
        
        const data = await response.json();
        
        if (data.token && data.data?.user?.role) {
          // Check if user has 2FA enabled
          if (data.data.user.twoFactorEnabled) {
            // Store user email for 2FA verification
            setUserEmail(formData.username);
            // Show 2FA verification screen
            setShowTwoFactor(true);
            setLoading(false);
            return;
          }
          
          // No 2FA required, proceed with normal login
          // Set auth token with proper role from the API response
          setAuthToken(data.token, data.data.user.role);
          
          // Verify token was set before redirecting
          const token = localStorage.getItem('token');
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          
          if (!token || !tokenExpiry) {
            throw new Error('Authentication failed');
          }

          // Redirect to the page they tried to visit or dashboard
          const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to authenticate. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login. Please try again.');
      clearAuthToken();
    } finally {
      if (!showTwoFactor) {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: 3
      }}
    >
      <Container maxWidth="sm">
        {!showTwoFactor ? (
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={loginLogo}
                alt="Clinic logo"
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3} align="center">
                Please sign in to your account to continue
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Email Address"
                  name="username"
                  autoComplete="email"
                  autoFocus
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mt: 1,
                    mb: 3,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                    borderRadius: 1.5
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>
                <Typography variant="body2" align="center" color="text.secondary">
                  For demo purposes, use email: admin@example.com and password: password123
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <TwoFactorVerification
            email={userEmail}
            onSuccess={handleTwoFactorSuccess}
            onBack={handleBackToLogin}
          />
        )}
      </Container>
    </Box>
  );
}
