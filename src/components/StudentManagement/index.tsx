/**
 * Advanced Student Management Component
 * Author: Parth Rai
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Grade as GradeIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import { Student, SearchFilters } from '../../types';
import { AdvancedSearchEngine } from '../../algorithms/searchAlgorithms';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const searchEngine = useMemo(() => new AdvancedSearchEngine(), []);

  // Mock data for demonstration
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        rollNo: 'CS001',
        contact: '+1234567890',
        dateOfBirth: new Date('2000-01-15'),
        gender: 'male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        course: 'Computer Science',
        department: 'Computer Science',
        year: 3,
        semester: 6,
        gpa: 3.8,
        credits: 120,
        enrollmentDate: new Date('2021-09-01'),
        status: 'active',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Mother',
          phone: '+1234567891'
        },
        academicHistory: [],
        extracurriculars: ['Programming Club', 'Chess Club'],
        achievements: [],
        fees: [],
        attendance: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        rollNo: 'ENG002',
        contact: '+1234567892',
        dateOfBirth: new Date('1999-05-20'),
        gender: 'female',
        address: {
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        course: 'Mechanical Engineering',
        department: 'Engineering',
        year: 4,
        semester: 8,
        gpa: 3.9,
        credits: 140,
        enrollmentDate: new Date('2020-09-01'),
        status: 'active',
        emergencyContact: {
          name: 'Bob Smith',
          relationship: 'Father',
          phone: '+1234567893'
        },
        academicHistory: [],
        extracurriculars: ['Robotics Club'],
        achievements: [],
        fees: [],
        attendance: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setStudents(mockStudents);
  }, []);

  const processedStudents = useMemo(() => {
    let result = [...students];

    if (searchQuery.trim()) {
      result = searchEngine.fuzzySearch(result, searchQuery, 0.6);
    }

    if (filters.department) {
      result = result.filter(s => s.department.toLowerCase().includes(filters.department!.toLowerCase()));
    }
    if (filters.year) {
      result = result.filter(s => s.year === filters.year);
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }

    return result;
  }, [students, searchQuery, filters, searchEngine]);

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.rollNo}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'course',
      headerName: 'Course',
      width: 150,
    },
    {
      field: 'year',
      headerName: 'Year',
      width: 80,
      type: 'number',
    },
    {
      field: 'gpa',
      headerName: 'GPA',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value >= 3.5 ? 'success.main' : params.value >= 2.5 ? 'warning.main' : 'error.main'}
          fontWeight="medium"
        >
          {params.value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'active' ? 'success' :
            params.value === 'graduated' ? 'info' :
            params.value === 'suspended' ? 'error' : 'default'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary">
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="secondary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Student Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced student management with ML-powered insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<AnalyticsIcon />}>
            ML Insights
          </Button>
          <Button variant="outlined" startIcon={<UploadIcon />}>
            Import
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Student
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department || ''}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Computer Science">Computer Science</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year || ''}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value as number })}
                  label="Year"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={1}>1st Year</MenuItem>
                  <MenuItem value={2}>2nd Year</MenuItem>
                  <MenuItem value={3}>3rd Year</MenuItem>
                  <MenuItem value={4}>4th Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{processedStudents.length}</Typography>
                  <Typography color="text.secondary">Total Students</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SchoolIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {processedStudents.filter(s => s.status === 'active').length}
                  </Typography>
                  <Typography color="text.secondary">Active Students</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GradeIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {processedStudents.length > 0 ? 
                      (processedStudents.reduce((sum, s) => sum + s.gpa, 0) / processedStudents.length).toFixed(2) : 
                      '0.00'
                    }
                  </Typography>
                  <Typography color="text.secondary">Average GPA</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon color="warning" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {processedStudents.filter(s => s.gpa >= 3.5).length}
                  </Typography>
                  <Typography color="text.secondary">High Performers</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading && <LinearProgress />}
          <DataGrid
            rows={processedStudents}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fafafa',
                borderBottom: '2px solid #e0e0e0',
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentManagement;