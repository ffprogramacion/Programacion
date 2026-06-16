import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Class as ClassIcon, CalendarMonth as CalendarIcon, History as HistoryIcon, AdminPanelSettings as AdminIcon, ExitToApp as LogoutIcon, Person as PersonIcon, Inventory as StockIcon, Group as UsersIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Matriz de enrutamiento del menú con asignación de roles jerárquicos
  const menuItems = [
    { text: 'Mis Clases', path: '/clases', icon: <ClassIcon />, roles: ['student', 'teacher'] },
    { text: 'Reservar Aulas', path: '/reservar', icon: <CalendarIcon />, roles: ['student', 'teacher'] },
    { text: 'Reservas Históricas', path: '/reservas', icon: <HistoryIcon />, roles: ['student', 'teacher', 'admin'] },
    { text: 'Mi Perfil', path: '/perfil', icon: <PersonIcon />, roles: ['student', 'teacher', 'admin'] },
    
    // Rutas Exclusivas del Panel de Control de Administración
    { text: 'Gestión de Aulas', path: '/admin/aulas', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Stock de Materiales', path: '/admin/stock', icon: <StockIcon />, roles: ['admin'] },
    { text: 'Control de Usuarios', path: '/admin/usuarios', icon: <UsersIcon />, roles: ['admin'] },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {user && (
        <Box sx={{ p: 2, px: 3, mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
            Credencial Activa
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f5cb3', mt: 0.5, fontSize: '1rem' }}>
            {user.name.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Rol: {user.role === 'admin' ? 'Administrador' : user.role === 'teacher' ? 'Docente' : 'Estudiante'}
          </Typography>
        </Box>
      )}
      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ px: 2, mt: 1, flexGrow: 1 }}>
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  selected={isActive} 
                  onClick={mobileOpen ? onDrawerToggle : undefined}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    bgcolor: isActive ? 'rgba(15, 92, 179, 0.08)' : 'transparent',
                    borderLeft: isActive ? '4px solid #0f5cb3' : '4px solid transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(15, 92, 179, 0.1)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#0f5cb3' : 'text.secondary', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: isActive ? '#0f5cb3' : 'text.primary', 
                        fontWeight: isActive ? '600' : '400',
                        fontSize: '0.92rem'
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
      
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, py: 1.2 }}>
            <ListItemIcon sx={{ minWidth: '40px' }}><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" sx={{ '& .MuiTypography-root': { color: 'error.main', fontWeight: '500', fontSize: '0.92rem' } }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Drawer para Dispositivos Móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ 
          display: { xs: 'block', sm: 'none' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' } 
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      {/* Drawer Permanente para Escritorio */}
      <Drawer
        variant="permanent"
        sx={{ 
          display: { xs: 'none', sm: 'block' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' } 
        }}
        open
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    </Box>
  );
}