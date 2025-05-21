import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Queue as QueueIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,

  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  SupervisorAccount as SupervisorAccountIcon,
  BarChart as BarChartIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClinicStore } from '../../store/clinicStore';
import mainLogo from '../../assets/main-logo.png';

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useClinicStore();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
    { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
    { text: 'Medical Records', icon: <MedicalServicesIcon />, path: '/medical-records' },
    { text: 'Prescriptions', icon: <ReceiptIcon />, path: '/prescriptions' },
    { text: 'Billing & Payments', icon: <AttachMoneyIcon />, path: '/billing' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Staff Management', icon: <SupervisorAccountIcon />, path: '/staff' },
    { text: 'Reports & Analytics', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Queue Management', icon: <QueueIcon />, path: '/queue' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="img"
        src={mainLogo}
        alt="Clinic Logo"
        sx={{
          width: '280px',
          height: 'auto',
          mb: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      />
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
              }}
            />
          </ListItem>
        ))}
      </List>
      {/* Removed duplicate logout button from sidebar */}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          width: { sm: 'calc(100% - 280px)' },
          ml: { sm: '280px' },
        }}
      >
        <Toolbar sx={{ position: 'relative' }}>
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
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: 'max-content',
            }}
          >
            Clinic Management System
          </Typography>
          <Box sx={{ position: 'absolute', right: 24, display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#ffffff',
                display: { xs: 'none', sm: 'block' },
                textAlign: 'right',
                minWidth: '200px',
                mr: 2,
              }}
            >
              {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ ml: 0 }}
              aria-controls="account-menu"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Box>
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
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              handleLogout();
            }}>
              <ListItemIcon>
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
              borderRight: 'none',
              boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)',
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
              borderRight: 'none',
              boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)',
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
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 