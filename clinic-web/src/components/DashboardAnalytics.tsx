import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AppointmentsByDay {
  day: string;
  count: number;
}

interface PatientsByStatus {
  name: string;
  value: number;
}

interface DashboardMetric {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

const DashboardAnalytics: React.FC = () => {
  const [appointmentsByDay, setAppointmentsByDay] = useState<AppointmentsByDay[]>([]);
  const [patientsByStatus, setPatientsByStatus] = useState<PatientsByStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be API calls
        // For now, let's use mock data
        
        // Mock appointment data by day
        const mockAppointmentsByDay = [
          { day: 'Mon', count: 12 },
          { day: 'Tue', count: 19 },
          { day: 'Wed', count: 15 },
          { day: 'Thu', count: 21 },
          { day: 'Fri', count: 18 },
          { day: 'Sat', count: 10 },
          { day: 'Sun', count: 5 }
        ];
        
        // Mock patient status data
        const mockPatientsByStatus = [
          { name: 'New', value: 25 },
          { name: 'Follow-up', value: 45 },
          { name: 'Ongoing', value: 30 },
          { name: 'Discharged', value: 15 },
          { name: 'Referred', value: 10 }
        ];
        
        setAppointmentsByDay(mockAppointmentsByDay);
        setPatientsByStatus(mockPatientsByStatus);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchData();
  }, []);

  const MetricCard = ({ title, value, description }: DashboardMetric) => (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Clinic Analytics Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Patients" 
            value={345} 
            description="+23 from last month"
            icon={null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Today's Appointments" 
            value={28} 
            description="3 more than yesterday"
            icon={null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Average Wait Time" 
            value={24} 
            description="minutes per patient"
            icon={null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Satisfaction Rate" 
            value={92} 
            description="% positive feedback"
            icon={null}
          />
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appointments by Day
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={appointmentsByDay}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Appointments" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {patientsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAnalytics;
