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
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useClinicStore, MedicalRecord, MedicalRecordStatus } from '../store/clinicStore';
import ConfirmationDialog from '../components/ConfirmationDialog';

type MedicalRecordFormData = Omit<MedicalRecord, 'id'>;

const initialFormData: MedicalRecordFormData = {
  patientId: '',
  patientName: '',
  date: '',
  diagnosis: '',
  treatment: '',
  notes: '',
  status: 'Active' as MedicalRecordStatus,
  doctor: '',
};

const MedicalRecords: React.FC = () => {
  const { medicalRecords, addMedicalRecord, updateMedicalRecord, deleteMedicalRecord, patients } = useClinicStore();
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [formData, setFormData] = useState<MedicalRecordFormData>(initialFormData);
  const theme = useTheme();

  const handleOpen = (record?: MedicalRecord) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        patientId: record.patientId,
        patientName: record.patientName,
        date: record.date,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        notes: record.notes,
        status: record.status,
        doctor: record.doctor,
      });
    } else {
      setSelectedRecord(null);
      setFormData(initialFormData);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (selectedRecord) {
        await updateMedicalRecord(selectedRecord.id, formData);
      } else {
        await addMedicalRecord(formData);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving medical record:', error);
    }
  };

  const handleDeleteClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRecord) {
      try {
        await deleteMedicalRecord(selectedRecord.id, () => {
          setDeleteDialogOpen(false);
          setSelectedRecord(null);
        });
      } catch (error) {
        console.error('Error deleting medical record:', error);
      }
    }
  };

  const getStatusColor = (status: MedicalRecordStatus) => {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Resolved':
        return 'success';
      case 'Follow-up':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medical Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Treatment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.patientName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.treatment}</TableCell>
                <TableCell>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(record)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(record)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Edit Medical Record' : 'Add Medical Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Patient"
                value={formData.patientId}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === e.target.value);
                  setFormData({
                    ...formData,
                    patientId: e.target.value,
                    patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
                  });
                }}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MedicalRecordStatus })}
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
                label="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Medical Record"
        message="Are you sure you want to delete this medical record? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedRecord(null);
        }}
        severity="error"
      />
    </Box>
  );
};

export default MedicalRecords; 