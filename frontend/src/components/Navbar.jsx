import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon, Code as CodeIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

// 🏛️ IMPORTAMOS TU LOGO DESDE LA CARPETA ASSETS
import logoUnraf from '../assets/logo-unraf.png'; 

export default function Navbar({ onDrawerToggle, title }) {
  const { user, setUser } = useAuth();

  // 🚀 Función de Testing: Solo útil si el backend permite sobrescribir roles o para UI mock.
  const toggleRoleTesting = () => {
    if (!user) return;
    
    // Normalizamos a los roles en español que probablemente uses en Django
    const roles = ['estudiante', 'profesor', 'admin'];
    const currentRole = user.role || user.rol; // Soporta ambos nombres de propiedad
    const nextRole = roles[(roles.indexOf(currentRole) + 1) % roles.length];
    
    const usuarioActualizado = { 
      ...user, 
      rol: nextRole,
      role: nextRole 
    };

    setUser(usuarioActualizado);
    // Nota: Esto solo cambia la UI. El token JWT seguirá teniendo el rol real.
  };

  // Extraemos el nombre dinámicamente según lo que envíe Django
  const userName = user?.nombre || user?.first_name || user?.name || 'Usuario';
  const userInitial = userName.trim()[0].toUpperCase();

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
          
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={onDrawerToggle} 
            sx={{ mr: 0.5, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box 
            component="img"
            src={logoUnraf}
            alt="Logo UNRaf"
            sx={{ 
              height: 32, 
              width: 'auto',
              borderRadius: '4px',
              backgroundColor: '#ffffff', 
              p: 0.3,
              boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
              display: { xs: 'none', sx: 'block', sm: 'block' } 
            }}
          />
          
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          
          {/* 🔥 MAGIA VITE: import.meta.env.DEV oculta este botón en producción automáticamente */}
          {import.meta.env.DEV && user && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<CodeIcon sx={{ fontSize: '14px !important' }} />}
              onClick={toggleRoleTesting} 
              title="Cuidado: Esto no cambia el token JWT del backend"
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
              Dev: {user.rol || user.role}
            </Button>
          )}

          <NotificationBell />

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
              title={userName} // Muestra el nombre al posar el mouse
            >
              {userInitial}
            </Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}