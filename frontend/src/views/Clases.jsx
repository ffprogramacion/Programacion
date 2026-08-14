import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import { Add as AddIcon, Group as GroupIcon, Key as KeyIcon, ArrowBack as BackIcon, EventAvailable as AvailableIcon } from '@mui/icons-material';
// import api from '../api';

export default function Clases() {
  const { user, clases, setClases, suscripciones, setSuscripciones, reservas } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [claseActiva, setClaseActiva] = useState(null);

  const [searchMateria, setSearchMateria] = useState('');
  const [searchClave, setSearchClave] = useState('');
  const [newClass, setNewClass] = useState({ nombre: '', clave: '', ubicacion: '', horario: '' });

  // 🚀 NORMALIZACIÓN DE ROLES
  const userRole = (user?.rol || user?.role || '').toLowerCase();
  const isTeacher = userRole === 'teacher' || userRole === 'profesor' || userRole === 'docente';
  const isStudent = userRole === 'student' || userRole === 'estudiante';

  // 1. FILTRADO MULTI-ROL (Fallback local - Idealmente el backend ya te devuelve solo las tuyas)
  let misClasesVisuales = [];
  if (isTeacher) {
    misClasesVisuales = clases.filter(c => c.profesorId === user?.id || c.profesor_id === user?.id);
  } else if (isStudent) {
    const misIdsSuscritos = suscripciones.filter(s => s.alumnoId === user?.id || s.alumno_id === user?.id).map(s => s.claseId || s.clase_id);
    misClasesVisuales = clases.filter(c => misIdsSuscritos.includes(c.id));
  }

  // 🚀 CREACIÓN DE MATERIA (PROFESOR)
  const handleCreateClass = async () => {
    try {
      const payloadBackend = {
        nombre: newClass.nombre,
        clave: newClass.clave, 
        ubicacion: newClass.ubicacion,
        horario: newClass.horario,
        // profesor_id: user.id -> Django normalmente lo infiere del Token JWT, no hace falta enviarlo
      };

      // --- MODO PRODUCCIÓN DJANGO ---
      // const response = await api.post('/clases/', payloadBackend);
      // const nuevaMateriaDB = response.data;
      
      // Mock para mantener la UI funcional:
      const nuevaMateriaDB = { 
        id: clases.length + 1, 
        ...payloadBackend,
        profesor: user?.nombre || user?.name || 'Docente Cátedra', 
        alumnosCount: 0 
      };

      setClases([...clases, nuevaMateriaDB]);
      setOpenCreate(false);
      setNewClass({ nombre: '', clave: '', ubicacion: '', horario: '' });
    } catch (error) {
      console.error("Error al crear asignatura:", error);
      alert("Hubo un error al crear la materia en el servidor.");
    }
  };

  // INSCRIPCIÓN DE ALUMNO (ESTUDIANTE)
  const handleInscribirse = async () => {
    if (!searchMateria) {
      alert("Por favor, ingresa el nombre de la materia.");
      return;
    }

    try {
      // --- MODO PRODUCCIÓN DJANGO ---
      // Apuntamos al endpoint exacto que generó tu router
      const response = await api.post('academia/comisiones/inscribirse/', { 
        nombre: searchMateria 
      });

      const dataInscripcion = response.data; // Django devuelve un mensaje de éxito y los datos

      // Actualizamos la interfaz para que el alumno vea la materia inmediatamente
      alert(`Éxito: ${dataInscripcion.detail}`);
      
      // Opcional: Aquí podrías disparar un "fetchMisReservas" o recargar 
      // las clases llamando de nuevo a la API para tener los datos súper frescos.
      
      setSearchMateria('');
      setSearchClave('');
    } catch (error) {
      console.error("Error en inscripción:", error);
      // Capturamos los errores que mandamos desde Django (ej: "Ya estás inscrito")
      alert(error.response?.data?.detail || "🚨 Error al intentar inscribirse. Verifica el nombre.");
    }
  };

  // DETALLE INTERNO DEL AULA DE CÁTEDRA
  if (claseActiva) {
    // Soportamos camelCase (React) y snake_case (Django)
    const reservasDeEstaMateria = reservas.filter(r => (r.claseId === claseActiva.id || r.clase_id === claseActiva.id) && r.estado === 'Activa');

    return (
      <Box>
        <Button startIcon={<BackIcon />} onClick={() => setClaseActiva(null)} sx={{ mb: 3, textTransform: 'none', fontWeight: 'bold' }}>
          Volver a mis asignaturas
        </Button>

        <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2, mb: 4, boxShadow: '0px 4px 15px rgba(0,0,0,0.04)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#0f5cb3' }}>{claseActiva.nombre}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Titular de Cátedra:</strong> {claseActiva.profesor || 'Asignado'} • <strong>Horario Fijo:</strong> {claseActiva.horario}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🗓️ Cronograma de Espacios Reservados
        </Typography>

        <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: reservasDeEstaMateria.length === 0 ? 4 : 0 }}>
            {reservasDeEstaMateria.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <AvailableIcon sx={{ fontSize: 48, color: '#22c55e', mb: 1, opacity: 0.7 }} />
                <Typography variant="body1" fontWeight="bold" color="#334155">Sin reservas activas</Typography>
                <Typography variant="caption" color="text.secondary">Esta asignatura no registra reservas de aulas físicas.</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {reservasDeEstaMateria.map((res, index) => (
                  <React.Fragment key={res.id}>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemText 
                        primary={<Typography variant="body1" fontWeight="700" color="#0f5cb3">📍 {res.aula || res.aula_nombre}</Typography>}
                        secondary={
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            <strong>Cronograma Asignado:</strong> {res.fecha} <br />
                            <strong>Recursos solicitados:</strong> {res.materiales || 'Ninguno'}
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
        {isTeacher && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setOpenCreate(true)} 
            disableElevation
            sx={{ backgroundColor: '#fbc02d', color: '#1a1a1a', fontWeight: 'bold', textTransform: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#f9a825' } }}
          >
            Crear Asignatura Cátedra
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Panel de suscripción interactivo para Alumnos */}
        {isStudent && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><KeyIcon color="primary" /> Suscribirse a Materia</Typography>
                <TextField fullWidth label="Nombre de Asignatura Exacto" margin="normal" size="small" value={searchMateria} onChange={(e) => setSearchMateria(e.target.value)} placeholder="Ej: Sistemas Embebidos" />
                <TextField fullWidth label="Contraseña del Profesor" type="password" margin="normal" size="small" value={searchClave} onChange={(e) => setSearchClave(e.target.value)} />
                <Button variant="contained" fullWidth onClick={handleInscribirse} disableElevation sx={{ mt: 2, backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2 }}>Inscribirme a Cursada</Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Listado Simétrico de Tarjetas */}
        <Grid item xs={12} md={isStudent ? 8 : 12}>
          <Grid container spacing={2}>
            {misClasesVisuales.map((clase) => (
              <Grid item xs={12} sm={6} key={clase.id}>
                <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2, boxShadow: '0px 4px 15px rgba(0,0,0,0.04)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f5cb3' }}>
                      {clase.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                      <strong>Titular:</strong> {clase.profesor || 'Asignado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Horario Semanal:</strong> {clase.horario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ubicación Fija:</strong> {clase.ubicacion}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                      {isTeacher ? (
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
                        disableElevation
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
      {openCreate && (
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
            <Button variant="contained" disableElevation onClick={handleCreateClass} sx={{ backgroundColor: '#0f5cb3' }}>Habilitar Comisión</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Modal Alumnos */}
      {openStudents && (
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
      )}
    </Box>
  );
}