import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, Avatar, Grid, TextField } from '@mui/material';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>{user?.name[0]}</Avatar>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField fullWidth label="Nombre" value={user?.name || ''} disabled margin="normal" />
              <TextField fullWidth label="Rol del Sistema" value={user?.role.toUpperCase() || ''} disabled margin="normal" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}