import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  keyframes,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon,
  LocalHospital as HospitalIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useClinicStore, MedicalRecord, Patient } from '../store/clinicStore';

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

interface MedicalRecordFormData {
  patientId: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  status: 'Active' | 'Resolved' | 'Follow-up';
  doctor: string;
}

const initialFormData: MedicalRecordFormData = {
  patientId: '',
  diagnosis: '',
  treatment: '',
  notes: '',
  status: 'Active',
  doctor: 'Dr. Wilson',
};

export default function PatientMedicalRecords() {
  const { medicalRecords, patients, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord } = useClinicStore();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedicalRecordFormData>(initialFormData);
  const theme = useTheme();

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleOpen = (recordId?: string) => {
    if (recordId) {
      const record = medicalRecords.find(r => r.id === recordId);
      if (record) {
        setFormData({
          patientId: record.patientId,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          notes: record.notes,
          status: record.status,
          doctor: record.doctor,
        });
        setEditingRecord(recordId);
      }
    } else {
      setFormData({
        ...initialFormData,
        patientId: selectedPatient?.id || '',
      });
      setEditingRecord(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRecord(null);
    setFormData(initialFormData);
  };

  const handleSubmit = () => {
    if (editingRecord) {
      updateMedicalRecord(editingRecord, {
        ...formData,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        date: new Date().toISOString(),
      });
    } else {
      addMedicalRecord({
        ...formData,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        date: new Date().toISOString(),
      });
    }
    handleClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'Follow-up':
        return 'info';
      default:
        return 'default';
    }
  };

  const patientRecords = selectedPatient
    ? medicalRecords.filter(record => record.patientId === selectedPatient.id)
    : [];

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
          Patient Medical Records
        </Typography>
        {selectedPatient && (
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
            Add Medical Record
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Patient Selection */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: `${fadeIn} 0.5s ease-out`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Select Patient
            </Typography>
            <List>
              {patients.map((patient) => (
                <ListItem
                  key={patient.id}
                  button
                  selected={selectedPatient?.id === patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemText
                    primary={`${patient.firstName} ${patient.lastName}`}
                    secondary={`Age: ${patient.age} | ${patient.gender}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Medical Records */}
        <Grid item xs={12} md={8}>
          {selectedPatient ? (
            <Box>
              {/* Patient Info Card */}
              <Card 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  animation: `${fadeIn} 0.5s ease-out`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                    <Typography variant="h6">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Age: {selectedPatient.age}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Gender: {selectedPatient.gender}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blood Type: {selectedPatient.bloodType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {selectedPatient.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {selectedPatient.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Visit: {selectedPatient.lastVisit}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Medical Records List */}
              {patientRecords.map((record) => (
                <Card 
                  key={record.id}
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    animation: `${fadeIn} 0.5s ease-out`,
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {new Date(record.date).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" component="span">
                          Dr. {record.doctor}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleOpen(record.id)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteMedicalRecord(record.id, () => {})} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <HospitalIcon sx={{ mr: 1, color: theme.palette.error.main }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Diagnosis
                            </Typography>
                            <Typography variant="body1">
                              {record.diagnosis}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <DescriptionIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              Treatment
                            </Typography>
                            <Typography variant="body1">
                              {record.treatment}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      {record.notes && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TimelineIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Notes
                              </Typography>
                              <Typography variant="body1">
                                {record.notes}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                animation: `${fadeIn} 0.5s ease-out`,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a patient to view their medical records
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Medical Record Dialog */}
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
          {editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MedicalRecordFormData['status'] })}
                required
              >
                {['Active', 'Resolved', 'Follow-up'].map((status) => (
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
                required
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
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treatment"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 