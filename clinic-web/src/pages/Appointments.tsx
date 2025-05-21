import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  keyframes,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useClinicStore } from '../store/clinicStore';
import ConfirmationDialog from '../components/ConfirmationDialog';

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

interface AppointmentFormData {
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'Check-up' | 'Consultation' | 'Follow-up' | 'Emergency';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  doctor: string;
  notes: string;
}

const initialFormData: AppointmentFormData = {
  patientId: '',
  patientName: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  type: 'Check-up',
  status: 'Scheduled',
  doctor: 'Dr. Wilson',
  notes: '',
};

const Appointments: React.FC = () => {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment } = useClinicStore();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  const [formData, setFormData] = useState<Partial<typeof appointments[0]>>({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    type: 'Check-up',
    status: 'Scheduled',
    doctor: '',
    notes: '',
  });
  const theme = useTheme();

  const handleOpen = (appointment?: typeof appointments[0]) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData(appointment);
    } else {
      setSelectedAppointment(null);
      setFormData({
        patientId: '',
        patientName: '',
        date: '',
        time: '',
        type: 'Check-up',
        status: 'Scheduled',
        doctor: '',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setFormData({
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      type: 'Check-up',
      status: 'Scheduled',
      doctor: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, formData);
      } else {
        await addAppointment(formData as Omit<typeof appointments[0], 'id'>);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDeleteClick = (appointment: typeof appointments[0]) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAppointment) {
      try {
        await deleteAppointment(selectedAppointment.id, () => {
          setDeleteDialogOpen(false);
          setSelectedAppointment(null);
        });
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
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
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
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
          Add Appointment
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          animation: `${fadeIn} 0.5s ease-out`,
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Notes</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow 
                key={appointment.id}
                sx={{
                  animation: `${fadeIn} 0.5s ease-out ${index * 0.1}s`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{appointment.doctor}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{appointment.notes}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleOpen(appointment)} 
                    color="primary"
                    sx={{
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(appointment)} 
                    color="error"
                    sx={{
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            animation: `${fadeIn} 0.3s ease-out`,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Patient"
                  value={formData.patientId}
                  onChange={(e) => {
                    const patient = patients.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: patient ? `${patient.lastName}, ${patient.firstName} ${patient.middleName}`.trim() : '',
                    });
                  }}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {`${patient.lastName}, ${patient.firstName} ${patient.middleName}`.trim()}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentFormData['type'] })}
                >
                  {['Check-up', 'Consultation', 'Follow-up', 'Emergency'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentFormData['status'] })}
                >
                  {['Scheduled', 'Completed', 'Cancelled'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                >
                  {['Dr. Wilson', 'Dr. Martinez', 'Dr. Brown'].map((doctor) => (
                    <MenuItem key={doctor} value={doctor}>
                      {doctor}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            {selectedAppointment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Appointment"
        message={`Are you sure you want to delete the appointment for ${selectedAppointment?.patientName} on ${selectedAppointment?.date}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedAppointment(null);
        }}
        severity="error"
      />
    </Box>
  );
};

export default Appointments; 