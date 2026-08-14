import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Card, CardContent, Avatar, Grid, Typography, List, ListItem, 
  ListItemText, Divider, Chip, Stack, CircularProgress 
} from '@mui/material';
import { 
  AccountCircle as UserIcon, History as HistoryIcon, Room as RoomIcon, 
  CalendarMonth as CalendarIcon, Badge as BadgeIcon 
} from '@mui/icons-material';
// 🏛️ import api from '../api';

export default function Profile() {
  const { user, reservas } = useAuth();
  const [misReservasHistoricas, setMisReservasHistoricas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 NORMALIZACIÓN DE DATOS DEL USUARIO
  const userName = user?.nombre || user?.first_name || user?.name || 'Usuario Universitario';
  const userRole = (user?.rol || user?.role || 'estudiante').toUpperCase();
  const userInitial = userName.trim()[0].toUpperCase();

  // 1. OBTENER RESERVAS DEL USUARIO
  useEffect(() => {
    const fetchMisReservas = async () => {
      try {
        // --- MODO PRODUCCIÓN DJANGO ---
        // const response = await api.get('/reservas/mis_reservas/');
        // setMisReservasHistoricas(response.data);

        // Mock para desarrollo local:
        const historicas = reservas.filter(res => res.userId === user?.id || res.usuario_id === user?.id);
        setMisReservasHistoricas(historicas);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisReservas();
  }, [reservas, user]);

  // 2. FUNCIÓN DE VIGENCIA ADAPTADA A DJANGO
  const obtenerEstadoVigencia = (reserva) => {
    const estadoStr = (reserva.estado || '').toLowerCase();
    if (estadoStr === 'cancelada') {
      return { label: 'Cancelada', color: 'error', variant: 'outlined' };
    }

    try {
      const ahora = new Date();
      let momentoFinReserva;

      // Intento 1: Formato Real de Django (fecha_reserva + hora_fin)
      if (reserva.fecha_reserva && reserva.hora_fin) {
        // Ensamblamos la fecha y hora estándar ISO (Ej: "2026-06-28T16:00:00")
        momentoFinReserva = new Date(`${reserva.fecha_reserva}T${reserva.hora_fin}`);
      } 
      // Intento 2: Fallback a tu formato Mock local antiguo ("DD/MM/YYYY - de HH:MM a HH:MM hs")
      else if (reserva.fecha && reserva.fecha.includes(' - ')) {
        const [fechaPart, horaPart] = reserva.fecha.split(' - ');
        const [dia, mes, anio] = fechaPart.split('/').map(Number);
        
        const matchHoraFin = horaPart.match(/a\s+(\d{2}):(\d{2})/);
        if (matchHoraFin) {
          const [_, hora, minutos] = matchHoraFin.map(Number);
          momentoFinReserva = new Date(anio, mes - 1, dia, hora, minutos);
        } else {
          momentoFinReserva = ahora; 
        }
      } else {
        return { label: 'Desconocido', color: 'warning', variant: 'outlined' };
      }

      if (ahora > momentoFinReserva) {
        return { label: 'Finalizada', color: 'default', variant: 'filled' };
      } else {
        return { label: 'Activa', color: 'success', variant: 'contained' };
      }
    } catch (e) {
      console.warn("No se pudo calcular la vigencia de la reserva:", reserva.id);
      return { label: 'Activa', color: 'success', variant: 'contained' }; 
    }
  };

  // Función helper para renderizar la fecha visualmente amigable
  const formatearFechaVisual = (res) => {
    if (res.fecha_reserva && res.hora_inicio && res.hora_fin) {
      // Formateamos YYYY-MM-DD a DD/MM/YYYY
      const [anio, mes, dia] = res.fecha_reserva.split('-');
      // Recortamos los segundos de la hora ("14:00:00" -> "14:00")
      const inicio = res.hora_inicio.slice(0, 5);
      const fin = res.hora_fin.slice(0, 5);
      return `${dia}/${mes}/${anio} - de ${inicio} a ${fin} hs`;
    }
    return res.fecha; // Fallback al mock local
  };

  return (
    <Box sx={{ width: '100%' }}>
      
      {/* TARJETA DE PERFIL */}
      <Card sx={{ borderRadius: 4, boxShadow: '0px 10px 30px rgba(15,92,179,0.05)', border: '1px solid #eef2f6', mb: 4, overflow: 'hidden' }}>
        <Box sx={{ height: 120, bgcolor: '#0f5cb3', backgroundImage: 'linear-gradient(120deg, #0f5cb3 0%, #00a896 100%)' }} />
        <CardContent sx={{ p: 4, pt: 0, position: 'relative' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'center', mt: -6 }}>
              <Avatar sx={{ width: 130, height: 130, fontSize: 50, bgcolor: 'white', color: '#0f5cb3', boxShadow: '0px 8px 24px rgba(15,92,179,0.2)', border: '5px solid white', fontWeight: 'bold' }}>
                {userName ? userInitial : <UserIcon fontSize="large" />}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={9} sx={{ mt: { xs: 2, sm: 2 }, textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.5px' }}>{userName}</Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ color: '#64748b', mt: 0.5 }}>Comunidad Académica</Typography>
                </Box>
                <Chip label={`ROL: ${userRole}`} icon={<BadgeIcon sx={{ color: '#0f5cb3 !important' }} />} sx={{ mt: { xs: 2, sm: 0 }, bgcolor: 'rgba(15, 92, 179, 0.08)', color: '#0f5cb3', fontWeight: '700', borderRadius: '10px', px: 1, py: 2.5 }} />
              </Box>
              <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* HISTORIAL DE RESERVAS PERSONALES */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 1 }}>
        <HistoryIcon sx={{ color: '#0f5cb3' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>Mi Historial de Solicitudes Académicas</Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.03)', border: '1px solid #eef2f6', overflow: 'hidden', backgroundColor: 'white', minHeight: 200 }}>
        <CardContent sx={{ p: (loading || misReservasHistoricas.length === 0) ? 4 : 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={30} sx={{ color: '#0f5cb3' }} />
            </Box>
          ) : misReservasHistoricas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CalendarIcon sx={{ fontSize: 44, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body1" fontWeight="600" color="#64748b">No registrás reservas históricas</Typography>
              <Typography variant="caption" color="text.secondary">Las aulas que solicites a futuro aparecerán listadas en esta sección.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {misReservasHistoricas.slice().reverse().map((res, index) => {
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
                                {res.aula_detalle?.nombre || res.aula || 'Aula no especificada'}
                              </Typography>
                            </Box>
                            <Chip 
                              label={vigencia.label} color={vigencia.color} variant={vigencia.variant} size="small" 
                              sx={{ fontWeight: 'bold', borderRadius: '6px', fontSize: '0.7rem', minWidth: 80, ...(vigencia.label === 'Finalizada' && { bgcolor: '#e2e8f0', color: '#475569' }) }} 
                            />
                          </Stack>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.primary" fontWeight="500">
                              ⏱️ {formatearFechaVisual(res)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {/* Toma materiales_nombres del serializador sugerido, o hace fallback */}
                              <strong>Recursos del aula:</strong> {res.materiales_detalle?.length > 0 ? res.materiales_detalle.map(m => m.nombre).join(', ') : 'Ninguno'}
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