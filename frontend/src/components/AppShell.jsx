import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, 
  Badge, Menu, MenuItem, Avatar, Divider, Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Class as ClassIcon,
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export default function AppShell({ children }) {
  const { user, setUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  
  const handleOpenNavMenu = (event) => setAnchorElNotification(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNotification(null);

  // Simulador rápido para cambiar de rol desde la barra superior y testear
  const toggleRoleTesting = () => {
    const roles = ['student', 'teacher', 'admin'];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
    setUser({ ...user, role: nextRole });
  };

  const menuItems = [
    { text: 'Mis Clases', icon: <ClassIcon />, roles: ['student', 'teacher'] },
    { text: 'Reservar Aulas', icon: <CalendarIcon />, roles: ['student', 'teacher'] },
    { text: 'Gestión Aulas', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Stock Materiales', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Control Usuarios', icon: <AdminIcon />, roles: ['admin'] },
    { text: 'Historial Reservas', icon: <HistoryIcon />, roles: ['student', 'teacher', 'admin'] },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: '#1976d2', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          AulasApp ({user?.role.toUpperCase()})
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton color="error">
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Reservas
          </Typography>

          {/* Botón de testeo para que cambies de rol haciendo un clic */}
          <Button variant="contained" color="secondary" onClick={toggleRoleTesting} sx={{ mr: 2 }}>
            Probar Rol: {user.role}
          </Button>

          {/* Icono de Campana Notificaciones */}
          <IconButton color="inherit" onClick={handleOpenNavMenu}>
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <Menu
            anchorEl={anchorElNotification}
            open={Boolean(anchorElNotification)}
            onClose={handleCloseNavMenu}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={handleCloseNavMenu}>⚠️ El Admin dio de baja tu reserva de Aula 3</MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>📅 Nueva reserva añadida en Álgebra</MenuItem>
          </Menu>

          <Avatar sx={{ ml: 2, bgcolor: 'secondary.main' }}>{user?.name[0]}</Avatar>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}>
        {children}
      </Box>
    </Box>
  );
}