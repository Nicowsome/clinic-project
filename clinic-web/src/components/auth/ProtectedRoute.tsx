import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        const userRole = localStorage.getItem('userRole');
        
        if (!token || !tokenExpiry) {
          setIsAuthenticated(false);
          return;
        }
        
        // Check role-based authorization if roles are specified
        if (allowedRoles.length > 0 && userRole) {
          if (!allowedRoles.includes(userRole)) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        }

        // Check if token is expired
        const isExpired = new Date().getTime() > parseInt(tokenExpiry);
        if (isExpired) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return (
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
    );
  }

  // Handle unauthorized access - redirect to dashboard with a state message
  if (isAuthenticated && !isAuthorized) {
    return <Navigate to="/dashboard" state={{ unauthorized: true }} replace />;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}