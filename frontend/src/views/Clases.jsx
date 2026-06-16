import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import { Add as AddIcon, Group as GroupIcon, Key as KeyIcon } from '@mui/icons-material';

export default function Clases() {
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  
  const [clases, setClases] = useState([
    { id: 1, nombre: 'Álgebra Lineal', profesor: 'Ing. Milton', ubicacion: 'Laboratorio de Sistemas 2', horario: 'Lunes 14:00 a 18:00', alumnosCount: 24, clave: 'ALG2026' },
    { id: 2, nombre: 'Sistemas Embebidos', profesor: 'Ing. Milton', ubicacion: 'Aula 3', horario: 'Miércoles 09:00 a 13:00', alumnosCount: 18, clave: 'EMB32' }
  ]);

  const [newClass, setNewClass] = useState({ nombre: '', clave: '', ubicacion: '', horario: '' });

  const handleCreateClass = () => {
    setClases([
      ...clases, 
      { 
        id: clases.length + 1, 
        nombre: newClass.nombre || 'Asignatura Sin Nombre', 
        profesor: user?.name ? user.name : 'Docente Cátedra', 
        ubicacion: newClass.ubicacion || 'Por asignar', 
        horario: newClass.horario || 'Por asignar', 
        alumnosCount: 0, 
        clave: newClass.clave || '1234' 
      }
    ]);
    setOpenCreate(false);
    setNewClass({ nombre: '', clave: '', ubicacion: '', horario: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Asignaturas Universitarias</Typography>
        {user?.role === 'teacher' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenCreate(true)} 
            sx={{ backgroundColor: '#fbc02d', color: '#1a1a1a', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#f9a825' } }}
          >
            Crear Asignatura Cátedra
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {user?.role === 'student' && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><KeyIcon color="primary" /> Suscribirse a Materia</Typography>
                <TextField fullWidth label="Nombre de Asignatura Exacto" margin="normal" size="small" />
                <TextField fullWidth label="Contraseña del Profesor" type="password" margin="normal" size="small" />
                <Button variant="contained" fullWidth sx={{ mt: 2, backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2 }}>Inscribirme a Cursada</Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={user?.role === 'student' ? 8 : 12}>
          <Grid container spacing={2}>
            {clases.map((clase) => (
              <Grid item xs={12} sm={6} key={clase.id}>
                <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2, boxShadow: '0px 4px 15px rgba(0,0,0,0.04)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f5cb3' }}>
                      {clase.nombre || 'Materia'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      <strong>Titular:</strong> {clase.profesor || 'No asignado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Horario Semanal:</strong> {clase.horario || 'No asignado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ubicación Fija:</strong> {clase.ubicacion || 'No asignada'}
                    </Typography>
                    
                    {/* Renderizado Seguro para el Rol de Profesor */}
                    {user?.role === 'teacher' && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button 
                          size="small" 
                          startIcon={<GroupIcon />} 
                          variant="outlined" 
                          onClick={() => setOpenStudents(true)} 
                          sx={{ textTransform: 'none', borderRadius: 1.5 }}
                        >
                          Alumnos ({clase.alumnosCount ?? 0})
                        </Button>
                        <Typography variant="caption" sx={{ my: 'auto', ml: 'auto', bgcolor: '#f5f5f5', p: 0.8, borderRadius: 1, fontFamily: 'monospace' }}>
                          Clave: {clase.clave || 'S/C'}
                        </Typography>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal Crear Asignatura (Teacher) */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">Nueva Comisión de Cátedra</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre de la Materia" margin="normal" value={newClass.nombre} onChange={(e) => setNewClass({...newClass, nombre: e.target.value})} />
          <TextField fullWidth label="Código Clave de Inscripción" margin="normal" value={newClass.clave} onChange={(e) => setNewClass({...newClass, clave: e.target.value})} />
          <TextField fullWidth label="Horarios de Cursado" placeholder="Ej: Jueves 08:00 a 12:00" margin="normal" value={newClass.horario} onChange={(e) => setNewClass({...newClass, horario: e.target.value})} />
          <TextField fullWidth label="Aula Sugerida" margin="normal" value={newClass.ubicacion} onChange={(e) => setNewClass({...newClass, ubicacion: e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateClass} sx={{ backgroundColor: '#0f5cb3' }}>Habilitar Comisión</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Alumnos Inscritos */}
      <Dialog open={openStudents} onClose={() => setOpenStudents(false)} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">Estudiantes Matriculados</DialogTitle>
        <DialogContent>
          <List>
            <ListItem><ListItemText primary="Facundo Boide" secondary="Legajo: UNRAF-4321 - Correo verificado" /></ListItem>
            <Divider />
            <ListItem><ListItemText primary="Juan Pérez" secondary="Legajo: UNRAF-9921 - Correo verificado" /></ListItem>
          </List>
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenStudents(false)}>Cerrar Lista</Button></DialogActions>
      </Dialog>
    </Box>
  );
}