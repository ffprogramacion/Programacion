import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Menu as MenuIcon, Person as PersonIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

import logoUnraf from '../assets/logo-unraf.png'; 

export default function Navbar({ onDrawerToggle, title }) {
  // 1. Traemos la función logout del contexto
  const { user, logout } = useAuth();
  
  // 2. Traemos el hook para navegar
  const navigate = useNavigate();

  // 3. Estado para controlar el menú desplegable
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Funciones para manejar la apertura y cierre del menú
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Acciones de los botones del menú
  const handleViewProfile = () => {
    handleMenuClose();
    navigate('/perfil'); // Redirige a la vista de perfil
  };

  const handleLogout = () => {
    handleMenuClose();
    logout(); // Tu función logout ya limpia el localStorage y te manda a /login
  };

  // Extraemos el nombre dinámicamente según lo que envíe Django
  const userName = user?.nombre || user?.first_name || user?.name || 'Usuario';
  const userInitial = userName.trim() ? userName.trim()[0].toUpperCase() : 'U';

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
          
          <NotificationBell />

          {/* Avatar del usuario */}
          {user && (
            <>
              <Avatar 
                onClick={handleMenuOpen} // 🚀 Abre el menú al hacer clic
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
                title={userName} 
              >
                {userInitial}
              </Avatar>

              {/* 🚀 El menú desplegable */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose} // Cierra si hacen clic adentro
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 4,
                  sx: { 
                    mt: 1.5, 
                    borderRadius: 2, 
                    minWidth: 180,
                    '& .MuiMenuItem-root': { py: 1.2 } 
                  }
                }}
              >
                <MenuItem onClick={handleViewProfile}>
                  <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  Ver perfil
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'error.main' }} />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          )}
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}