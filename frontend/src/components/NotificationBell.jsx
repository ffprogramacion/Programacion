import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const notifications = [
    { id: 1, text: "⚠️ El Admin dio de baja tu reserva de Aula 3 (Laboratorio)." },
    { id: 2, text: "📅 Un profesor asignó una nueva reserva a la materia Álgebra." }
  ];

  return (
    <Box>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: '45px' }}
        PaperProps={{ style: { width: '320px', maxWidth: '100%' } }}
      >
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">No tienes notificaciones nuevas</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleClose} sx={{ whiteSpace: 'normal' }}>
              <Typography variant="body2">{notif.text}</Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
}