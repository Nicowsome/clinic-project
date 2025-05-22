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
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

const MedicalRecords = () => {
  // theme removed
  const { addNotification } = useNotifications();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data for demonstration
  useEffect(() => {
    const mockRecords = [
      { id: 1, patientName: 'John Doe', recordType: 'Lab Results', date: '2025-05-01', status: 'Complete' },
      { id: 2, patientName: 'Jane Smith', recordType: 'Consultation', date: '2025-05-05', status: 'Pending Review' },
      { id: 3, patientName: 'Robert Johnson', recordType: 'X-Ray', date: '2025-05-10', status: 'Complete' },
      { id: 4, patientName: 'Emily Davis', recordType: 'Prescription', date: '2025-05-12', status: 'Active' },
      { id: 5, patientName: 'Michael Wilson', recordType: 'Surgery', date: '2025-05-15', status: 'Scheduled' },
    ];
    setRecords(mockRecords);
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
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addNotification({
        type: 'success',
        title: 'Records Refreshed',
        message: 'Medical records have been refreshed successfully',
      });
    }, 800);
  };

  const handleCreateRecord = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Medical Record creation will be available in the next update',
    });
  };

  const handleViewRecord = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Record Selected',
      message: `Viewing medical record #${id}`,
    });
  };

  const handleEditRecord = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `Editing medical record #${id} will be available in the next update`,
    });
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={handleCreateRecord}
          >
            New Record
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
          placeholder="Search by patient name or record type"
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
              <TableCell>Record ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Record Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => (
                <TableRow key={record.id}>
                  <TableCell>#{record.id}</TableCell>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.recordType}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status} 
                      color={
                        record.status === 'Complete' ? 'success' :
                        record.status === 'Pending Review' ? 'warning' :
                        record.status === 'Scheduled' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewRecord(record.id)} size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleEditRecord(record.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRecords.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default MedicalRecords;
