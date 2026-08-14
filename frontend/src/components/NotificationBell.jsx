import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, Button } from '@mui/material';
import { Notifications as NotificationsIcon, DeleteSweep as ClearIcon } from '@mui/icons-material';

export default function NotificationBell() {
  const { notificaciones, limpiarNotificaciones } = useAuth(); 
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleClearAll = () => {
    // Esto llamará a la API desde el AuthContext para marcarlas como leídas o borrarlas
    limpiarNotificaciones();
    handleClose();
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notificaciones?.length || 0} color="error">
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
            Alertas del Sistema
          </Typography>
          {notificaciones?.length > 0 && (
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

        {!notificaciones || notificaciones.length === 0 ? (
          <MenuItem onClick={handleClose} disabled sx={{ py: 3, justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No hay notificaciones nuevas
            </Typography>
          </MenuItem>
        ) : (
          notificaciones.map((notif) => {
            // Normalización de datos para soportar tanto mocks como la respuesta de Django
            const mensaje = notif.mensaje || notif.text || 'Nueva alerta de sistema';
            const fechaString = notif.fecha_creacion || notif.fecha;
            
            return (
              <Box key={notif.id}>
                <MenuItem 
                  onClick={handleClose} 
                  sx={{ 
                    whiteSpace: 'normal', 
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': { backgroundColor: '#f8fafc' } 
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.4, mb: fechaString ? 0.5 : 0 }}>
                    {mensaje}
                  </Typography>
                  
                  {/* Renderizado condicional de la fecha si la API la provee */}
                  {fechaString && (
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                      {new Date(fechaString).toLocaleDateString('es-AR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </Typography>
                  )}
                </MenuItem>
                <Divider sx={{ opacity: 0.6 }} />
              </Box>
            );
          })
        )}
      </Menu>
    </Box>
  );
}