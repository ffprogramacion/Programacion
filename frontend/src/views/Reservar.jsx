import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, MenuItem, Checkbox, FormControlLabel, FormGroup, TextField, Button } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

export default function Reservar() {
  const { user, agregarReserva, aulas } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [materiales, setMateriales] = useState({ proyector: false, notebooks: false, cables: false });

  // 🌟 CONTROL DE SEGURIDAD MÁXIMO: Si por alguna razón 'aulas' viene vacío o indefinido, 
  // evitamos que la app tire pantalla en blanco mostrando un aviso elegante.
  if (!aulas || aulas.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Cargando inventario de espacios físicos...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Si tarda demasiado, inicia sesión como Admin y registra un aula en "Gestión de Aulas".
        </Typography>
      </Box>
    );
  }

  const handleCheckboxChange = (e) => {
    setMateriales({ ...materiales, [e.target.name]: e.target.checked });
  };

  const handleConfirmar = (e) => {
    e.preventDefault();
    if (!aulaSeleccionada || !fecha || !horaInicio) {
      alert("Por favor completa los campos principales (Aula, Fecha y Hora)");
      return;
    }

    const listaMateriales = Object.keys(materiales)
      .filter(key => materiales[key])
      .map(key => key === 'proyector' ? 'Proyector' : key === 'notebooks' ? 'Kit Netbooks' : 'Cables')
      .join(', ') || 'Ninguno';

    const nuevaReserva = {
      aula: aulaSeleccionada, 
      solicitante: user?.name || 'Usuario',
      fecha: `${fecha.split('-').reverse().join('/')} - ${horaInicio} hs`, 
      materiales: listaMateriales,
      userId: user?.id || '12345'
    };

    agregarReserva(nuevaReserva);
    navigate('/reservas');
  };

  return (
    <Box component="form" onSubmit={handleConfirmar}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Solicitud de Reserva</Typography>
              
              <TextField 
                fullWidth 
                select 
                label="Selecciona el Aula" 
                value={aulaSeleccionada} 
                onChange={(e) => setAulaSeleccionada(e.target.value)} 
                margin="normal" 
                required
              >
                {aulas
                  .filter(aula => aula && !(aula.nombre === 'Aula Magna' && user?.role === 'student'))
                  .map((aula) => (
                    <MenuItem key={aula.id} value={aula.nombre}>
                      {aula.nombre} ({aula.tipo || 'Común'})
                    </MenuItem>
                  ))
                }
              </TextField>

              <TextField fullWidth type="date" label="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} margin="normal" required />
              <TextField fullWidth type="time" label="Hora Inicio" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} InputLabelProps={{ shrink: true }} margin="normal" required />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>Elementos Adicionales:</Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={materiales.proyector} onChange={handleCheckboxChange} name="proyector" />} label="Proyector Epson (3 disp.)" />
                <FormControlLabel control={<Checkbox checked={materiales.notebooks} onChange={handleCheckboxChange} name="notebooks" />} label="Kit Netbooks (2 disp.)" />
                <FormControlLabel control={<Checkbox checked={materiales.cables} onChange={handleCheckboxChange} name="cables" />} label="Cables HDMI (7 disp.)" />
              </FormGroup>

              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 3, textTransform: 'none', borderRadius: 2, backgroundColor: '#0f5cb3' }}>
                Confirmar Reserva
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', minHeight: '400px', display: 'flex', borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ m: 'auto', textAlign: 'center' }}>
              <InfoIcon color="action" sx={{ fontSize: 40, mb: 1, color: '#0f5cb3' }} />
              <Typography variant="body1" fontWeight="medium">Calendario Semanal Interactivo</Typography>
              <Typography variant="body2" color="text.secondary">Selecciona los parámetros de la izquierda para mapear disponibilidad.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}