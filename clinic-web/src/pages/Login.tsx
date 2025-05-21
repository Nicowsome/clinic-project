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
const setAuthToken = (token: string) => {
  try {
    const tokenExpiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', tokenExpiry.toString());
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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any non-empty username/password
      if (formData.username && formData.password) {
        try {
          setAuthToken('demo-token-' + Date.now()); // Add timestamp to make token unique
          
          // Verify token was set before redirecting
          const token = localStorage.getItem('token');
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          
          if (!token || !tokenExpiry) {
            throw new Error('Authentication failed');
          }

          // Redirect to the page they tried to visit or dashboard
          const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } catch (error) {
          throw new Error('Failed to authenticate. Please try again.');
        }
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
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: '#ffffff',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            component="img"
            src={loginLogo}
            alt="Clinic Logo"
            sx={{
              width: '180px',
              height: 'auto',
              mb: 3,
              opacity: 1,
              mixBlendMode: 'normal',
              filter: 'brightness(0.95) contrast(1.1)',
            }}
          />
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            component="h2" 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              mb: 4,
            }}
          >
            Sign in to your account
          </Typography>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                width: '100%',
                borderRadius: 1,
              }}
            >
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={loading}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                position: 'relative',
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 