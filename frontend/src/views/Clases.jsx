import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add as AddIcon, Group as GroupIcon, Key as KeyIcon } from '@mui/icons-material';

export default function Clases() {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [clases] = useState([
    { id: 1, nombre: 'Álgebra Lineal', profesor: 'Ing. Milton', ubicacion: 'Laboratorio 2', horario: 'Lunes 14:00 a 18:00', alumnosCount: 24 },
    { id: 2, nombre: 'Sistemas Embebidos', profesor: 'Ing. Milton', ubicacion: 'Aula 3', horario: 'Miércoles 09:00 a 13:00', alumnosCount: 18 }
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Asignaturas vigentes</Typography>
        {user.role === 'teacher' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>Crear Asignatura</Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {user.role === 'student' && (
          <Grid item xs={12} md={4}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><KeyIcon color="primary" /> Suscribirse</Typography>
                <TextField fullWidth label="Nombre de Asignatura" variant="outlined" margin="normal" size="small" />
                <TextField fullWidth label="Contraseña" type="password" variant="outlined" margin="normal" size="small" />
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>Unirse</Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={user.role === 'student' ? 8 : 12}>
          <Grid container spacing={2}>
            {clases.map((clase) => (
              <Grid item xs={12} sm={6} key={clase.id}>
                <Card sx={{ borderLeft: '5px solid #1976d2' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="primary">{clase.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}><strong>Profesor:</strong> {clase.profesor}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>Horario:</strong> {clase.horario}</Typography>
                    <Typography variant="body2" color="text.secondary"><strong>Ubicación:</strong> {clase.ubicacion}</Typography>
                    {user.role === 'teacher' && (
                      <Button size="small" startIcon={<GroupIcon />} variant="outlined" sx={{ mt: 2 }}>Alumnos ({clase.alumnosCount})</Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nueva Asignatura</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre de la Materia" variant="outlined" margin="normal" />
          <TextField fullWidth label="Contraseña para Alumnos" type="password" variant="outlined" margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={() => setOpenModal(false)}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}