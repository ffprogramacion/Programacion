import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, Typography, Box, Divider, List, ListItem, ListItemText, Chip, ButtonBase, Fade, IconButton } from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, AccessTime as TimeIcon, 
  EventAvailable as AvailableIcon, ChevronLeft as LeftIcon, ChevronRight as RightIcon 
} from '@mui/icons-material';

export default function AgendaDisponibilidad({ aulaSeleccionada }) {
  const { reservas } = useAuth();
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [proximosDias, setProximosDias] = useState([]);
  const carruselRef = useRef(null);

  // Generamos 14 días (2 semanas)
  useEffect(() => {
    const dias = [];
    const opciones = { weekday: 'short', day: 'numeric' };
    let hoy = new Date();
    
    for (let i = 0; i < 14; i++) {
      // Sumamos días (el i=0 ya es mañana si sumamos antes, ajustado a hoy)
      const labelVisual = hoy.toLocaleDateString('es-AR', opciones);
      
      const diaStr = String(hoy.getDate()).padStart(2, '0');
      const mesStr = String(hoy.getMonth() + 1).padStart(2, '0');
      const anioStr = hoy.getFullYear();
      
      // Mantenemos tu formato de UI, pero agregamos una clave ISO para la API
      dias.push({ 
        label: labelVisual, 
        fechaId: `${diaStr}/${mesStr}/${anioStr}`, // Formato visual / mock actual
        isoDate: `${anioStr}-${mesStr}-${diaStr}`   // Formato esperado de Django
      });
      
      hoy.setDate(hoy.getDate() + 1);
    }
    setProximosDias(dias);
    if (dias.length > 0) setDiaSeleccionado(dias[0]);
  }, []);

  // 🔄 FILTRO ADAPTADO (Soporta tu mock actual y preparativos para API)
  const reservasDelDia = reservas.filter(res => {
    if (res.aula !== aulaSeleccionada || res.estado !== 'Activa') return false;
    
    // Si tu API devuelve un campo de fecha específico (ej. res.dia_reserva === "2026-06-12")
    if (res.dia_reserva) {
      return res.dia_reserva === diaSeleccionado?.isoDate;
    }
    
    // Fallback a tu lógica de mock actual
    return res.fecha && res.fecha.startsWith(diaSeleccionado?.fechaId);
  });

  const scrollSiguiente = () => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollAnterior = () => {
    if (carruselRef.current) {
      carruselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 4, 
        boxShadow: '0px 8px 30px rgba(0,0,0,0.03)', 
        border: '1px solid #eef2f6',
        background: '#ffffff',
        width: '100%' 
      }}
    >
      <CardContent sx={{ p: 3 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <CalendarIcon sx={{ color: '#0f5cb3', fontSize: '24px' }} />
          <Typography variant="h6" fontWeight="700" sx={{ color: '#1a1a1a', letterSpacing: '-0.3px' }}>
            Agenda de Disponibilidad
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2.5, color: '#64748b' }}>
          Monitoreando: <span style={{ color: '#0f5cb3', fontWeight: '600' }}>{aulaSeleccionada}</span>. Deslizá para auditar fechas futuras.
        </Typography>

        {/* 🎡 CONTENEDOR DEL CARRUSEL CONTROLADO */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, width: '100%' }}>
          
          <IconButton 
            onClick={scrollAnterior}
            sx={{ 
              backgroundColor: '#ffffff', 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              mr: 1,
              flexShrink: 0,
              '&:hover': { backgroundColor: '#f8fafc' }
            }}
            size="small"
          >
            <LeftIcon fontSize="small" />
          </IconButton>

          {/* Caja elástica contenedora - minWidth: 0 evita desbordes en Flexbox */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflow: 'hidden', 
              position: 'relative',
              minWidth: 0 
            }}
          >
            <Box 
              ref={carruselRef}
              sx={{ 
                display: 'flex', 
                gap: 1.2, 
                overflowX: 'auto', 
                scrollBehavior: 'smooth',
                whiteSpace: 'nowrap',
                py: 0.5,
                width: '100%',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {proximosDias.map((dia) => {
                // Cálculo de reservas por día
                const numReservas = reservas.filter(r => {
                  if (r.aula !== aulaSeleccionada || r.estado !== 'Activa') return false;
                  return r.dia_reserva ? r.dia_reserva === dia.isoDate : (r.fecha && r.fecha.startsWith(dia.fechaId));
                }).length;
                
                const isCurrent = diaSeleccionado?.fechaId === dia.fechaId;

                return (
                  <ButtonBase
                    key={dia.fechaId}
                    onClick={() => setDiaSeleccionado(dia)}
                    sx={{
                      flex: '0 0 auto', 
                      width: '78px', 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: isCurrent ? '#0f5cb3' : '#e2e8f0',
                      backgroundColor: isCurrent ? 'rgba(15, 92, 179, 0.04)' : '#ffffff',
                      boxShadow: isCurrent ? '0px 4px 12px rgba(15, 92, 179, 0.08)' : 'none',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': { 
                        backgroundColor: isCurrent ? 'rgba(15, 92, 179, 0.06)' : '#f8fafc',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: '700', color: isCurrent ? '#0f5cb3' : '#94a3b8', fontSize: '0.62rem' }}>
                      {dia.label.split(' ')[0]}
                    </Typography>
                    
                    <Typography variant="h6" fontWeight="800" sx={{ my: 0.2, color: isCurrent ? '#0f5cb3' : '#1e293b', fontSize: '1.15rem' }}>
                      {dia.label.split(' ')[1]}
                    </Typography>
                    
                    {numReservas > 0 ? (
                      <Chip label={`${numReservas} oc.`} size="small" sx={{ height: '16px', fontSize: '0.6rem', fontWeight: '700', backgroundColor: '#fef2f2', color: '#ef4444' }} />
                    ) : (
                      <Chip label="Ok" size="small" sx={{ height: '16px', fontSize: '0.6rem', fontWeight: '700', backgroundColor: '#f0fdf4', color: '#22c55e' }} />
                    )}
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>

          <IconButton 
            onClick={scrollSiguiente}
            sx={{ 
              backgroundColor: '#ffffff', 
              boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              ml: 1,
              flexShrink: 0,
              '&:hover': { backgroundColor: '#f8fafc' }
            }}
            size="small"
          >
            <RightIcon fontSize="small" />
          </IconButton>

        </Box>

        <Divider sx={{ borderColor: '#f1f5f9', mb: 2 }} />

        {/* Detalle con Cronograma */}
        <Box sx={{ bgcolor: '#f8fafc', borderRadius: 4, p: 2.5, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
            <TimeIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> Cronograma del día seleccionado
          </Typography>

          {reservasDelDia.length === 0 ? (
            <Fade in={true}>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <AvailableIcon sx={{ color: '#22c55e', fontSize: 32, mb: 0.5, opacity: 0.8 }} />
                <Typography variant="body2" fontWeight="700" color="#1e293b">Espacio Libre</Typography>
                <Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.5 }}>Sin turnos agendados en esta fecha.</Typography>
              </Box>
            </Fade>
          ) : (
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {reservasDelDia.map((res) => {
                // Extracción segura de la hora (soporta tu mock y formato API básico)
                const horaMostrar = res.hora_inicio ? res.hora_inicio.substring(0, 5) : (res.fecha.includes(' - ') ? res.fecha.split(' - ')[1].replace('de ', '') : 'Turno');
                
                return (
                  <Fade in={true} key={res.id}>
                    <ListItem disablePadding sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2.5, borderLeft: '4px solid #fbc02d', boxShadow: '0px 2px 6px rgba(0,0,0,0.01)', borderTop: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight="700" color="#1e293b">🕒 {horaMostrar} — Ocupado</Typography>}
                        secondary={<Typography variant="caption" color="#64748b" sx={{ display: 'block', mt: 0.3 }}>Docente: {res.solicitante} • Equipos: {res.materiales}</Typography>}
                      />
                    </ListItem>
                  </Fade>
                );
              })}
            </List>
          )}
        </Box>

      </CardContent>
    </Card>
  );
}