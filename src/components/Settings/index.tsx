/**
 * Settings Component
 * Author: Parth Rai
 */

import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          System Settings
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration Panel
              </Typography>
              <Typography variant="body1" color="text.secondary">
                System configuration and settings panel coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;