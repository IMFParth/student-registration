/**
 * Reports Component
 * Author: Parth Rai
 */

import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Assessment as ReportsIcon } from '@mui/icons-material';

const Reports: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReportsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Reports & Analytics
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Reporting System
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive reporting with export capabilities coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;