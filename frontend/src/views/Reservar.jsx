import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, MenuItem, Checkbox, FormControlLabel, FormGroup, TextField, Button, Stack, CircularProgress } from '@mui/material';
import { AssignmentTurnedIn as DoneIcon, Layers as LayersIcon } from '@mui/icons-material';
import AgendaDisponibilidad from '../components/AgendaDisponibilidad';
// 🏛️ import api from '../api';

export default function Reservar() {
  const { user, agregarReserva, aulas, clases, inventario, consumirRecursos } = useAuth();
  const navigate = useNavigate();

  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState(''); 
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalizamos roles
  const userRole = (user?.rol || user?.role || '').toLowerCase();
  const isTeacher = userRole === 'teacher' || userRole === 'profesor' || userRole === 'docente';
  const isStudent = userRole === 'student' || userRole === 'estudiante';

  if (!aulas || aulas.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <CircularProgress size={40} sx={{ color: '#0f5cb3', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" fontWeight="500">Cargando inventario de espacios...</Typography>
      </Box>
    );
  }

  // Filtramos las clases dictadas únicamente por el profesor logueado
  const misMateriasComoDocente = clases?.filter(c => c.profesorId === user?.id || c.profesor_id === user?.id) || [];

  const handleCheckboxChange = (id) => {
    setMaterialesSeleccionados((prev) => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleConfirmar = async (e) => {
    e.preventDefault();
    if (!aulaSeleccionada || !fecha || !horaInicio || !horaFin) {
      alert("Por favor completa todos los campos principales (Aula, Fecha, Hora Inicio y Hora Fin)");
      return;
    }

    if (horaInicio >= horaFin) {
      alert("La hora de finalización debe ser posterior a la hora de inicio.");
      return;
    }

    if (isTeacher && !materiaSeleccionada) {
      alert("Por favor selecciona a qué cátedra corresponde esta reserva.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Preparamos el payload estándar para Django REST Framework
      // Usamos el ID del aula seleccionada en lugar del nombre
      const aulaObj = aulas.find(a => a.nombre === aulaSeleccionada || a.id === aulaSeleccionada);
      
      const payloadBackend = {
        aula_id: aulaObj?.id, 
        fecha_reserva: fecha, // YYYY-MM-DD
        hora_inicio: horaInicio, // HH:MM
        hora_fin: horaFin, // HH:MM
        comision_id: isTeacher ? Number(materiaSeleccionada) : null, // Mapea con 'comision' en Django
        materiales: materialesSeleccionados // Array de enteros para ManyToMany en Django
      };

      // --- MODO PRODUCCIÓN DJANGO ---
      // El backend recibe esto y:
      // A) Verifica disponibilidad. Si choca, devuelve 400.
      // B) Resta el stock automáticamente en una transacción atómica.
      // C) Guarda la reserva.
      
      // const response = await api.post('/reservas/', payloadBackend);
      // const nuevaReservaDB = response.data;

      // Mock para mantener la UI funcional localmente mientras conectas la API:
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulamos latencia de red
      
      // Formateo visual antiguo para compatibilidad con el Context local
      const fechaFormateada = fecha.split('-').reverse().join('/');
      const nombresMateriales = inventario
        .filter(item => materialesSeleccionados.includes(item.id))
        .map(item => item.nombre).join(', ') || 'Ninguno';

      const nuevaReservaMock = {
        aula: aulaSeleccionada, 
        solicitante: user?.nombre || user?.name || 'Usuario',
        fecha: `${fechaFormateada} - de ${horaInicio} a ${horaFin} hs`, 
        materiales: nombresMateriales,
        userId: user?.id,
        claseId: isTeacher ? Number(materiaSeleccionada) : null,
        estado: 'Activa'
      };

      agregarReserva(nuevaReservaMock);
      consumirRecursos(materialesSeleccionados);

      navigate('/reservas');

    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      // 🚀 Captura inteligente de errores del backend (Ej: Choque de horarios)
      if (error.response?.status === 400 && error.response?.data?.detail) {
        alert(`🚨 Error: ${error.response.data.detail}`); // Ej: "El aula ya está reservada en ese horario"
      } else {
        alert("Hubo un error de conexión al intentar confirmar la reserva.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
              
              <TextField 
                fullWidth select 
                label="Selecciona el Aula" 
                value={aulaSeleccionada} 
                onChange={(e) => setAulaSeleccionada(e.target.value)} 
                margin="dense" required 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              >
                {aulas
                  .filter(aula => !(aula.nombre === 'Aula Magna' && isStudent))
                  .map((aula) => <MenuItem key={aula.id} value={aula.nombre}>{aula.nombre}</MenuItem>)
                }
              </TextField>

              {isTeacher && (
                <TextField 
                  fullWidth select 
                  label="Asignar a Cátedra" 
                  value={materiaSeleccionada} 
                  onChange={(e) => setMateriaSeleccionada(e.target.value)} 
                  margin="dense" required 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 }, mt: 2 }}
                >
                  {misMateriasComoDocente.map((clase) => (
                    <MenuItem key={clase.id} value={clase.id}>{clase.nombre}</MenuItem>
                  ))}
                </TextField>
              )}

              <TextField 
                fullWidth type="date" label="Fecha de la reserva" 
                value={fecha} onChange={(e) => setFecha(e.target.value)} 
                InputLabelProps={{ shrink: true }} margin="dense" required 
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
              
              <FormGroup>
                {/* 🚀 Se reemplazó uniqueId por id */}
                {inventario.map(item => (
                  <FormControlLabel 
                    key={item.id}
                    control={
                      <Checkbox 
                        checked={materialesSeleccionados.includes(item.id)} 
                        onChange={() => handleCheckboxChange(item.id)} 
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

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <DoneIcon />} 
                disabled={isSubmitting}
                sx={{ 
                  mt: 3, textTransform: 'none', borderRadius: 2.5, backgroundColor: '#0f5cb3', 
                  fontWeight: '700', py: 1.2, '&:hover': { backgroundColor: '#0c4d96' } 
                }}
              >
                {isSubmitting ? 'Procesando Solicitud...' : 'Confirmar Espacio'}
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