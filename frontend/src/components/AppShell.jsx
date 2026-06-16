import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Mapeo dinámico de títulos basado en la identidad académica
  const getTitle = () => {
    switch (location.pathname) {
      case '/clases': return 'Mis Asignaturas Curriculares';
      case '/reservar': return 'Solicitud de Espacios Académicos';
      case '/reservas': return 'Historial de Reservas Activas';
      case '/perfil': return 'Perfil Digital Institucional';
      case '/admin/aulas': return 'Módulo de Gestión de Aulas (CRUD)';
      case '/admin/stock': return 'Inventario de Recursos y Materiales';
      case '/admin/usuarios': return 'Control de Acceso y Roles de Usuario';
      default: return 'Sistema de Gestión de Aulas UNRaf';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <CssBaseline />
      <Navbar onDrawerToggle={handleDrawerToggle} title={getTitle()} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 4, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* Separador para que el AppBar fijo no tape el contenido */}
        <Outlet />  {/* Aquí React Router inyectará las Views dinámicamente */}
      </Box>
    </Box>
  );
}