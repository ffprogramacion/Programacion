import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ onDrawerToggle, title }) {
  const { user, setUser } = useAuth();

  // Función de desarrollo para que saltes entre perfiles sin desloguearte
  const toggleRoleTesting = () => {
    const roles = ['student', 'teacher', 'admin'];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
    // Aseguramos que pasamos todo el objeto viejo (...user) y solo pisamos el rol
    setUser({ ...user, name: user?.name || "Facundo", role: nextRole });
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#0f5cb3', // Azul UNRaf Oficial
        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: '600', fontSize: '1.15rem' }}>
          {title}
        </Typography>

        {user && (
          <Button 
            variant="contained" 
            size="small" 
            onClick={toggleRoleTesting} 
            sx={{ 
              mr: 3, 
              backgroundColor: '#fbc02d', // Oro/Amarillo UNRaf para destacar la herramienta demo
              color: '#1a1a1a',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#f9a825' }
            }}
          >
            Modo Desarrollo: {user.role.toUpperCase()}
          </Button>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NotificationBell />
          {user && (
            <Avatar sx={{ bgcolor: '#00a896', fontWeight: 'bold', fontSize: '0.9rem' }}> {/* Verde Agua UNRaf */}
              {user.name[0].toUpperCase()}
            </Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}