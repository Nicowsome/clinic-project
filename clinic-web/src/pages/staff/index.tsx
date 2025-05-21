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
  Avatar,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StaffManagement = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Placeholder data for demonstration
  useEffect(() => {
    const mockStaffData: StaffMember[] = [
      { id: 1, name: 'Dr. John Smith', role: 'Doctor', department: 'Cardiology', email: 'john.smith@clinic.com', phone: '(555) 123-4567', joinDate: '2022-01-15', status: 'Active' },
      { id: 2, name: 'Dr. Sarah Johnson', role: 'Doctor', department: 'Pediatrics', email: 'sarah.johnson@clinic.com', phone: '(555) 987-6543', joinDate: '2021-08-10', status: 'Active' },
      { id: 3, name: 'Robert Williams', role: 'Nurse', department: 'Emergency', email: 'robert.williams@clinic.com', phone: '(555) 234-5678', joinDate: '2023-02-20', status: 'Active' },
      { id: 4, name: 'Emily Davis', role: 'Receptionist', department: 'Front Desk', email: 'emily.davis@clinic.com', phone: '(555) 345-6789', joinDate: '2023-04-05', status: 'Active' },
      { id: 5, name: 'Michael Brown', role: 'Lab Technician', department: 'Laboratory', email: 'michael.brown@clinic.com', phone: '(555) 456-7890', joinDate: '2022-11-12', status: 'On Leave' },
      { id: 6, name: 'Dr. Jessica Taylor', role: 'Doctor', department: 'Neurology', email: 'jessica.taylor@clinic.com', phone: '(555) 567-8901', joinDate: '2021-06-30', status: 'Active' },
      { id: 7, name: 'Daniel Martinez', role: 'Pharmacist', department: 'Pharmacy', email: 'daniel.martinez@clinic.com', phone: '(555) 678-9012', joinDate: '2022-07-22', status: 'Active' },
      { id: 8, name: 'Lisa Anderson', role: 'Nurse', department: 'Pediatrics', email: 'lisa.anderson@clinic.com', phone: '(555) 789-0123', joinDate: '2023-01-08', status: 'Active' },
      { id: 9, name: 'Kevin Wilson', role: 'IT Support', department: 'IT', email: 'kevin.wilson@clinic.com', phone: '(555) 890-1234', joinDate: '2022-09-15', status: 'Active' },
      { id: 10, name: 'Amanda Thomas', role: 'Administrative Assistant', department: 'Administration', email: 'amanda.thomas@clinic.com', phone: '(555) 901-2345', joinDate: '2023-03-11', status: 'Terminated' },
    ];
    setStaff(mockStaffData);
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
        title: 'Staff Data Refreshed',
        message: 'Staff information has been refreshed successfully',
      });
    }, 800);
  };

  const handleAddStaff = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Adding staff members will be available in the next update',
    });
  };

  const handleEditStaff = (id: number) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: `Editing staff member #${id} will be available in the next update`,
    });
  };

  const handleDeleteStaff = (id: number) => {
    addNotification({
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to remove staff member #${id}? This action cannot be undone.`,
    });
  };

  const handleViewProfile = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setProfileDialogOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter staff based on search term and role
  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Count staff by role
  const staffByRole = staff.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count staff by status
  const activeStaff = staff.filter(member => member.status === 'Active').length;
  const onLeaveStaff = staff.filter(member => member.status === 'On Leave').length;
  const terminatedStaff = staff.filter(member => member.status === 'Terminated').length;

  // Get unique roles for filter
  const roles = Array.from(new Set(staff.map(member => member.role)));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="staff management tabs">
          <Tab label="Staff Directory" />
          <Tab label="Schedules" />
          <Tab label="Performance" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Staff Directory
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mr: 2 }}
              onClick={handleAddStaff}
            >
              Add Staff
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

        {/* Staff Summary Cards */}
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
                <Typography variant="h6" color="text.secondary">Total Staff</Typography>
                <Typography variant="h3" component="div">{staff.length}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <BadgeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {roles.length} different roles
                  </Typography>
                </Box>
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
                <Typography variant="h6" color="text.secondary">Active</Typography>
                <Typography variant="h3" component="div" sx={{ color: 'success.main' }}>{activeStaff}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {((activeStaff / staff.length) * 100).toFixed(0)}% of total staff
                  </Typography>
                </Box>
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
                <Typography variant="h6" color="text.secondary">On Leave</Typography>
                <Typography variant="h3" component="div" sx={{ color: 'warning.main' }}>{onLeaveStaff}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ScheduleIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {((onLeaveStaff / staff.length) * 100).toFixed(0)}% of total staff
                  </Typography>
                </Box>
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
                <Typography variant="h6" color="text.secondary">Terminated</Typography>
                <Typography variant="h3" component="div" sx={{ color: 'error.main' }}>{terminatedStaff}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon sx={{ color: 'error.main', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {((terminatedStaff / staff.length) * 100).toFixed(0)}% of total staff
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search staff by name, email, or department"
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
              <TextField
                select
                fullWidth
                label="Filter by Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                SelectProps={{
                  native: false,
                  renderValue: (value) => value === 'all' ? 'All Roles' : value,
                }}
              >
                <option value="all">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Staff ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>#{member.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>{member.name.charAt(0)}</Avatar>
                        {member.name}
                      </Box>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.status} 
                        color={
                          member.status === 'Active' ? 'success' :
                          member.status === 'On Leave' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleViewProfile(member)} size="small">
                        <PersonIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleEditStaff(member.id)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteStaff(member.id)} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Staff Schedules</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Staff scheduling feature will be available in the next update.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Coming Soon',
                message: 'Staff scheduling functionality will be available in the next update.',
              });
            }}
          >
            Request Early Access
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>Staff Performance Metrics</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Performance tracking and evaluation tools will be available in the next update.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 3 }}
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Coming Soon',
                message: 'Performance tracking functionality will be available in the next update.',
              });
            }}
          >
            Request Early Access
          </Button>
        </Box>
      </TabPanel>

      {/* Staff Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Staff Profile
          <IconButton
            aria-label="close"
            onClick={() => setProfileDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedStaff && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    fontSize: 48, 
                    margin: '0 auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {selectedStaff.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {selectedStaff.name}
                </Typography>
                <Chip 
                  label={selectedStaff.status} 
                  color={
                    selectedStaff.status === 'Active' ? 'success' :
                    selectedStaff.status === 'On Leave' ? 'warning' : 'error'
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">Staff Information</Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                      <Typography variant="body1">{selectedStaff.role}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                      <Typography variant="body1">{selectedStaff.department}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="body1">{selectedStaff.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="body1">{selectedStaff.phone}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Join Date</Typography>
                      <Typography variant="body1">{selectedStaff.joinDate}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Recent Activity</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Activity tracking will be available in the next update.
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
          {selectedStaff && (
            <Button 
              variant="contained"
              onClick={() => {
                handleEditStaff(selectedStaff.id);
                setProfileDialogOpen(false);
              }}
            >
              Edit Profile
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffManagement;
