import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext'; // 👈 Importamos el contexto para conocer el rol

export const DRAWER_WIDTH = 260;

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth(); // 👈 Consumimos el usuario activo

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Mapeo dinámico de títulos basado en la identidad académica y el rol
  const getTitle = () => {
    switch (location.pathname) {
      case '/clases': return 'Mis Asignaturas Curriculares';
      case '/reservar': return 'Solicitud de Espacios Académicos';
      case '/reservas': 
        // 🔥 Título adaptativo según rol para la misma URL
        return user?.role === 'admin' ? 'Historial de Reservas Activas (Global)' : 'Espacios Físicos e Infraestructura';
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
      
      <Navbar 
        drawerWidth={DRAWER_WIDTH} 
        onDrawerToggle={handleDrawerToggle} 
        title={getTitle()} 
      />
      
      <Sidebar 
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle} 
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0 
        }}
      >
        <Toolbar /> 
        <Outlet />  
      </Box>
    </Box>
  );
}