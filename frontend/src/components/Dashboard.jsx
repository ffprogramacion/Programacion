import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import Clases from '../views/Clases';
import Reservar from '../views/Reservar';
import Reservas from '../views/Reservas';
import Profile from '../views/Profile';

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
          <Tab label="Inicio / Clases" />
          <Tab label="Solicitar Reserva" />
          <Tab label="Ver Todas las Reservas" />
          <Tab label="Perfil" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 1 }}>
        {currentTab === 0 && <Clases />}
        {currentTab === 1 && <Reservar />}
        {currentTab === 2 && <Reservas />}
        {currentTab === 3 && <Profile />}
      </Box>
    </Box>
  );
}