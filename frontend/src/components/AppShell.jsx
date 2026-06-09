import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const getTitle = () => {
    switch (location.pathname) {
      case '/clases': return 'Mis Clases';
      case '/reservar': return 'Reservar Aulas Especiales';
      case '/reservas': return 'Historial de Reservas';
      case '/perfil': return 'Mi Perfil';
      case '/admin/aulas': return 'Gestión de Aulas (Admin)';
      case '/admin/stock': return 'Control de Stock (Admin)';
      case '/admin/usuarios': return 'Control de Usuarios y Roles';
      default: return 'Sistema de Gestión de Aulas';
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onDrawerToggle={handleDrawerToggle} title={getTitle()} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', backgroundColor: '#fbfbfb' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}