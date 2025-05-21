import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  keyframes,
  useTheme,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useClinicStore } from '../store/clinicStore';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

interface SettingsFormData {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    appointmentReminders: boolean;
    queueUpdates: boolean;
  };
  security: {
    sessionTimeout: number;
  };
}

const initialFormData: SettingsFormData = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    sms: false,
    appointmentReminders: true,
    queueUpdates: true,
  },
  security: {
    sessionTimeout: 30,
  },
};

export default function Settings() {
  const [formData, setFormData] = useState<SettingsFormData>(initialFormData);
  const theme = useTheme();
  const { logout } = useClinicStore();

  const handleThemeChange = (event: any) => {
    setFormData({ ...formData, theme: event.target.value });
  };

  const handleLanguageChange = (event: any) => {
    setFormData({ ...formData, language: event.target.value });
  };

  const handleNotificationChange = (key: keyof SettingsFormData['notifications']) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
      },
    });
  };

  const handleSecurityChange = (key: keyof SettingsFormData['security'], value: any) => {
    setFormData({
      ...formData,
      security: {
        ...formData.security,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('settings', JSON.stringify(formData));
    // Apply theme if changed
    if (formData.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        animation: `${slideIn} 0.5s ease-out`,
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PaletteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Appearance</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={formData.theme}
                label="Theme"
                onChange={handleThemeChange}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={formData.language}
                label="Language"
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out 0.2s`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                    />
                  }
                  label="SMS Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.appointmentReminders}
                      onChange={() => handleNotificationChange('appointmentReminders')}
                    />
                  }
                  label="Appointment Reminders"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.queueUpdates}
                      onChange={() => handleNotificationChange('queueUpdates')}
                    />
                  }
                  label="Queue Updates"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out 0.4s`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel>Session Timeout (minutes)</InputLabel>
                  <Select
                    value={formData.security.sessionTimeout}
                    label="Session Timeout (minutes)"
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
