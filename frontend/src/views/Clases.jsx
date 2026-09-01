import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Grid, Card, CardContent, Typography, Button, TextField, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, 
  ListItemText, Divider, Stack, MenuItem, Chip, Tabs, Tab
} from '@mui/material';
import { 
  Add as AddIcon, Group as GroupIcon, Key as KeyIcon, 
  MenuBook as BookIcon, School as SchoolIcon, AccountBalance as AdminIcon
} from '@mui/icons-material';
import api from '../service/api.js';

export default function Clases() {
  const { user } = useAuth();
  
  // Estados para almacenar los datos de la nueva estructura
  const [materias, setMaterias] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  
  // Estados de Modales
  const [openCreateMateria, setOpenCreateMateria] = useState(false);
  const [openCreateComision, setOpenCreateComision] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [comisionActiva, setComisionActiva] = useState(null); // Para ver alumnos

  // Estados de Formularios
  const [newMateria, setNewMateria] = useState({ nombre: '', carrera_id: 1, ano: 1, cuatrimestre: 1 });
  const [newComision, setNewComision] = useState({ materia_id: '', nombre: '', profesor_id: '', dia_semana: 'Lunes', hora_inicio: '', hora_fin: '', aula: '', clave: '' });
  
  // Estado para Estudiantes
  const [inscripcionData, setInscripcionData] = useState({ comision_id: '', clave: '' });
  const [tabEstudiante, setTabEstudiante] = useState(0);

  // Normalización de Roles
  const userRole = (user?.profile?.rol || user?.rol || user?.role || 'student').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'administrador';
  const isTeacher = userRole === 'teacher' || userRole === 'profesor' || userRole === 'docente';
  const isStudent = userRole === 'student' || userRole === 'estudiante';

  // Carga de datos al montar la pantalla
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaterias, resComisiones] = await Promise.all([
          api.get('academia/materias/'),
          api.get('academia/comisiones/')
        ]);
        setMaterias(resMaterias.data.results || resMaterias.data || []);
        setComisiones(resComisiones.data.results || resComisiones.data || []);
      } catch (error) {
        console.error("Error al cargar la estructura académica:", error);
      }
    };
    fetchData();
  }, []);

  // ----------------------------------------------------
  // FUNCIONES DE ADMINISTRADOR
  // ----------------------------------------------------
  const handleCreateMateria = async () => {
    try {
      const response = await api.post('academia/materias/', newMateria);
      setMaterias([...materias, response.data]);
      setOpenCreateMateria(false);
      setNewMateria({ nombre: '', carrera_id: 1, ano: 1, cuatrimestre: 1 });
    } catch (error) {
      alert("Error al crear la materia estructural.");
    }
  };

  const handleCreateComision = async () => {
    try {
      const response = await api.post('academia/comisiones/', newComision);
      setComisiones([...comisiones, response.data]);
      setOpenCreateComision(false);
    } catch (error) {
      alert("Error al crear la comisión y asignar profesor.");
    }
  };

  // ----------------------------------------------------
  // FUNCIONES DE ESTUDIANTE
  // ----------------------------------------------------
  const handleInscribirse = async (comisionId) => {
    if (!inscripcionData.clave) {
      alert("Debes ingresar la contraseña proporcionada por el docente.");
      return;
    }
    try {
      await api.post(`academia/comisiones/${comisionId}/inscribirse/`, {
        alumno_id: user.id,
        clave: inscripcionData.clave
      });
      alert("¡Inscripción exitosa!");
      setInscripcionData({ comision_id: '', clave: '' });
      // Recargar comisiones para actualizar la lista de inscriptos
      const res = await api.get('academia/comisiones/');
      setComisiones(res.data.results || res.data);
    } catch (error) {
      alert(error.response?.data?.detail || "Error en la inscripción. Verifica la clave.");
    }
  };

  // ----------------------------------------------------
  // FILTRADO DE VISTAS POR ROL
  // ----------------------------------------------------
  const misComisionesDocente = comisiones.filter(c => c.profesor === user?.id || c.profesor_id === user?.id);
  const misComisionesEstudiante = comisiones.filter(c => c.alumnos?.includes(user?.id));
  const comisionesDisponibles = comisiones.filter(c => !c.alumnos?.includes(user?.id));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" /> Gestión Académica
        </Typography>
        
        {isAdmin && (
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<BookIcon />} onClick={() => setOpenCreateMateria(true)}>
              Nueva Materia (Plan)
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateComision(true)} disableElevation sx={{ bgcolor: '#0f5cb3' }}>
              Abrir Comisión (Cursada)
            </Button>
          </Stack>
        )}
      </Box>

      {/* ========================================================
          VISTA DEL ADMINISTRADOR (Gestión Total)
      ======================================================== */}
      {isAdmin && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Comisiones Activas en el Ciclo</Typography>
            <Grid container spacing={2}>
              {comisiones.map(com => (
                <Grid item xs={12} sm={6} md={4} key={com.id}>
                  <Card sx={{ borderLeft: '4px solid #10b981', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{com.materia_nombre || 'Materia'}</Typography>
                      <Typography variant="body2" color="text.secondary">Comisión: {com.nombre}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}><strong>Docente ID:</strong> {com.profesor}</Typography>
                      <Typography variant="body2"><strong>Horario:</strong> {com.dia_semana} ({com.hora_inicio} - {com.hora_fin})</Typography>
                      <Chip size="small" label={`${com.alumnos?.length || 0} Inscriptos`} sx={{ mt: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* ========================================================
          VISTA DEL DOCENTE (Solo ve sus comisiones y alumnos)
      ======================================================== */}
      {isTeacher && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Mis Cátedras Asignadas</Typography>
            {misComisionesDocente.length === 0 ? (
              <Typography color="text.secondary">No tienes comisiones asignadas por Administración este ciclo.</Typography>
            ) : (
              <Grid container spacing={2}>
                {misComisionesDocente.map(com => (
                  <Grid item xs={12} md={6} key={com.id}>
                    <Card sx={{ borderLeft: '6px solid #f59e0b', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color="#b45309">{com.materia_nombre || 'Materia Asignada'}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          Comisión: {com.nombre} • {com.dia_semana} {com.hora_inicio}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          startIcon={<GroupIcon />} 
                          onClick={() => { setComisionActiva(com); setOpenStudents(true); }}
                          size="small"
                        >
                          Ver Alumnos ({com.alumnos?.length || 0})
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {/* ========================================================
          VISTA DEL ESTUDIANTE (Inscripción y Cursadas)
      ======================================================== */}
      {isStudent && (
        <Box>
          <Tabs value={tabEstudiante} onChange={(e, newValue) => setTabEstudiante(newValue)} sx={{ mb: 3 }}>
            <Tab label="Mis Cursadas" fontWeight="bold" />
            <Tab label="Inscripción a Materias" />
          </Tabs>

          {/* Tab 0: Materias Inscriptas */}
          {tabEstudiante === 0 && (
            <Grid container spacing={2}>
              {misComisionesEstudiante.length === 0 ? (
                <Typography color="text.secondary" sx={{ ml: 2 }}>No estás inscripto en ninguna materia aún.</Typography>
              ) : (
                misComisionesEstudiante.map(com => (
                  <Grid item xs={12} sm={6} md={4} key={com.id}>
                    <Card sx={{ borderLeft: '6px solid #0f5cb3', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color="#0f5cb3">{com.materia_nombre || 'Materia'}</Typography>
                        <Typography variant="body2" color="text.secondary">Comisión {com.nombre}</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2"><strong>Día:</strong> {com.dia_semana}</Typography>
                        <Typography variant="body2"><strong>Horario:</strong> {com.hora_inicio} a {com.hora_fin}</Typography>
                        <Typography variant="body2"><strong>Aula:</strong> {com.aula || 'A confirmar'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Tab 1: Oferta Académica para Inscribirse */}
          {tabEstudiante === 1 && (
            <Grid container spacing={2}>
              {comisionesDisponibles.map(com => (
                <Grid item xs={12} sm={6} md={4} key={com.id}>
                  <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">{com.materia_nombre || 'Materia'}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {com.dia_semana} de {com.hora_inicio} a {com.hora_fin}
                      </Typography>
                      
                      {inscripcionData.comision_id === com.id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField 
                            size="small" 
                            placeholder="Clave de cursada" 
                            type="password"
                            value={inscripcionData.clave}
                            onChange={(e) => setInscripcionData({...inscripcionData, clave: e.target.value})}
                          />
                          <Button variant="contained" color="success" onClick={() => handleInscribirse(com.id)}>Validar</Button>
                        </Box>
                      ) : (
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          startIcon={<KeyIcon />}
                          onClick={() => setInscripcionData({ comision_id: com.id, clave: '' })}
                        >
                          Inscribirme
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* ========================================================
          MODALES DE ADMINISTRACIÓN
      ======================================================== */}
      {/* Crear Materia Estructural */}
      <Dialog open={openCreateMateria} onClose={() => setOpenCreateMateria(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Materia (Plan de Estudios)</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre de la Materia" margin="normal" value={newMateria.nombre} onChange={e => setNewMateria({...newMateria, nombre: e.target.value})} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth select label="Año" margin="normal" value={newMateria.ano} onChange={e => setNewMateria({...newMateria, ano: e.target.value})}>
                {[1,2,3,4,5].map(a => <MenuItem key={a} value={a}>{a}º Año</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Cuatrimestre" margin="normal" value={newMateria.cuatrimestre} onChange={e => setNewMateria({...newMateria, cuatrimestre: e.target.value})}>
                <MenuItem value={1}>1º Cuatrimestre</MenuItem>
                <MenuItem value={2}>2º Cuatrimestre</MenuItem>
                <MenuItem value={3}>Anual</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateMateria(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateMateria}>Guardar Materia</Button>
        </DialogActions>
      </Dialog>

      {/* Crear Comisión (Asignar Docente, Aula y Horario) */}
      <Dialog open={openCreateComision} onClose={() => setOpenCreateComision(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Abrir Comisión para Cursada</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Materia Base" margin="normal" value={newComision.materia_id} onChange={e => setNewComision({...newComision, materia_id: e.target.value})}>
            {materias.map(m => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Identificador (Ej: Comisión A)" margin="normal" value={newComision.nombre} onChange={e => setNewComision({...newComision, nombre: e.target.value})} />
          <TextField fullWidth label="ID del Docente Designado" margin="normal" type="number" value={newComision.profesor_id} onChange={e => setNewComision({...newComision, profesor_id: e.target.value})} />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField fullWidth select label="Día" margin="normal" value={newComision.dia_semana} onChange={e => setNewComision({...newComision, dia_semana: e.target.value})}>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Hora Inicio (HH:MM)" margin="normal" value={newComision.hora_inicio} onChange={e => setNewComision({...newComision, hora_inicio: e.target.value})} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="Hora Fin (HH:MM)" margin="normal" value={newComision.hora_fin} onChange={e => setNewComision({...newComision, hora_fin: e.target.value})} />
            </Grid>
          </Grid>
          {/* Se agregan campos que se recomiendan incluir en el modelo backend */}
          <TextField fullWidth label="Aula Designada" margin="normal" value={newComision.aula} onChange={e => setNewComision({...newComision, aula: e.target.value})} />
          <TextField fullWidth label="Contraseña para Alumnos" margin="normal" value={newComision.clave} onChange={e => setNewComision({...newComision, clave: e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateComision(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateComision}>Asignar Comisión</Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          MODAL DE DOCENTES (Ver Alumnos)
      ======================================================== */}
      {openStudents && comisionActiva && (
        <Dialog open={openStudents} onClose={() => setOpenStudents(false)} fullWidth maxWidth="xs">
          <DialogTitle fontWeight="bold">Alumnos Inscriptos</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Comisión: {comisionActiva.nombre}
            </Typography>
            <List>
              {comisionActiva.alumnos?.length > 0 ? (
                comisionActiva.alumnos.map(alumnoId => (
                  <ListItem key={alumnoId}>
                    <ListItemText primary={`ID de Alumno: ${alumnoId}`} secondary="Inscripto y activo" />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary">No hay inscriptos todavía.</Typography>
              )}
            </List>
          </DialogContent>
          <DialogActions><Button onClick={() => setOpenStudents(false)}>Cerrar Lista</Button></DialogActions>
        </Dialog>
      )}

    </Box>
  );
}