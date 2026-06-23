import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importamos el cerebro global
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material';
import { Notifications as NotificationsIcon, DeleteSweep as ClearIcon } from '@mui/icons-material';

export default function NotificationBell() {
  const { notificaciones, limpiarNotificaciones } = useAuth(); // Consumimos datos globales
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClearAll = () => {
    limpiarNotificaciones();
    handleClose();
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleOpen}>
        {/* Muestra la cantidad exacta de alertas vivas en tiempo real */}
        <Badge badgeContent={notificaciones.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: '45px' }}
        PaperProps={{ 
          style: { 
            width: '340px', 
            maxWidth: '100%', 
            borderRadius: '12px',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' 
          } 
        }}
      >
        {/* Encabezado del menú desplegable */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
            Alertas del Sistema
          </Typography>
          {notificaciones.length > 0 && (
            <Button 
              size="small" 
              startIcon={<ClearIcon />} 
              onClick={handleClearAll}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              Limpiar todo
            </Button>
          )}
        </Box>
        <Divider />

        {notificaciones.length === 0 ? (
          <MenuItem onClick={handleClose} disabled sx={{ py: 2, justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No tienes notificaciones nuevas
            </Typography>
          </MenuItem>
        ) : (
          notificaciones.map((notif) => (
            <Box key={notif.id}>
              <MenuItem 
                onClick={handleClose} 
                sx={{ 
                  whiteSpace: 'normal', 
                  py: 1.5,
                  fontSize: '0.85rem',
                  '&:hover': { backgroundColor: '#f8fafc' } 
                }}
              >
                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.4 }}>
                  {notif.text}
                </Typography>
              </MenuItem>
              <Divider sx={{ opacity: 0.6 }} />
            </Box>
          ))
        )}
      </Menu>
    </Box>
  );
}