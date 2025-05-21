import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  Queue as QueueIcon,
  Event as EventIcon,
  LocalHospital as DoctorIcon,
} from '@mui/icons-material';
import { useClinicStore, Doctor, Appointment } from '../store/clinicStore';

const styles = {
  fadeIn: {
    animation: 'fadeIn 0.5s ease-out',
  },
  slideIn: {
    animation: 'slideIn 0.5s ease-out',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translateX(-20px)',
      opacity: 0,
    },
    to: {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
};

export default function Dashboard() {
  const { patients, appointments, doctors, queueItems } = useClinicStore();
  const theme = useTheme();

  // Calculate total queue items for today
  const today = new Date().toISOString().split('T')[0];
  const totalQueueToday = queueItems.filter(item => 
    new Date(item.timestamp).toISOString().split('T')[0] === today
  ).length;

  return (
    <Box sx={{ 
      animation: `${styles.fadeIn}`,
      height: '100%',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      p: 3,
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        animation: `${styles.fadeIn}`,
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
            animation: `${styles.slideIn}`,
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
              animation: `${styles.fadeIn}`,
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
              animation: `${styles.fadeIn} 0.5s ease-out 0.1s`,
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
              animation: `${styles.fadeIn} 0.5s ease-out 0.3s`,
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
            animation: `${styles.fadeIn} 0.5s ease-out 0.4s`,
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
                  .filter((appointment: Appointment) => 
                    new Date(appointment.date).toISOString().split('T')[0] === today
                  )
                  .slice(0, 5)
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
                        primary={appointment.patientName}
                        secondary={`${appointment.time} - ${appointment.type}`}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                        secondaryTypographyProps={{
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Chip 
                        label={appointment.status} 
                        color={appointment.status === 'Scheduled' ? 'success' : 'warning'}
                        size="small"
                        sx={{ ml: 1 }}
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
            animation: `${styles.fadeIn} 0.5s ease-out 0.5s`,
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
              Available Doctors
            </Typography>
            <List>
              {doctors.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No doctors available
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