import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

const Prescriptions = () => {
  const { addNotification } = useNotifications();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  useEffect(() => {
    const mockPrescriptions = [
      { id: 1, patientName: 'John Doe', medication: 'Amoxicillin 500mg', dosage: '1 tablet TID', issueDate: '2025-05-01', expiryDate: '2025-06-01', status: 'Active' },
      { id: 2, patientName: 'Jane Smith', medication: 'Atorvastatin 20mg', dosage: '1 tablet daily', issueDate: '2025-05-03', expiryDate: '2025-08-03', status: 'Active' },
      { id: 3, patientName: 'Robert Johnson', medication: 'Prednisone 10mg', dosage: '1 tablet BID', issueDate: '2025-04-15', expiryDate: '2025-05-15', status: 'Expired' },
      { id: 4, patientName: 'Emily Davis', medication: 'Lisinopril 5mg', dosage: '1 tablet daily', issueDate: '2025-05-10', expiryDate: '2025-11-10', status: 'Active' },
      { id: 5, patientName: 'Michael Wilson', medication: 'Metformin 850mg', dosage: '1 tablet BID', issueDate: '2025-04-30', expiryDate: '2025-07-30', status: 'Active' },
    ];
    setPrescriptions(mockPrescriptions);
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addNotification({
        type: 'success',
        title: 'Prescriptions Refreshed',
        message: 'Prescription list has been refreshed successfully',
      });
    }, 800);
  };

  const handleCreatePrescription = (_event: React.FormEvent) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Prescription creation will be available in the next update',
    });
  };

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setViewDialogOpen(true);
  };

  const handleEditPrescription = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `Editing prescription #${id} will be available in the next update`,
    });
  };

  const handlePrintPrescription = (id: number) => {
    addNotification({
      type: 'success',
      title: 'Prescription Printed',
      message: `Prescription #${id} has been sent to printer`,
    });
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prescriptions
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={handleCreatePrescription}
          >
            New Prescription
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by patient name or medication"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Rx ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Medication</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPrescriptions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>#{prescription.id}</TableCell>
                  <TableCell>{prescription.patientName}</TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.issueDate}</TableCell>
                  <TableCell>{prescription.expiryDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={prescription.status} 
                      color={prescription.status === 'Active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewPrescription(prescription)} size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleEditPrescription(prescription.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handlePrintPrescription(prescription.id)} size="small">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPrescriptions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Prescription View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent dividers>
          {selectedPrescription && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Patient: {selectedPrescription.patientName}</Typography>
              <Typography variant="body1" gutterBottom>Medication: {selectedPrescription.medication}</Typography>
              <Typography variant="body1" gutterBottom>Dosage: {selectedPrescription.dosage}</Typography>
              <Typography variant="body1" gutterBottom>Issue Date: {selectedPrescription.issueDate}</Typography>
              <Typography variant="body1" gutterBottom>Expiry Date: {selectedPrescription.expiryDate}</Typography>
              <Typography variant="body1" gutterBottom>
                Status: 
                <Chip 
                  label={selectedPrescription.status} 
                  color={selectedPrescription.status === 'Active' ? 'success' : 'error'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Instructions: Take as directed. Finish the entire course of medication even if symptoms improve. 
                Do not share this medication with others. Store at room temperature away from moisture.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedPrescription && (
            <Button 
              variant="contained" 
              startIcon={<PrintIcon />}
              onClick={() => {
                handlePrintPrescription(selectedPrescription.id);
                setViewDialogOpen(false);
              }}
            >
              Print
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Prescriptions;
