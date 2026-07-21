import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon, Code as CodeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

// 🏛️ IMPORTAMOS TU LOGO DESDE LA CARPETA ASSETS
import logoUnraf from '../assets/logo-unraf.png'; 

export default function Navbar({ onDrawerToggle, title }) {
  const { user, setUser } = useAuth();

  const toggleRoleTesting = () => {
    if (!user) return;
    
    const roles = ['student', 'teacher', 'admin'];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];
    
    const usuarioActualizado = { 
      ...user, 
      name: user?.name || "Facundo Boide", 
      role: nextRole 
    };

    setUser(usuarioActualizado);
    localStorage.setItem('universidad_user', JSON.stringify(usuarioActualizado));
  };

  const userInitial = user?.name ? user.name.trim()[0].toUpperCase() : 'U';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(15, 92, 179, 0.92)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Botón de Hamburguesa para pantallas chicas */}
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={onDrawerToggle} 
            sx={{ mr: 0.5, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 🌟 CONTENEDOR DEL LOGO INSTITUCIONAL */}
          <Box 
            component="img"
            src={logoUnraf}
            alt="Logo UNRaf"
            sx={{ 
              height: 32, 
              width: 'auto',
              borderRadius: '4px', // Le da una terminación suave en las esquinas si tiene fondo blanco
              backgroundColor: '#ffffff', // Opcional: asegura contraste si el logo es oscuro
              p: 0.3,
              boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
              display: { xs: 'none', sx: 'block', sm: 'block' } // Se oculta en pantallas ultra chicas para no encimar
            }}
          />
          
          {/* Título dinámico del módulo institucional */}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: '600', 
              fontSize: '1.05rem',
              letterSpacing: '0.3px',
              color: '#ffffff',
              ml: 0.5
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Bloque Derecho: Herramientas de Desarrollo y Datos de Perfil */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          
          {user && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<CodeIcon sx={{ fontSize: '14px !important' }} />}
              onClick={toggleRoleTesting} 
              sx={{ 
                backgroundColor: 'rgba(251, 192, 45, 0.1)', 
                color: '#fbc02d', 
                border: '1px solid rgba(251, 192, 45, 0.4)',
                fontWeight: '700',
                fontSize: '0.78rem',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                borderRadius: '8px',
                px: 2,
                py: 0.6,
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                  backgroundColor: 'rgba(251, 192, 45, 0.2)',
                  border: '1px solid #fbc02d',
                  transform: 'scale(1.02)'
                }
              }}
            >
              Dev: {user.role}
            </Button>
          )}

          {/* Campanita de Notificaciones */}
          <NotificationBell />

          {/* Avatar del usuario con anillo institucional */}
          {user && (
            <Avatar 
              sx={{ 
                bgcolor: '#00a896', 
                fontWeight: '700', 
                fontSize: '0.85rem',
                width: 36,
                height: 36,
                border: '2px solid rgba(255, 255, 255, 0.8)', 
                boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {userInitial}
            </Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}