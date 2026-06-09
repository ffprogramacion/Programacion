import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Class as ClassIcon, CalendarMonth as CalendarIcon, History as HistoryIcon, AdminPanelSettings as AdminIcon, ExitToApp as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { text: 'Mis Clases', path: '/clases', icon: <ClassIcon />, roles: ['student', 'teacher'] },
    { text: 'Reservar Aulas', path: '/reservar', icon: <CalendarIcon />, roles: ['student', 'teacher'] },
    { text: 'Gestión Aulas', path: '/admin/aulas', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Stock Materiales', path: '/admin/stock', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Control Usuarios', path: '/admin/usuarios', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Reservas', path: '/reservas', icon: <HistoryIcon />, roles: ['student', 'teacher', 'admin'] },
    { text: 'Perfil', path: '/perfil', icon: <PersonIcon />, roles: ['student', 'teacher', 'admin'] },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: { xs: 0, sm: 2 } }}>
      {user && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">Sesión iniciada como:</Typography>
          <Typography variant="body1" fontWeight="bold" color="primary">{user.role.toUpperCase()}</Typography>
        </Box>
      )}
      <Divider />
      
      <List>
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  selected={isActive} 
                  onClick={mobileOpen ? onDrawerToggle : undefined}
                  sx={{ 
                    bgcolor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    borderRight: isActive ? '4px solid #1976d2' : '4px solid transparent'
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ '& .MuiTypography-root': { color: isActive ? 'primary.main' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' } }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
      
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        open
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    </Box>
  );
}