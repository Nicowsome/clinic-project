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
  useTheme,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  LocalAtm as LocalAtmIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

const Billing = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data for demonstration
  useEffect(() => {
    const mockInvoices = [
      { id: 'INV-1001', patientName: 'John Doe', date: '2025-05-01', amount: 150.00, status: 'Paid', paymentMethod: 'Credit Card' },
      { id: 'INV-1002', patientName: 'Jane Smith', date: '2025-05-03', amount: 275.50, status: 'Pending', paymentMethod: 'Pending' },
      { id: 'INV-1003', patientName: 'Robert Johnson', date: '2025-05-10', amount: 520.00, status: 'Paid', paymentMethod: 'Bank Transfer' },
      { id: 'INV-1004', patientName: 'Emily Davis', date: '2025-05-12', amount: 95.25, status: 'Overdue', paymentMethod: 'Pending' },
      { id: 'INV-1005', patientName: 'Michael Wilson', date: '2025-05-15', amount: 320.75, status: 'Paid', paymentMethod: 'Cash' },
    ];
    setInvoices(mockInvoices);
  }, []);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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
        title: 'Invoices Refreshed',
        message: 'Billing information has been refreshed successfully',
      });
    }, 800);
  };

  const handleCreateInvoice = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Invoice creation will be available in the next update',
    });
  };

  const handleViewInvoice = (id: string) => {
    addNotification({
      type: 'info',
      title: 'Invoice Selected',
      message: `Viewing invoice ${id}`,
    });
  };

  const handleProcessPayment = (id: string) => {
    addNotification({
      type: 'success',
      title: 'Payment Processing',
      message: `Payment processing initiated for invoice ${id}`,
    });
  };

  // Calculate summary data
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === 'Paid');
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'Pending');
  const overdueInvoices = invoices.filter(invoice => invoice.status === 'Overdue');
  const totalPaid = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Billing & Payments
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={handleCreateInvoice}
          >
            New Invoice
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

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                <PieChartIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
              </Box>
              <Typography variant="h4" component="div">${totalRevenue.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">{invoices.length} invoice(s)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Paid</Typography>
                <TrendingUpIcon sx={{ color: 'success.main', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>${totalPaid.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">{paidInvoices.length} invoice(s)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Pending</Typography>
                <LocalAtmIcon sx={{ color: 'warning.main', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>${totalPending.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">{pendingInvoices.length} invoice(s)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': { 
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">Overdue</Typography>
                <TrendingDownIcon sx={{ color: 'error.main', fontSize: 30 }} />
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'error.main' }}>${totalOverdue.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">{overdueInvoices.length} invoice(s)</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by patient name or invoice ID"
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
              <TableCell>Invoice ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={invoice.status} 
                      color={
                        invoice.status === 'Paid' ? 'success' :
                        invoice.status === 'Pending' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleViewInvoice(invoice.id)} size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleViewInvoice(invoice.id)} size="small">
                      <ReceiptIcon fontSize="small" />
                    </IconButton>
                    {invoice.status !== 'Paid' && (
                      <IconButton onClick={() => handleProcessPayment(invoice.id)} size="small">
                        <LocalAtmIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Billing;
