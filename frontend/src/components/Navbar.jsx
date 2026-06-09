import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar({ onDrawerToggle, title }) {
  const { user, setUser } = useAuth();

  const toggleRoleTesting = () => {
    const roles = ['student', 'teacher', 'admin'];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
    setUser({ ...user, role: nextRole });
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>

        {user && (
          <Button variant="contained" color="secondary" size="small" onClick={toggleRoleTesting} sx={{ mr: 2 }}>
            Simular Rol: {user.role}
          </Button>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationBell />
          {user && <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>{user.name[0]}</Avatar>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}