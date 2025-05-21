import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import loginLogo from '../assets/login-logo.png';

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

// No animations needed for the new design

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);

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
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#87CEEB', // Sky blue background
        py: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{
          width: '90%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          p: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}
        >
            <Box
              component="img"
              src={loginLogo}
              alt="Clinic logo"
              sx={{
                width: 320,
                height: 'auto',
                objectFit: 'contain',
                mb: 4,
                mt: 2
              }}
            />
            <Typography 
              component="h1" 
              variant="h5" 
              fontWeight={600} 
              gutterBottom
              sx={{ 
                color: '#333',
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              mb={4} 
              align="center"
            >
              Please sign in to your account
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  width: '100%',
                  borderRadius: 1
                }}
              >
                {error}
              </Alert>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                width: '100%'
              }}
            >
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#00a3a3'
                  }}
                >
                  <AccountCircleIcon fontSize="small" />
                </Box>
                <TextField
                  fullWidth
                  required
                  id="username"
                  placeholder="Email or username"
                  name="username"
                  autoComplete="email"
                  autoFocus
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Box sx={{ width: 24 }} />,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: '#f0f7f7'
                    }
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Username
                </Typography>
              </Box>
              
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#00a3a3'
                  }}
                >
                  <LockIcon fontSize="small" />
                </Box>
                <TextField
                  fullWidth
                  required
                  id="password"
                  placeholder="Your password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Box sx={{ width: 24 }} />,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: '#f0f7f7'
                    }
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Password
                </Typography>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
                  mb: 2,
                  backgroundColor: '#1976d2',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  },
                  borderRadius: 1
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
              </Button>
            </Box>
        </Box>
      </Box>
    </Box>
  );
}
