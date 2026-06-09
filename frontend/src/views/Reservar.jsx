import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, MenuItem, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { CalendarMonth as CalendarIcon, Info as InfoIcon } from '@mui/icons-material';

export default function Reservar() {
  const { user } = useAuth();
  const [selectedAula, setSelectedAula] = useState('');
  const materialesStock = [
    { id: 'proyector', label: 'Proyector Epson', disponible: 3 },
    { id: 'notebooks', label: 'Kit Netbooks (x10)', disponible: 2 },
    { id: 'cables', label: 'Cables HDMI', disponible: 7 }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Solicitud de Reserva</Typography>
              <TextField fullWidth select label="Selecciona el Aula" value={selectedAula} onChange={(e) => setSelectedAula(e.target.value)} margin="normal">
                <MenuItem value="lab1">Laboratorio de Sistemas 1</MenuItem>
                <MenuItem value="lab2">Laboratorio de Electrónica</MenuItem>
                {user.role === 'teacher' && <MenuItem value="magna">Aula Magna</MenuItem>}
                <MenuItem value="estudio">Sala de Estudio</MenuItem>
              </TextField>
              <TextField fullWidth type="date" label="Fecha" InputLabelProps={{ shrink: true }} margin="normal" />
              <TextField fullWidth type="time" label="Hora Inicio" InputLabelProps={{ shrink: true }} margin="normal" />
              <TextField fullWidth type="time" label="Hora Fin" InputLabelProps={{ shrink: true }} margin="normal" />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Elementos Áulicos (Stock Real):</Typography>
              <FormGroup>
                {materialesStock.map((mat) => (
                  <FormControlLabel key={mat.id} control={<Checkbox />} label={`${mat.label} (${mat.disponible} disp.)`} />
                ))}
              </FormGroup>
              <TextField fullWidth label="Mensaje Adicional" multiline rows={2} margin="normal" />
              <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }}>Confirmar Reserva</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', minHeight: '400px', display: 'flex' }}>
            <CardContent sx={{ m: 'auto', textAlign: 'center' }}>
              <InfoIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" fontWeight="medium">Calendario Semanal</Typography>
              <Typography variant="body2" color="text.secondary">Selecciona un aula para ver los bloques ocupados.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}