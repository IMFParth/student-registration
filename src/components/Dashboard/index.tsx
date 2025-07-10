/**
 * Advanced Dashboard Component
 * Author: Parth Rai
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  School,
  Person,
  Grade,
  Warning,
  Refresh,
  Analytics,
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 1247,
    activeStudents: 1189,
    averageGPA: 3.42,
    graduationRate: 87.5,
  });

  const [loading, setLoading] = useState(false);

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Average GPA',
        data: [3.2, 3.3, 3.4, 3.5, 3.4, 3.42],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const departmentData = {
    labels: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'],
    datasets: [
      {
        label: 'Students',
        data: [320, 280, 190, 150, 307],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      },
    ],
  };

  const gpaDistribution = {
    labels: ['4.0', '3.5-3.9', '3.0-3.4', '2.5-2.9', '2.0-2.4', '<2.0'],
    datasets: [
      {
        data: [15, 35, 30, 15, 4, 1],
        backgroundColor: [
          '#4CAF50',
          '#8BC34A',
          '#FFC107',
          '#FF9800',
          '#FF5722',
          '#F44336',
        ],
      },
    ],
  };

  const recentActivities = [
    { id: 1, text: 'New student John Doe enrolled', time: '2 hours ago', type: 'enrollment' },
    { id: 2, text: 'Grade report generated for CS101', time: '4 hours ago', type: 'report' },
    { id: 3, text: 'Alice Smith updated profile', time: '6 hours ago', type: 'update' },
    { id: 4, text: 'System backup completed', time: '1 day ago', type: 'system' },
  ];

  const alerts = [
    { id: 1, text: '15 students have GPA below 2.5', severity: 'warning' },
    { id: 2, text: 'Fee payment deadline approaching', severity: 'info' },
    { id: 3, text: '3 students absent for >5 days', severity: 'error' },
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={refreshData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h4">
                    {metrics.totalStudents.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +5.2%
                    </Typography>
                  </Box>
                </Box>
                <Person color="primary" sx={{ fontSize: 48 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Students
                  </Typography>
                  <Typography variant="h4">
                    {metrics.activeStudents.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +2.1%
                    </Typography>
                  </Box>
                </Box>
                <School color="success" sx={{ fontSize: 48 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average GPA
                  </Typography>
                  <Typography variant="h4">
                    {metrics.averageGPA.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      +0.12
                    </Typography>
                  </Box>
                </Box>
                <Grade color="info" sx={{ fontSize: 48 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Graduation Rate
                  </Typography>
                  <Typography variant="h4">
                    {metrics.graduationRate}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingDown color="error" fontSize="small" />
                    <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                      -1.3%
                    </Typography>
                  </Box>
                </Box>
                <Analytics color="warning" sx={{ fontSize: 48 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={performanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                GPA Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut
                  data={gpaDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Statistics
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={departmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List dense>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={activity.text}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alerts & Notifications
              </Typography>
              <List dense>
                {alerts.map((alert) => (
                  <ListItem key={alert.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Warning 
                        color={
                          alert.severity === 'error' ? 'error' :
                          alert.severity === 'warning' ? 'warning' : 'info'
                        } 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.text}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;