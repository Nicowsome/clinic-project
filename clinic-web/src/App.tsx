import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, CircularProgress, Box, Typography, Button } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { Suspense, lazy } from 'react'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Doctors = lazy(() => import('./pages/Doctors'))
const Patients = lazy(() => import('./pages/Patients'))
const Appointments = lazy(() => import('./pages/Appointments'))
const QueueManagement = lazy(() => import('./pages/QueueManagement'))
const QueueDisplay = lazy(() => import('./pages/QueueDisplay'))
const Settings = lazy(() => import('./pages/Settings'))
const PatientRecords = lazy(() => import('./pages/PatientRecords'))

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
)

// Route wrapper component
const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary key={location.pathname}>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
      light: '#4285f4',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1a73e8',
    },
    h6: {
      fontWeight: 600,
      color: '#1a73e8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(26, 115, 232, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0d47a1 30%, #1a73e8 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(26, 115, 232, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(26, 115, 232, 0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
})

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <Dashboard />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <Doctors />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <Patients />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <Appointments />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/queue"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <QueueManagement />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/queue-display"
              element={
                <ProtectedRoute>
                  <RouteWrapper>
                    <QueueDisplay />
                  </RouteWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-records/:patientId"
              element={
                <ProtectedRoute>
                  <RouteWrapper>
                    <PatientRecords />
                  </RouteWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <RouteWrapper>
                      <Settings />
                    </RouteWrapper>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '60vh',
                      textAlign: 'center',
                      p: 3,
                    }}
                  >
                    <Typography variant="h1" color="primary" gutterBottom>
                      404
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      Page Not Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      The page you are looking for does not exist or has been moved.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => window.history.back()}
                      sx={{ mt: 2 }}
                    >
                      Go Back
                    </Button>
                  </Box>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 