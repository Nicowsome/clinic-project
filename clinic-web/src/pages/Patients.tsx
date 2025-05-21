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
  keyframes,
  useTheme,
  Alert,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { useClinicStore } from '../store/clinicStore';
import ExportButton from '../components/ExportButton';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

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

interface PatientFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
}

const initialFormData: PatientFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  age: 0,
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  lastVisit: new Date().toISOString().split('T')[0],
};

export default function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient, deletePatient, medicalRecords } = useClinicStore();
  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [duplicateError, setDuplicateError] = useState(false);
  const theme = useTheme();
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = (patientId?: string) => {
    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setFormData({
          firstName: patient.firstName,
          middleName: patient.middleName,
          lastName: patient.lastName,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          lastVisit: patient.lastVisit,
        });
        setEditingPatient(patientId);
      }
    } else {
      setFormData(initialFormData);
      setEditingPatient(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPatient(null);
    setFormData(initialFormData);
  };

  const isDuplicatePatient = (patient: PatientFormData): boolean => {
    return patients.some(p => 
      p.firstName.toLowerCase() === patient.firstName.toLowerCase() &&
      p.middleName.toLowerCase() === patient.middleName.toLowerCase() &&
      p.lastName.toLowerCase() === patient.lastName.toLowerCase() &&
      (!editingPatient || p.id !== editingPatient)
    );
  };

  const handleSubmit = () => {
    if (isDuplicatePatient(formData)) {
      setDuplicateError(true);
      return;
    }
    setDuplicateError(false);
    if (editingPatient) {
      updatePatient(editingPatient, formData);
    } else {
      addPatient(formData);
    }
    handleClose();
  };

  const formatPatientName = (patient: typeof patients[0]) => {
    return `${patient.lastName}, ${patient.firstName} ${patient.middleName}`.trim();
  };

  const handleDeleteClick = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  const handleViewRecords = (patientId: string) => {
    navigate(`/patient-records/${patientId}`);
  };

  const handleCloseRecords = () => {
    setRecordsOpen(false);
    setSelectedPatientId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPatient) {
      try {
        await deletePatient(selectedPatient.id, () => {
          setDeleteDialogOpen(false);
          setSelectedPatient(null);
        });
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
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
          Patients
        </Typography>
        <Stack direction="row" spacing={2}>
          <ExportButton
            data={patients}
            type="patients"
            buttonVariant="outlined"
            buttonText="Export Patients"
            disabled={patients.length === 0}
          />
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
            Add Patient
          </Button>
        </Stack>
      </Box>
      
      {/* Search Bar */}
      <Box sx={{ mb: 3, animation: `${fadeIn} 0.5s ease-out 0.2s` }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            },
          }}
        />
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
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Last Visit</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients
              .filter(patient => {
                const searchTermLower = searchQuery.toLowerCase();
                const fullName = `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
                const reverseName = `${patient.lastName}, ${patient.firstName} ${patient.middleName}`.toLowerCase();
                return (
                  fullName.includes(searchTermLower) ||
                  reverseName.includes(searchTermLower) ||
                  patient.phone.toLowerCase().includes(searchTermLower) ||
                  patient.email.toLowerCase().includes(searchTermLower) ||
                  patient.address.toLowerCase().includes(searchTermLower)
                );
              })
              .map((patient, index) => (
              <TableRow 
                key={patient.id}
                sx={{
                  animation: `${fadeIn} 0.5s ease-out ${index * 0.1}s`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <TableCell>{formatPatientName(patient)}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleOpen(patient.id)} 
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
                    onClick={() => handleDeleteClick(patient)} 
                    color="error"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button 
                    onClick={() => handleViewRecords(patient.id)} 
                    size="small"
                    startIcon={<EventNoteIcon />}
                  >
                    Records
                  </Button>
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
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          {duplicateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              A patient with this name already exists in the system.
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  setDuplicateError(false);
                }}
                required
                error={duplicateError}
                helperText={duplicateError ? "This name combination already exists" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Middle Name"
                value={formData.middleName}
                onChange={(e) => {
                  setFormData({ ...formData, middleName: e.target.value });
                  setDuplicateError(false);
                }}
                error={duplicateError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                  setDuplicateError(false);
                }}
                required
                error={duplicateError}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Patient"
        message={`Are you sure you want to delete ${selectedPatient?.firstName} ${selectedPatient?.lastName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedPatient(null);
        }}
        severity="error"
      />

      <Dialog open={recordsOpen} onClose={handleCloseRecords} maxWidth="md" fullWidth>
        <DialogTitle>Medical Records</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Treatment</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.filter(r => r.patientId === selectedPatientId).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No records found.</TableCell>
                  </TableRow>
                ) : (
                  medicalRecords.filter(r => r.patientId === selectedPatientId).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>{record.treatment}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecords}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 