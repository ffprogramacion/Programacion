import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Button, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Para las tablas robustas de administración

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido, {user.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Panel de control asignado a tu rol: <strong>{user.role.toUpperCase()}</strong>
      </Typography>

      <Box sx={{ mt: 4 }}>
        {user.role === 'student' && <StudentDashboard />}
        {user.role === 'teacher' && <TeacherDashboard />}
        {user.role === 'admin' && <AdminDashboard />}
      </Box>
    </Box>
  );
}

// --- VISTA ALUMNO ---
function StudentDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Inscribirse a una Asignatura</Typography>
            <TextField fullWidth label="Nombre de la Asignatura" variant="outlined" margin="normal" size="small" />
            <TextField fullWidth label="Contraseña de acceso" type="password" variant="outlined" margin="normal" size="small" />
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>Unirse a Clase</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>Mis Clases Suscriptas</Typography>
        {/* Aquí mapearías las tarjetas de clases */}
        <Typography variant="body2" color="text.secondary">Aún no te has inscrito a ninguna materia.</Typography>
      </Grid>
    </Grid>
  );
}

// --- VISTA PROFESOR ---
function TeacherDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Crear Nueva Asignatura</Typography>
            <TextField fullWidth label="Nombre de la Nueva Materia" variant="outlined" margin="normal" size="small" />
            <TextField fullWidth label="Definir Contraseña para Alumnos" type="password" variant="outlined" margin="normal" size="small" />
            <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }}>Generar Código de Acceso</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2 }}>Mis Clases Dictadas</Typography>
        <Typography variant="body2" color="text.secondary">No has creado asignaturas este cuatrimestre.</Typography>
      </Grid>
    </Grid>
  );
}

// --- VISTA ADMINISTRADOR ---
function AdminDashboard() {
  // Columnas de ejemplo utilizando DataGrid de Material UI
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'aula', headerName: 'Aula/Laboratorio', width: 200 },
    { field: 'capacidad', headerName: 'Capacidad', width: 130 },
    { field: 'estado', headerName: 'Estado', width: 150 },
  ];

  const rows = [
    { id: 1, aula: 'Laboratorio de Sistemas 1', capacidad: 30, estado: 'Disponible' },
    { id: 2, aula: 'Aula Magna', capacidad: 120, estado: 'Mantenimiento' },
    { id: 3, aula: 'Sala de Estudio A', capacidad: 10, estado: 'Disponible' },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Panel de Gestión de Aulas (CRUD)</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>+ Añadir Nueva Aula</Button>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection disableSelectionOnClick />
      </div>
    </Box>
  );
}