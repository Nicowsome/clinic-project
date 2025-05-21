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
  Button,
  IconButton,
  Chip,
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
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useClinicStore } from '../store/clinicStore';
import ConfirmationDialog from '../components/ConfirmationDialog';

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

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  email: string;
  phone: string;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
  };
}

const specialties = [
  'General Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'Dentistry',
];

const initialDoctor: Doctor = {
  id: '',
  firstName: '',
  lastName: '',
  specialty: '',
  email: '',
  phone: '',
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
  },
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      specialty: 'General Medicine',
      email: 'john.smith@clinic.com',
      phone: '+1 234-567-8901',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
      },
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialty: 'Pediatrics',
      email: 'sarah.johnson@clinic.com',
      phone: '+1 234-567-8902',
      availability: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: true,
      },
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(initialDoctor);
  const [isEditing, setIsEditing] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const theme = useTheme();

  const isDuplicateDoctor = (doctor: Doctor): boolean => {
    return doctors.some(d => 
      d.email.toLowerCase() === doctor.email.toLowerCase() && 
      (!isEditing || d.id !== doctor.id)
    );
  };

  const handleOpenDialog = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsEditing(true);
    } else {
      setSelectedDoctor(initialDoctor);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(initialDoctor);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (isDuplicateDoctor(selectedDoctor)) {
      setDuplicateError(true);
      return;
    }
    setDuplicateError(false);
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    if (isEditing) {
      setDoctors(doctors.map(doc => 
        doc.id === selectedDoctor.id ? selectedDoctor : doc
      ));
    } else {
      setDoctors([...doctors, { ...selectedDoctor, id: Date.now().toString() }]);
    }
    setSaveDialogOpen(false);
    handleCloseDialog();
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(doc => doc.id !== selectedDoctor.id));
      setDeleteDialogOpen(false);
      setSelectedDoctor(initialDoctor);
    }
  };

  const handleAvailabilityChange = (day: keyof Doctor['availability']) => {
    setSelectedDoctor({
      ...selectedDoctor,
      availability: {
        ...selectedDoctor.availability,
        [day]: !selectedDoctor.availability[day],
      },
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
          Doctors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
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
          Add Doctor
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
              <TableCell>Name</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>Dr. {doctor.firstName} {doctor.lastName}</TableCell>
                <TableCell>
                  <Chip 
                    label={doctor.specialty}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{doctor.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {Object.entries(doctor.availability).map(([day, available]) => (
                      <Chip
                        key={day}
                        label={day.slice(0, 3)}
                        size="small"
                        color={available ? 'success' : 'default'}
                        variant={available ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenDialog(doctor)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(doctor)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          {duplicateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              A doctor with this email address already exists.
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={selectedDoctor.firstName}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={selectedDoctor.lastName}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Specialty"
                value={selectedDoctor.specialty}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, specialty: e.target.value })}
                required
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedDoctor.email}
                onChange={(e) => {
                  setSelectedDoctor({ ...selectedDoctor, email: e.target.value });
                  setDuplicateError(false);
                }}
                required
                error={duplicateError}
                helperText={duplicateError ? "This email is already registered" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={selectedDoctor.phone}
                onChange={(e) => setSelectedDoctor({ ...selectedDoctor, phone: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Availability
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.entries(selectedDoctor.availability).map(([day, available]) => (
                  <Chip
                    key={day}
                    label={day.slice(0, 3)}
                    onClick={() => handleAvailabilityChange(day as keyof Doctor['availability'])}
                    color={available ? 'success' : 'default'}
                    variant={available ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveClick} variant="contained">
            {isEditing ? 'Save Changes' : 'Add Doctor'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedDoctor(initialDoctor);
        }}
        severity="error"
      />

      <ConfirmationDialog
        open={saveDialogOpen}
        title={isEditing ? "Save Changes" : "Add New Doctor"}
        message={
          isEditing
            ? `Are you sure you want to save the changes for Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}?`
            : `Are you sure you want to add Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName} to the system?`
        }
        onConfirm={handleSaveConfirm}
        onCancel={() => {
          setSaveDialogOpen(false);
        }}
        severity="info"
      />
    </Box>
  );
} 