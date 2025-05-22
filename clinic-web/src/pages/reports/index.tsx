import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Print as PrintIcon,
  CloudDownload as CloudDownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../context/NotificationContext';

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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
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

const Reports = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Generate placeholder data based on time range
  const [reportData, setReportData] = useState<any>({
    patientVisits: {
      totalVisits: 0,
      newPatients: 0,
      returningPatients: 0,
      canceledAppointments: 0,
    },
    revenue: {
      total: 0,
      consultations: 0,
      procedures: 0,
      medications: 0,
    },
    performanceMetrics: {
      avgWaitTime: 0,
      avgConsultationTime: 0,
      patientSatisfaction: 0,
    }
  });

  // Generate random data for demo purposes
  useEffect(() => {
    // Simulating different data for different time ranges
    const generateData = () => {
      const multiplier = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      
      return {
        patientVisits: {
          totalVisits: Math.floor(Math.random() * 20 * multiplier) + 10 * multiplier,
          newPatients: Math.floor(Math.random() * 8 * multiplier) + 2 * multiplier,
          returningPatients: Math.floor(Math.random() * 12 * multiplier) + 8 * multiplier,
          canceledAppointments: Math.floor(Math.random() * 3 * multiplier) + multiplier,
        },
        revenue: {
          total: (Math.random() * 5000 * multiplier) + 3000 * multiplier,
          consultations: (Math.random() * 2000 * multiplier) + 1000 * multiplier,
          procedures: (Math.random() * 2000 * multiplier) + 1500 * multiplier,
          medications: (Math.random() * 1000 * multiplier) + 500 * multiplier,
        },
        performanceMetrics: {
          avgWaitTime: Math.floor(Math.random() * 15) + 5, // minutes
          avgConsultationTime: Math.floor(Math.random() * 20) + 10, // minutes
          patientSatisfaction: Math.floor(Math.random() * 20) + 80, // percentage
        }
      };
    };

    setReportData(generateData());
  }, [timeRange]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Generate new random data
      const multiplier = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      
      const newData = {
        patientVisits: {
          totalVisits: Math.floor(Math.random() * 20 * multiplier) + 10 * multiplier,
          newPatients: Math.floor(Math.random() * 8 * multiplier) + 2 * multiplier,
          returningPatients: Math.floor(Math.random() * 12 * multiplier) + 8 * multiplier,
          canceledAppointments: Math.floor(Math.random() * 3 * multiplier) + multiplier,
        },
        revenue: {
          total: (Math.random() * 5000 * multiplier) + 3000 * multiplier,
          consultations: (Math.random() * 2000 * multiplier) + 1000 * multiplier,
          procedures: (Math.random() * 2000 * multiplier) + 1500 * multiplier,
          medications: (Math.random() * 1000 * multiplier) + 500 * multiplier,
        },
        performanceMetrics: {
          avgWaitTime: Math.floor(Math.random() * 15) + 5, // minutes
          avgConsultationTime: Math.floor(Math.random() * 20) + 10, // minutes
          patientSatisfaction: Math.floor(Math.random() * 20) + 80, // percentage
        }
      };
      
      setReportData(newData);
      setLoading(false);
      addNotification({
        type: 'success',
        title: 'Reports Refreshed',
        message: 'Report data has been refreshed successfully',
      });
    }, 800);
  };

  const handleExport = (format: string) => {
    addNotification({
      type: 'info',
      title: 'Exporting Report',
      message: `Exporting report data as ${format}...`,
    });
    
    // Simulate export completion
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Export Complete',
        message: `Report has been exported as ${format} successfully`,
      });
    }, 1500);
  };

  const handlePrint = () => {
    addNotification({
      type: 'info',
      title: 'Printing Report',
      message: 'Sending report to printer...',
    });
  };

  const handleGenerateCustomReport = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Custom report generation will be available in the next update',
    });
  };

  // Time range labels
  const timeRangeLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
            sx={{ mr: 1 }}
            onClick={() => handleExport('PDF')}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRangeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Report Period: {timeRangeLabels[timeRange as keyof typeof timeRangeLabels]}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="time-range-select-label">Time Range</InputLabel>
              <Select
                labelId="time-range-select-label"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reports tabs">
          <Tab label="Dashboard" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Patient Analytics" icon={<PieChartIcon />} iconPosition="start" />
          <Tab label="Financial Reports" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Performance Metrics" icon={<TimelineIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Patient Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <CardHeader 
                title="Patient Visits" 
                action={
                  <IconButton aria-label="settings">
                    <FilterListIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>{reportData.patientVisits.totalVisits}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">New Patients</Typography>
                    <Typography variant="h6">{reportData.patientVisits.newPatients}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Returning</Typography>
                    <Typography variant="h6">{reportData.patientVisits.returningPatients}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="error.main">
                      {reportData.patientVisits.canceledAppointments} Canceled Appointments
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Revenue Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <CardHeader 
                title="Revenue" 
                action={
                  <IconButton aria-label="settings">
                    <FilterListIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>${reportData.revenue.total.toFixed(2)}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Consultations</Typography>
                    <Typography variant="h6">${reportData.revenue.consultations.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Procedures</Typography>
                    <Typography variant="h6">${reportData.revenue.procedures.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Medications: ${reportData.revenue.medications.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Performance Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': { 
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <CardHeader 
                title="Performance" 
                action={
                  <IconButton aria-label="settings">
                    <FilterListIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="h3" sx={{ mb: 2 }}>{reportData.performanceMetrics.patientSatisfaction}%</Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>Patient Satisfaction</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Wait Time</Typography>
                    <Typography variant="h6">{reportData.performanceMetrics.avgWaitTime} min</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Consultation</Typography>
                    <Typography variant="h6">{reportData.performanceMetrics.avgConsultationTime} min</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Chart Placeholders */}
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardHeader title="Visits Trend" />
              <CardContent>
                <Box 
                  sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.03)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Chart visualization will be available in the next update
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardHeader title="Revenue Distribution" />
              <CardContent>
                <Box 
                  sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.03)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Chart visualization will be available in the next update
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <BarChartIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" gutterBottom>Patient Analytics</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Detailed patient analytics including demographics, visit frequency, referral sources, and treatment outcomes will be available in the next update.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGenerateCustomReport}
          >
            Generate Custom Report
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <TrendingUpIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" gutterBottom>Financial Reports</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Comprehensive financial reporting including income statements, balance sheets, cash flow analysis, and insurance claims tracking will be available in the next update.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGenerateCustomReport}
          >
            Generate Custom Report
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <TimelineIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            Detailed performance metrics including staff productivity, resource utilization, quality measures, and patient satisfaction analytics will be available in the next update.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGenerateCustomReport}
          >
            Generate Custom Report
          </Button>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Reports;
