import { useState } from 'react';
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
  useTheme,
  keyframes,
  Divider,
  InputLabel,
  FormControl,
  Select,
  SelectChangeEvent,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  CheckCircle as CompleteIcon,
  Replay as RevertIcon,
} from '@mui/icons-material';
import { useClinicStore, QueueItem, Gender } from '../store/clinicStore';

interface PatientFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  age: number;
  lastVisit: string;
}

interface QueueFormData {
  patientId: string;
  patientName: string;
  type: 'Check-up' | 'Consultation' | 'Follow-up' | 'Emergency';
  doctor: string;
}

const initialFormData: QueueFormData = {
  patientId: '',
  patientName: '',
  type: 'Check-up',
  doctor: 'Dr. Wilson',
};

const initialNewPatientData: PatientFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'Male' as Gender,
  phone: '',
  email: '',
  address: '',
  age: 0,
  lastVisit: '',
};

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

export default function QueueManagement() {
  const { queueItems, patients, addToQueue, updateQueueItem, removeFromQueue, addPatient } = useClinicStore();
  const [open, setOpen] = useState(false);
  const [openNewPatient, setOpenNewPatient] = useState(false);
  const [editingQueueItem, setEditingQueueItem] = useState<string | null>(null);
  const [formData, setFormData] = useState<QueueFormData>(initialFormData);
  const [newPatientData, setNewPatientData] = useState<PatientFormData>(initialNewPatientData);
  const theme = useTheme();

  const handleOpen = (queueItemId?: string) => {
    if (queueItemId) {
      const queueItem = queueItems.find((q: QueueItem) => q.id === queueItemId);
      if (queueItem) {
        setFormData({
          patientId: queueItem.patientId,
          patientName: queueItem.patientName,
          type: queueItem.type,
          doctor: queueItem.doctor,
        });
        setEditingQueueItem(queueItemId);
      }
    } else {
      setFormData(initialFormData);
      setEditingQueueItem(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingQueueItem(null);
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    if (editingQueueItem) {
      updateQueueItem(editingQueueItem, {
        ...formData,
        timestamp: new Date().toISOString(),
      });
    } else {
      addToQueue({
        ...formData,
        status: 'Waiting',
        timestamp: new Date().toISOString(),
      });
    }
    handleClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const openQueueWindow = () => {
    window.open(
      '/queue-display',
      'Queue Display',
      'width=800,height=600,left=200,top=200'
    );
  };

  const handleNewPatientOpen = () => {
    setOpenNewPatient(true);
  };

  const handleNewPatientClose = () => {
    setOpenNewPatient(false);
    setNewPatientData(initialNewPatientData);
  };

  const handleNewPatientChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<Gender>
  ) => {
    const { name, value } = event.target;
    setNewPatientData(prev => ({
      ...prev,
      [name]: name === 'gender' ? value as Gender : value,
    }));
  };

  const handleNewPatientSave = () => {
    const patientData = {
      ...newPatientData,
      age: calculateAge(new Date(newPatientData.dateOfBirth)),
      lastVisit: new Date().toISOString(),
    };
    addPatient(patientData);
    handleNewPatientClose();
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleStartConsultation = (queueItemId: string) => {
    const queueItem = queueItems.find((q: QueueItem) => q.id === queueItemId);
    if (!queueItem) return;

    // Update current item to "In Progress"
    updateQueueItem(queueItemId, {
      ...queueItem,
      status: 'In Progress',
    });

    // Update any other "In Progress" items to "Waiting"
    queueItems.forEach((item: QueueItem) => {
      if (item.id !== queueItemId && item.status === 'In Progress') {
        updateQueueItem(item.id, {
          ...item,
          status: 'Waiting',
        });
      }
    });
  };

  const handleCompleteConsultation = (queueItemId: string) => {
    const queueItem = queueItems.find((q: QueueItem) => q.id === queueItemId);
    if (!queueItem) return;

    // Update current item to "Completed"
    updateQueueItem(queueItemId, {
      ...queueItem,
      status: 'Completed',
    });
    // Do NOT automatically start the next waiting item
  };

  const handleRevertToWaiting = (queueItemId: string) => {
    const queueItem = queueItems.find((q: QueueItem) => q.id === queueItemId);
    if (!queueItem) return;

    // Only update the current item back to "Waiting"
    updateQueueItem(queueItemId, {
      ...queueItem,
      status: 'Waiting',
    });
  };

  // Add this function to reset all 'In Progress' to 'Waiting'
  const handleResetAllToWaiting = () => {
    queueItems.forEach((item: QueueItem) => {
      if (item.status === 'In Progress') {
        updateQueueItem(item.id, { ...item, status: 'Waiting' });
      }
    });
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
          Queue Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            onClick={openQueueWindow}
            sx={{ 
              mr: 2, 
              borderRadius: 2,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            Open Queue Display
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleResetAllToWaiting}
            sx={{
              mr: 2,
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
            Reset All to Waiting
          </Button>
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
            Add to Queue
          </Button>
        </Box>
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
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Queue #</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Doctor</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Time</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queueItems.map((item: QueueItem) => (
              <TableRow 
                key={item.id}
                sx={{
                  animation: `${fadeIn} 0.5s ease-out ${item.queueNumber * 0.1}s`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  backgroundColor: item.status === 'In Progress' ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                }}
              >
                <TableCell>
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {item.queueNumber}
                  </Typography>
                </TableCell>
                <TableCell>{item.patientName}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.doctor}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
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
                <TableCell>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell align="right">
                  {item.status === 'Waiting' && (
                    <IconButton 
                      onClick={() => handleStartConsultation(item.id)} 
                      size="small"
                      color="primary"
                      title="Start Consultation"
                    >
                      <StartIcon />
                    </IconButton>
                  )}
                  {item.status === 'In Progress' && (
                    <>
                      <IconButton 
                        onClick={() => handleRevertToWaiting(item.id)} 
                        size="small"
                        color="warning"
                        title="Back to Waiting"
                        sx={{ mr: 1 }}
                      >
                        <RevertIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleCompleteConsultation(item.id)} 
                        size="small"
                        color="success"
                        title="Complete Consultation"
                      >
                        <CompleteIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton onClick={() => handleOpen(item.id)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => removeFromQueue(item.id, () => {})} size="small">
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
          {editingQueueItem ? 'Edit Queue Item' : 'Add to Queue'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                required
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {`${patient.lastName}, ${patient.firstName} ${patient.middleName}`.trim()}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="new" onClick={handleNewPatientOpen} sx={{ color: 'primary.main', fontWeight: 600 }}>
                  + Add New Patient
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as QueueFormData['type'] })}
                required
              >
                {['Check-up', 'Consultation', 'Follow-up', 'Emergency'].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
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
                required
              >
                {['Dr. Wilson', 'Dr. Martinez', 'Dr. Brown'].map((doctor) => (
                  <MenuItem key={doctor} value={doctor}>
                    {doctor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingQueueItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Patient Dialog */}
      <Dialog 
        open={openNewPatient} 
        onClose={handleNewPatientClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Please fill in the new patient's information.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={newPatientData.firstName}
                onChange={handleNewPatientChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Middle Name"
                name="middleName"
                value={newPatientData.middleName}
                onChange={handleNewPatientChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={newPatientData.lastName}
                onChange={handleNewPatientChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={newPatientData.dateOfBirth}
                onChange={handleNewPatientChange}
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={newPatientData.gender}
                  onChange={handleNewPatientChange}
                  label="Gender"
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newPatientData.phone}
                onChange={handleNewPatientChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newPatientData.email}
                onChange={handleNewPatientChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={newPatientData.address}
                onChange={handleNewPatientChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleNewPatientClose}>Cancel</Button>
          <Button 
            onClick={handleNewPatientSave} 
            variant="contained"
            disabled={!newPatientData.firstName || !newPatientData.lastName || !newPatientData.dateOfBirth || !newPatientData.gender || !newPatientData.phone}
          >
            Save Patient
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}