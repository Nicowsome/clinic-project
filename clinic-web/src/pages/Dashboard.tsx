import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  keyframes,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  LocalHospital as DoctorIcon,
  TrendingUp as TrendingUpIcon,
  Queue as QueueIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useClinicStore, Doctor, Appointment } from '../store/clinicStore';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export default function Dashboard() {
  const { patients, appointments, doctors, queueItems } = useClinicStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
    { 
      title: 'Total Patients', 
      value: patients.length, 
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      gradient: 'linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)'
    },
    { 
      title: 'Upcoming Appointments', 
      value: appointments.filter((a: Appointment) => new Date(a.date) > new Date()).length, 
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      gradient: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)'
    },
    { 
      title: 'Available Doctors', 
      value: doctors.filter((d: Doctor) => d.isAvailable).length, 
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      gradient: 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)'
    },
    { 
      title: 'Total Doctors', 
      value: doctors.length, 
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
    },
  ];

  // Calculate total queue items for today
  const today = new Date().toISOString().split('T')[0];
  const totalQueueToday = queueItems.filter(item => 
    new Date(item.timestamp).toISOString().split('T')[0] === today
  ).length;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      animation: `${fadeIn} 0.5s ease-out`,
      height: '100%',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      p: 3,
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        animation: `${fadeIn} 0.5s ease-out`,
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1a73e8, #4285f4)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${slideIn} 0.5s ease-out`,
          }}
        >
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-5px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Patients
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {patients.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out 0.1s`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-5px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QueueIcon sx={{ fontSize: 40, color: theme.palette.success.main, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Queue Today
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {totalQueueToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out 0.3s`,
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-5px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventNoteIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Appointments
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {appointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            animation: `${fadeIn} 0.5s ease-out 0.4s`,
            transition: 'all 0.3s ease-in-out',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 24px rgba(26, 115, 232, 0.1)',
            },
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Today's Appointments
            </Typography>
            <List>
              {appointments.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No appointments for today
                </Typography>
              ) : (
                appointments
                  .filter((appointment: Appointment) => {
                    const appointmentDate = new Date(appointment.date);
                    const today = new Date();
                    return appointmentDate.toDateString() === today.toDateString();
                  })
                  .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((appointment: Appointment) => (
                    <ListItem 
                      key={appointment.id} 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 115, 232, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <EventIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {appointment.patientName}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small"
                              color={
                                appointment.status === 'Completed' ? 'success' :
                                appointment.status === 'Cancelled' ? 'error' :
                                appointment.status === 'Scheduled' ? 'primary' : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              Time: {appointment.time}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Doctor: {appointment.doctor}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Notes: {appointment.notes}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            animation: `${fadeIn} 0.5s ease-out 0.5s`,
            transition: 'all 0.3s ease-in-out',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 24px rgba(26, 115, 232, 0.1)',
            },
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Available Doctors Today
            </Typography>
            <List>
              {doctors.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No doctors found
                </Typography>
              ) : (
                doctors
                  .filter((doctor: Doctor) => doctor.isAvailable)
                  .slice(0, 5)
                  .map((doctor: Doctor) => (
                    <ListItem 
                      key={doctor.id} 
                      sx={{ 
                        borderRadius: 2,
                        mb: 1,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 115, 232, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <DoctorIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={doctor.name}
                        secondary={doctor.specialization}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                        secondaryTypographyProps={{
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Chip 
                        label={doctor.isAvailable ? "Available" : "Busy"} 
                        color={doctor.isAvailable ? "success" : "error"}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </ListItem>
                  ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 