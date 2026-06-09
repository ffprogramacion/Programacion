import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Importamos useNavigate desde react-router-dom
import { useNavigate } from 'react-router-dom'; 
import { Box, Card, CardContent, TextField, Button, Typography, Tabs, Tab, MenuItem, Container, CssBaseline } from '@mui/material';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Inicializamos el navegador de rutas
  
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (tabValue === 0) {
      // --- LÓGICA DE INICIO DE SESIÓN SIMULADA ---
      let assignedRole = 'student';
      // Si el correo contiene la palabra "profesor" o "admin", asigna ese rol
      if (email.toLowerCase().includes('profesor')) assignedRole = 'teacher';
      if (email.toLowerCase().includes('admin')) assignedRole = 'admin';

      login({ 
        name: email.split('@')[0] || "Usuario", 
        role: assignedRole, 
        id: "12345" 
      });

    } else {
      // --- LÓGICA DE REGISTRO SIMULADA ---
      login({ 
        name: fullName || "Nuevo Usuario", 
        role: role, 
        id: "67890" 
      });
    }

    // 🔥 LA PIEZA FALTANTE: Una vez que el contexto tiene el usuario,
    // le ordenamos a React Router que nos empuje a la ruta principal.
    navigate('/clases', { replace: true });
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContext: 'center' }}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
                <Tab label="Iniciar Sesión" />
                <Tab label="Crear Perfil" />
              </Tabs>
            </Box>

            <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
              {tabValue === 0 ? '¡Bienvenido!' : 'Registra tu cuenta'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              {tabValue === 1 && (
                <TextField fullWidth label="Nombre Completo" variant="outlined" margin="normal" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              )}
              
              <TextField 
                fullWidth 
                label="Correo / Usuario" 
                variant="outlined" 
                margin="normal" 
                required 
                helperText={tabValue === 0 ? "Tip: escribe 'profesor' o 'admin' en el correo para probar esos dashboards" : ""} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              
              <TextField fullWidth label="Contraseña" type="password" variant="outlined" margin="normal" required value={password} onChange={(e) => setPassword(e.target.value)} />
              
              {tabValue === 1 && (
                <TextField fullWidth select label="Selecciona tu Rol" value={role} onChange={(e) => setRole(e.target.value)} margin="normal">
                  <MenuItem value="student">Alumno</MenuItem>
                  <MenuItem value="teacher">Profesor</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </TextField>
              )}

              <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}>
                {tabValue === 0 ? 'Ingresar' : 'Registrarse'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}