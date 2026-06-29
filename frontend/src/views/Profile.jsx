import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, Avatar, Grid, TextField, Typography, List, ListItem, ListItemText, Divider, Chip, Stack } from '@mui/material';
import { AccountCircle as UserIcon, History as HistoryIcon, Room as RoomIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';

export default function Profile() {
  const { user, reservas } = useAuth();

  // 1. Filtrar las reservas que pertenecen únicamente al usuario logueado
  const misReservasHistoricas = reservas.filter(res => res.userId === user?.id);

  // 2. Función mágica para calcular el estado en tiempo real (Activa, Finalizada o Cancelada)
  const obtenerEstadoVigencia = (reserva) => {
    if (reserva.estado === 'Cancelada') {
      return { label: 'Cancelada', color: 'error', variant: 'outlined' };
    }

    try {
      // Tu string de fecha guarda: "DD/MM/YYYY - de HH:MM a HH:MM hs"
      // Ejemplo: "28/06/2026 - de 14:00 a 16:00 hs"
      const [fechaPart, horaPart] = reserva.fecha.split(' - ');
      const [dia, mes, anio] = fechaPart.split('/').map(Number);
      
      // Extraemos la hora de finalización (la segunda hora que aparece en el string)
      const matchHoraFin = horaPart.match(/a\s+(\d{2}):(\d{2})/);
      if (!matchHoraFin) return { label: 'Activa', color: 'primary', variant: 'contained' };

      const [_, hora, minutos] = matchHoraFin.map(Number);

      // Creamos el objeto Date exacto en el que termina la reserva
      const momentoFinReserva = new Date(anio, mes - 1, dia, hora, minutos);
      const ahora = new Date();

      if (ahora > momentoFinReserva) {
        return { label: 'Finalizada', color: 'default', variant: 'filled' };
      } else {
        return { label: 'Activa', color: 'success', variant: 'contained' };
      }
    } catch (e) {
      // Copia de respaldo por seguridad si el string no se parsea bien
      return { label: 'Activa', color: 'success', variant: 'contained' };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      
      {/* TARJETA DE PERFIL (DATOS INSTITUCIONALES) */}
      <Card sx={{ borderRadius: 4, boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', border: '1px solid #eef2f6', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: '#0f5cb3', boxShadow: '0px 8px 20px rgba(15,92,179,0.15)' }}>
                {user?.name ? user.name[0].toUpperCase() : <UserIcon />}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>Información del Usuario</Typography>
              <TextField fullWidth label="Nombre y Apellido" value={user?.name || ''} disabled margin="dense" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField fullWidth label="Rol del Sistema" value={user?.role ? user.role.toUpperCase() : ''} disabled margin="dense" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 }, mt: 2 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* HISTORIAL DE RESERVAS PERSONALES */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 1 }}>
        <HistoryIcon sx={{ color: '#0f5cb3' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
          Mi Historial de Solicitudes Académicas
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.03)', border: '1px solid #eef2f6', overflow: 'hidden', backgroundColor: 'white' }}>
        <CardContent sx={{ p: misReservasHistoricas.length === 0 ? 4 : 0 }}>
          {misReservasHistoricas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CalendarIcon sx={{ fontSize: 44, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body1" fontWeight="600" color="#64748b">No registrás reservas históricas</Typography>
              <Typography variant="caption" color="text.secondary">Las aulas que solicites a futuro aparecerán listadas en esta sección.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {misReservasHistoricas.slice().reverse().map((res, index) => { // .slice().reverse() muestra la última que se hizo primero
                const vigencia = obtenerEstadoVigencia(res);
                return (
                  <React.Fragment key={res.id}>
                    <ListItem sx={{ py: 2.5, px: 3, '&:hover': { backgroundColor: '#f8fafc' }, transition: 'background-color 0.2s' }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <RoomIcon sx={{ color: '#0f5cb3', fontSize: '1.2rem' }} />
                              <Typography variant="body1" fontWeight="700" color="#1e293b">
                                {res.aula}
                              </Typography>
                            </Box>
                            
                            {/* BADGE DINÁMICO DE ESTADO */}
                            <Chip 
                              label={vigencia.label} 
                              color={vigencia.color}
                              variant={vigencia.variant}
                              size="small" 
                              sx={{ 
                                fontWeight: 'bold', 
                                borderRadius: '6px', 
                                fontSize: '0.7rem',
                                minWidth: 80,
                                // Pequeño ajuste estético para el estado "Finalizada"
                                ...(vigencia.label === 'Finalizada' && { bgcolor: '#e2e8f0', color: '#475569' })
                              }} 
                            />
                          </Stack>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.primary" fontWeight="500">
                              ⏱️ {res.fecha}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              <strong>Recursos del aula:</strong> {res.materiales}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < misReservasHistoricas.length - 1 && <Divider sx={{ borderColor: '#f1f5f9' }} />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

    </Box>
  );
}