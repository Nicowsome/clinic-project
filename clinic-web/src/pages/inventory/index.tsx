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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  DeleteOutline as DeleteOutlineIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

const Inventory = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [restockQuantity, setRestockQuantity] = useState<number>(0);

  // Placeholder data for demonstration
  useEffect(() => {
    const mockInventory = [
      { id: 1, name: 'Disposable Gloves (Box)', category: 'Equipment', quantity: 25, threshold: 10, unitPrice: 12.50, lastRestocked: '2025-05-01' },
      { id: 2, name: 'Ibuprofen 200mg', category: 'Medication', quantity: 150, threshold: 50, unitPrice: 0.75, lastRestocked: '2025-04-15' },
      { id: 3, name: 'Surgical Masks (Box)', category: 'Equipment', quantity: 8, threshold: 10, unitPrice: 18.99, lastRestocked: '2025-04-20' },
      { id: 4, name: 'Amoxicillin 500mg', category: 'Medication', quantity: 80, threshold: 30, unitPrice: 1.25, lastRestocked: '2025-05-05' },
      { id: 5, name: 'Blood Pressure Cuffs', category: 'Equipment', quantity: 5, threshold: 3, unitPrice: 45.00, lastRestocked: '2025-03-10' },
      { id: 6, name: 'Glucose Test Strips (Box)', category: 'Supplies', quantity: 12, threshold: 5, unitPrice: 29.99, lastRestocked: '2025-04-28' },
      { id: 7, name: 'Alcohol Wipes (Pack)', category: 'Supplies', quantity: 40, threshold: 15, unitPrice: 5.50, lastRestocked: '2025-05-10' },
      { id: 8, name: 'Antibacterial Solution (500ml)', category: 'Supplies', quantity: 7, threshold: 5, unitPrice: 8.75, lastRestocked: '2025-04-22' },
    ];
    setInventory(mockInventory);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
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
        title: 'Inventory Refreshed',
        message: 'Inventory data has been refreshed successfully',
      });
    }, 800);
  };

  const handleCategoryFilterChange = (event: any) => {
    setCategoryFilter(event.target.value);
  };

  const handleAddItem = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Adding inventory items will be available in the next update',
    });
  };

  const handleEditItem = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `Editing item #${id} will be available in the next update`,
    });
  };

  const handleDeleteItem = (id: number) => {
    addNotification({
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete item #${id}? This cannot be undone.`,
    });
  };

  const handleViewHistory = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `Viewing history for item #${id} will be available in the next update`,
    });
  };

  const handleOpenRestockDialog = (item: any) => {
    setSelectedItem(item);
    setRestockQuantity(10); // Default restock quantity
    setRestockDialogOpen(true);
  };

  const handleRestockItem = () => {
    if (selectedItem && restockQuantity > 0) {
      // Update inventory (in real app, this would be an API call)
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            quantity: item.quantity + restockQuantity,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      
      setInventory(updatedInventory);
      setRestockDialogOpen(false);
      
      addNotification({
        type: 'success',
        title: 'Item Restocked',
        message: `Added ${restockQuantity} units of ${selectedItem.name} to inventory`,
      });
    }
  };

  // Calculate low stock items and total inventory value
  const lowStockItems = inventory.filter(item => item.quantity <= item.threshold);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  // Filter inventory based on search term and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 2 }}
            onClick={handleAddItem}
          >
            Add Item
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

      {/* Inventory Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
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
              <Typography variant="h6" color="text.secondary">Total Items</Typography>
              <Typography variant="h3" component="div">{inventory.length}</Typography>
              <Typography variant="body2" color="text.secondary">In {new Set(inventory.map(item => item.category)).size} categories</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
              <Typography variant="h6" color="text.secondary">Low Stock Items</Typography>
              <Typography variant="h3" component="div" sx={{ color: lowStockItems.length > 0 ? 'error.main' : 'success.main' }}>
                {lowStockItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lowStockItems.length > 0 ? 'Attention needed' : 'Everything is well-stocked'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
              <Typography variant="h6" color="text.secondary">Total Inventory Value</Typography>
              <Typography variant="h3" component="div">${totalInventoryValue.toFixed(2)}</Typography>
              <Typography variant="body2" color="text.secondary">Current valuation</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {lowStockItems.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          {lowStockItems.length} item(s) are below their minimum stock level and need to be reordered
        </Alert>
      )}

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search inventory items"
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
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Array.from(new Set(inventory.map(item => item.category))).map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Last Restocked</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow 
                  key={item.id}
                  sx={{
                    backgroundColor: item.quantity <= item.threshold ? 'rgba(255, 0, 0, 0.05)' : 'inherit',
                  }}
                >
                  <TableCell>#{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip label={item.category} size="small" />
                  </TableCell>
                  <TableCell>
                    {item.quantity}
                    {item.quantity <= item.threshold && (
                      <Chip 
                        label="Low Stock" 
                        color="error" 
                        size="small" 
                        sx={{ ml: 1 }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditItem(item.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleViewHistory(item.id)} size="small">
                      <HistoryIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenRestockDialog(item)} size="small" color="primary">
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteItem(item.id)} size="small" color="error">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInventory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Restock Dialog */}
      <Dialog open={restockDialogOpen} onClose={() => setRestockDialogOpen(false)}>
        <DialogTitle>Restock Inventory Item</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1">{selectedItem.name}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Current quantity: {selectedItem.quantity} units
              </Typography>
              <Typography gutterBottom>Quantity to add:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Slider
                  value={restockQuantity}
                  onChange={(_, value) => setRestockQuantity(value as number)}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{ flex: 1, mr: 2 }}
                />
                <TextField
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 80 }}
                />
              </Box>
              <Typography variant="body2">
                New total after restock: {selectedItem.quantity + restockQuantity} units
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestockDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRestockItem}
            disabled={!selectedItem || restockQuantity <= 0}
          >
            Restock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
