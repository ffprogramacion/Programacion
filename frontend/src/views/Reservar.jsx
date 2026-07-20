import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, MenuItem, Checkbox, FormControlLabel, FormGroup, TextField, Button, Stack } from '@mui/material';
import { AssignmentTurnedIn as DoneIcon, Layers as LayersIcon } from '@mui/icons-material';
import AgendaDisponibilidad from '../components/AgendaDisponibilidad';

export default function Reservar() {
  // 🔥 Importamos inventario y la función de reducción
  const { user, agregarReserva, aulas, clases, reservas, inventario, consumirRecursos } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [aulaSeleccionada, setAulaSeleccionada] = useState('Laboratorio de Sistemas 1');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState(''); 
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  // 🔥 Estado actualizado: Almacena los identificadores únicos (uniqueId) de los materiales elegidos
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);

  if (!aulas || aulas.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary" fontWeight="500">Cargando inventario de espacios...</Typography>
      </Box>
    );
  }

  // Filtramos las clases dictadas únicamente por el profesor logueado
  const misMateriasComoDocente = clases.filter(c => c.profesorId === user?.id);

  // 🔥 Función para agregar o quitar el ID del arreglo local
  const handleCheckboxChange = (uniqueId) => {
    setMaterialesSeleccionados((prev) => 
      prev.includes(uniqueId) 
        ? prev.filter(id => id !== uniqueId) 
        : [...prev, uniqueId]
    );
  };

  const handleConfirmar = (e) => {
    e.preventDefault();
    if (!aulaSeleccionada || !fecha || !horaInicio || !horaFin) {
      alert("Por favor completa todos los campos principales (Aula, Fecha, Hora Inicio y Hora Fin)");
      return;
    }

    if (horaInicio >= horaFin) {
      alert("La hora de finalización debe ser posterior a la hora de inicio.");
      return;
    }

    if (user?.role === 'teacher' && !materiaSeleccionada) {
      alert("Por favor selecciona a qué cátedra corresponde esta reserva.");
      return;
    }

    const fechaFormateada = fecha.split('-').reverse().join('/');

    // 🛑 VALIDACIÓN DE SUPERPOSICIÓN HORARIA
    const hayChoque = reservas.some(reserva => {
      if (reserva.aula !== aulaSeleccionada || reserva.estado === 'Cancelada') return false;
      const fechaReservaVieja = reserva.fecha.split(' - ')[0];
      if (fechaReservaVieja !== fechaFormateada) return false;

      const matchHoras = reserva.fecha.match(/de\s+(\d{2}:\d{2})\s+a\s+(\d{2}:\d{2})/);
      if (!matchHoras) return false;
      const [_, viejaInicio, viejaFin] = matchHoras;

      const aMinutos = (hStr) => {
        const [h, m] = hStr.split(':').map(Number);
        return h * 60 + m;
      };

      return aMinutos(horaInicio) < aMinutos(viejaFin) && aMinutos(horaFin) > aMinutos(viejaInicio);
    });

    if (hayChoque) {
      alert(`🚨 Error: El espacio ya está ocupado en ese rango horario para el día ${fechaFormateada}.`);
      return;
    }

    // 🔥 Obtener los nombres exactos basándose en los ID seleccionados
    const listaMateriales = inventario
      .filter(item => materialesSeleccionados.includes(item.uniqueId))
      .map(item => item.nombre)
      .join(', ') || 'Ninguno';

    const nuevaReserva = {
      aula: aulaSeleccionada, 
      solicitante: user?.name || 'Usuario',
      fecha: `${fechaFormateada} - de ${horaInicio} a ${horaFin} hs`, 
      materiales: listaMateriales,
      userId: user?.id || '12345',
      claseId: user?.role === 'teacher' ? Number(materiaSeleccionada) : null
    };

    agregarReserva(nuevaReserva);
    
    // 🔥 Descontar las unidades seleccionadas del stock global
    consumirRecursos(materialesSeleccionados);

    navigate('/reservas');
  };

  return (
    <Box component="form" onSubmit={handleConfirmar} sx={{ width: '100%', boxSizing: 'border-box', px: 0, overflow: 'hidden' }}>
      <Grid container spacing={3} sx={{ width: '100%', margin: 0, boxSizing: 'border-box', '& > .MuiGrid-item': { pt: '0px !important' } }}>
        
        {/* COLUMNA FORMULARIO DE RESERVA */}
        <Grid item xs={12} md={4} sx={{ pl: '0px !important' }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 30px rgba(0,0,0,0.03)', border: '1px solid #eef2f6', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <LayersIcon sx={{ color: '#0f5cb3', fontSize: '24px' }} />
                <Typography variant="h6" fontWeight="700" sx={{ color: '#1a1a1a' }}>Solicitud de Reserva</Typography>
              </Box>
              
              <TextField fullWidth select label="Selecciona el Aula" value={aulaSeleccionada} onChange={(e) => setAulaSeleccionada(e.target.value)} margin="dense" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}>
                {aulas
                  .filter(aula => !(aula.nombre === 'Aula Magna' && user?.role === 'student'))
                  .map((aula) => <MenuItem key={aula.id} value={aula.nombre}>{aula.nombre}</MenuItem>)
                }
              </TextField>

              {user?.role === 'teacher' && (
                <TextField fullWidth select label="Asignar a Cátedra" value={materiaSeleccionada} onChange={(e) => setMateriaSeleccionada(e.target.value)} margin="dense" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 }, mt: 2 }}>
                  {misMateriasComoDocente.map((clase) => (
                    <MenuItem key={clase.id} value={clase.id}>{clase.nombre}</MenuItem>
                  ))}
                </TextField>
              )}

              <TextField 
                fullWidth 
                type="date" 
                label="Fecha de la reserva" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                InputLabelProps={{ shrink: true }} 
                margin="dense" 
                required 
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2.5 }, mt: 2,
                  '& input::-webkit-calendar-picker-indicator': { cursor: 'pointer', p: 0.5, borderRadius: '50%', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }
                }} 
              />

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <TextField fullWidth type="time" label="Desde" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} InputLabelProps={{ shrink: true }} margin="dense" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
                <TextField fullWidth type="time" label="Hasta" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} InputLabelProps={{ shrink: true }} margin="dense" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              </Stack>

              <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1, fontWeight: '700', color: '#475569', fontSize: '0.8rem' }}>RECURSOS ADICIONALES:</Typography>
              
              {/* 🔥 RENDERIZADO DINÁMICO DEL INVENTARIO */}
              <FormGroup>
                {inventario.map(item => (
                  <FormControlLabel 
                    key={item.uniqueId}
                    control={
                      <Checkbox 
                        checked={materialesSeleccionados.includes(item.uniqueId)} 
                        onChange={() => handleCheckboxChange(item.uniqueId)} 
                        disabled={item.stock === 0} 
                        sx={{ '&.Mui-checked': { color: item.color || '#0f5cb3' } }} 
                      />
                    } 
                    label={
                      <Typography variant="body2" fontWeight="500" color={item.stock === 0 ? 'text.disabled' : 'text.primary'}>
                        {item.nombre} {item.stock === 0 ? '(Sin stock)' : `(${item.stock} disponibles)`}
                      </Typography>
                    } 
                  />
                ))}
              </FormGroup>

              <Button type="submit" variant="contained" fullWidth startIcon={<DoneIcon />} sx={{ mt: 3, textTransform: 'none', borderRadius: 2.5, backgroundColor: '#0f5cb3', fontWeight: '700', py: 1.2, '&:hover': { backgroundColor: '#0c4d96' } }}>
                Confirmar Espacio
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA CALENDARIO */}
        <Grid item xs={12} md={8} sx={{ pr: '0px !important', pl: { xs: '0px !important', md: '24px !important' } }}>
          <AgendaDisponibilidad aulaSeleccionada={aulaSeleccionada} />
        </Grid>

      </Grid>
    </Box>
  );
}