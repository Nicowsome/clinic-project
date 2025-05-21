import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Queue as QueueIcon,
  Settings as SettingsIcon,
  LocalHospital as LogoIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,

  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  SupervisorAccount as SupervisorAccountIcon,
  BarChart as BarChartIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import NotificationCenter from './NotificationCenter';
import mainLogo from '../assets/main-logo.png';
import useAuth from '../hooks/useAuth';

const drawerWidth = 280;

interface MainLayoutProps {
  children: ReactNode;
}

// Define all possible menu items
const allMenuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
  {
    text: 'Doctors',
    icon: <LogoIcon />,
    path: '/doctors',
    roles: ['admin', 'nurse'], // Doctors cannot access
  },
  {
    text: 'Patients',
    icon: <PeopleIcon />,
    path: '/patients',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
  {
    text: 'Appointments',
    icon: <EventNoteIcon />,
    path: '/appointments',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
  {
    text: 'Medical Records',
    icon: <MedicalServicesIcon />,
    path: '/medical-records',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
  {
    text: 'Prescriptions',
    icon: <ReceiptIcon />,
    path: '/prescriptions',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
  {
    text: 'Billing & Payments',
    icon: <AttachMoneyIcon />,
    path: '/billing',
    roles: ['admin', 'nurse'], // Only admin and nurse can access
  },
  {
    text: 'Inventory',
    icon: <InventoryIcon />,
    path: '/inventory',
    roles: ['admin', 'nurse'], // Only admin and nurse can access
  },
  {
    text: 'Staff Management',
    icon: <SupervisorAccountIcon />,
    path: '/staff',
    roles: ['admin'], // Only admin can access
  },
  {
    text: 'Reports & Analytics',
    icon: <BarChartIcon />,
    path: '/reports',
    roles: ['admin'], // Only admin can access
  },
  {
    text: 'Queue Management',
    icon: <QueueIcon />,
    path: '/queue',
    roles: ['admin', 'nurse'], // Doctors cannot access
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['admin', 'doctor', 'nurse'], // All roles can access
  },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'doctor'; // Default to doctor if not set
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 0,
          minHeight: '200px',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(2px)',
            zIndex: 1,
          }
        }}
      >
        <Box
          component="img"
          src={mainLogo}
          alt="Clinic Logo"
          sx={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            filter: 'brightness(1.1) contrast(1.1)',
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
            zIndex: 2,
            '&:hover': {
              filter: 'brightness(1.2) contrast(1.2)',
              transform: 'scale(1.02)',
            }
          }}
        />
      </Box>
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}15`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}25`,
                  },
                },
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}10`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              flexGrow: 1,
            }}
          >
            Clinic Management System
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mr: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
            pr: 2,
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                {currentDateTime.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {currentDateTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Box>
          </Box>
          {/* Notification Center */}
          <Box sx={{ mx: 1 }}>
            <NotificationCenter />
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ ml: 0 }}
            aria-controls="account-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              A
            </Avatar>
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: 2,
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 