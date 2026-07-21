import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import { Add as AddIcon, Group as GroupIcon, Key as KeyIcon, ArrowBack as BackIcon, EventAvailable as AvailableIcon } from '@mui/icons-material';

export default function Clases() {
  const { user, clases, setClases, suscripciones, setSuscripciones, reservas } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [claseActiva, setClaseActiva] = useState(null); // 🔥 Estado para entrar a la materia

  // Campos de suscripción del alumno
  const [searchMateria, setSearchMateria] = useState('');
  const [searchClave, setSearchClave] = useState('');
  const [newClass, setNewClass] = useState({ nombre: '', clave: '', ubicacion: '', horario: '' });

  // 1. FILTRADO MULTI-ROL EN CALIENTE
  let misClasesVisuales = [];
  if (user?.role === 'teacher') {
    // Profesor: Solo ve las que le pertenecen por ID
    misClasesVisuales = clases.filter(c => c.profesorId === user?.id);
  } else if (user?.role === 'student') {
    // Alumno: Ve las materias a las que se suscribió
    const misIdsSuscritos = suscripciones.filter(s => s.alumnoId === user?.id).map(s => s.claseId);
    misClasesVisuales = clases.filter(c => misIdsSuscritos.includes(c.id));
  }

  const handleCreateClass = () => {
    const nuevaMateria = { 
      id: clases.length + 1, 
      nombre: newClass.nombre || 'Asignatura Sin Nombre', 
      profesorId: user?.id || 'prof-1',
      profesor: user?.name || 'Docente Cátedra', 
      ubicacion: newClass.ubicacion || 'Por asignar', 
      horario: newClass.horario || 'Por asignar', 
      alumnosCount: 0, 
      clave: newClass.clave || '1234' 
    };
    setClases([...clases, nuevaMateria]);
    setOpenCreate(false);
    setNewClass({ nombre: '', clave: '', ubicacion: '', horario: '' });
  };

  const handleInscribirse = () => {
    // Busca si existe una materia con ese nombre exacto y contraseña
    const materiaEncontrada = clases.find(c => c.nombre.toLowerCase().trim() === searchMateria.toLowerCase().trim() && c.clave === searchClave);
    
    if (!materiaEncontrada) {
      alert("🚨 Datos inválidos. Verificá el nombre exacto y la clave del profesor.");
      return;
    }

    // Verificar si ya está suscrito
    if (suscripciones.some(s => s.alumnoId === user?.id && s.claseId === materiaEncontrada.id)) {
      alert("Ya estás inscrito en esta asignatura.");
      return;
    }

    const nuevaSuscripcion = {
      id: Date.now(),
      alumnoId: user?.id,
      claseId: materiaEncontrada.id
    };

    setSuscripciones([...suscripciones, nuevaSuscripcion]);
    
    // Sumamos un alumno al contador visual de la materia
    setClases(clases.map(c => c.id === materiaEncontrada.id ? { ...c, alumnosCount: (c.alumnosCount || 0) + 1 } : c));
    
    alert(`🎉 Éxito: Te inscribiste a ${materiaEncontrada.nombre}`);
    setSearchMateria('');
    setSearchClave('');
  };

  // 🏛️ DETALLE INTERNO DEL AULA DE CÁTEDRA
  if (claseActiva) {
    const reservasDeEstaMateria = reservas.filter(r => r.claseId === claseActiva.id && r.estado === 'Activa');

    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => setClaseActiva(null)} sx={{ mb: 3, textTransform: 'none', fontWeight: 'bold' }}>
          Volver a mis asignaturas
        </Button>

        <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2, mb: 4, boxShadow: '0px 4px 15px rgba(0,0,0,0.04)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#0f5cb3' }}>{claseActiva.nombre}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Titular de Cátedra:</strong> {claseActiva.profesor} • <strong>Horario Fijo:</strong> {claseActiva.horario}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🗓️ Cronograma de Espacios Reservados por Cátedra
        </Typography>

        <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: reservasDeEstaMateria.length === 0 ? 4 : 0 }}>
            {reservasDeEstaMateria.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <AvailableIcon sx={{ fontSize: 48, color: '#22c55e', mb: 1, opacity: 0.7 }} />
                <Typography variant="body1" fontWeight="bold" color="#334155">Sin reservas activas</Typography>
                <Typography variant="caption" color="text.secondary">Esta asignatura no registra reservas de aulas físicas en el sistema.</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {reservasDeEstaMateria.map((res, index) => (
                  <React.Fragment key={res.id}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemText 
                        primary={<Typography variant="body1" fontWeight="700" color="#0f5cb3">📍 {res.aula}</Typography>}
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            <strong>Cronograma Asignado:</strong> {res.fecha} <br />
                            <strong>Recursos solicitados:</strong> {res.materiales}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < reservasDeEstaMateria.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

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
        {/* Panel de suscripción interactivo para Alumnos */}
        {user?.role === 'student' && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><KeyIcon color="primary" /> Suscribirse a Materia</Typography>
                <TextField fullWidth label="Nombre de Asignatura Exacto" margin="normal" size="small" value={searchMateria} onChange={(e) => setSearchMateria(e.target.value)} placeholder="Ej: Sistemas Embebidos" />
                <TextField fullWidth label="Contraseña del Profesor" type="password" margin="normal" size="small" value={searchClave} onChange={(e) => setSearchClave(e.target.value)} placeholder="Ej: EMB32" />
                <Button variant="contained" fullWidth onClick={handleInscribirse} sx={{ mt: 2, backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2 }}>Inscribirme a Cursada</Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Listado Simétrico de Tarjetas */}
        <Grid item xs={12} md={user?.role === 'student' ? 8 : 12}>
          <Grid container spacing={2}>
            {misClasesVisuales.map((clase) => (
              <Grid item xs={12} sm={6} key={clase.id}>
                <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2, boxShadow: '0px 4px 15px rgba(0,0,0,0.04)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f5cb3' }}>
                      {clase.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      <strong>Titular:</strong> {clase.profesor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Horario Semanal:</strong> {clase.horario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ubicación Fija:</strong> {clase.ubicacion}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                      {user?.role === 'teacher' ? (
                        <Button 
                          size="small" 
                          startIcon={<GroupIcon />} 
                          variant="outlined" 
                          onClick={(e) => { e.stopPropagation(); setOpenStudents(true); }} 
                          sx={{ textTransform: 'none', borderRadius: 1.5 }}
                        >
                          Alumnos ({clase.alumnosCount ?? 0})
                        </Button>
                      ) : <Box />}
                      
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => setClaseActiva(clase)}
                        sx={{ textTransform: 'none', borderRadius: 1.5, backgroundColor: '#0f5cb3' }}
                      >
                        Ingresar al Aula
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Modal Crear Asignatura */}
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

      {/* Modal Alumnos */}
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