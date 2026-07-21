import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { 
  Box, Card, CardContent, TextField, Button, Typography, 
  MenuItem, Container, CssBaseline, InputAdornment, IconButton, Link 
} from '@mui/material';
import { 
  AccountCircle, Lock, Visibility, VisibilityOff, 
  School, ArrowDropDown 
} from '@mui/icons-material';
import logoUnraf from '../assets/logo-unraf.png'; // Asegúrate de tener el logo en esta ruta

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // 0 = Iniciar Sesión, 1 = Registrarse (Mismo comportamiento lógico de antes)
  const [isRegister, setIsRegister] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Mapeo de roles internos con las etiquetas visuales del diseño
  const roleLabels = {
    student: 'Estudiante',
    teacher: 'Docente',
    admin: 'Admin'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isRegister) {
      let assignedRole = role; // Toma el seleccionado en el dropdown
      // Mantiene tu atajo por texto si escriben la palabra
      if (email.toLowerCase().includes('profesor')) assignedRole = 'teacher';
      if (email.toLowerCase().includes('admin')) assignedRole = 'admin';

      login({ 
        name: email.split('@')[0] || "Usuario", 
        role: assignedRole, 
        id: "12345" 
      });
    } else {
      login({ 
        name: fullName || "Nuevo Usuario", 
        role: role, 
        id: "67890" 
      });
    }

    navigate('/clases', { replace: true });
  };

  return (
    <Box 
      sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f5cb3 0%, #114682 100%)',
      
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      overflowY: 'auto',
      p: 2
      }}
    >
      <CssBaseline />
      
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', // Los elementos se apilan verticalmente
      alignItems: 'center',    // Centra horizontalmente imagen y texto
      justifyContent: 'center', 
      mb: 4, 
      mt: 2  
    }}
  >
    {/* Imagen del Logo */}
    <img 
      src={logoUnraf} 
      alt="Logo Institucional UNRaf" 
      style={{ 
        width: 'auto', 
        height: '155px', 
        objectFit: 'contain',
        marginBottom: '12px' // Espacio entre el logo y el texto de abajo
      }} 
    />
    <Typography 
    variant="body2" 
    sx={{ 
      color: 'white', 
      fontWeight: '500', 
      letterSpacing: '1px',
      textTransform: 'uppercase', // Opcional: le da un toque más formal/institucional
      opacity: 0.9 // Un poquito de transparencia para que no distraiga de la tarjeta principal
    }}
  >
    UNRaf - Sistema de reserva de aulas
  </Typography>
    </Box>
      <Container maxWidth="xs" disableGutters>
        <Card sx={{ borderRadius: 4, boxShadow: '0px 10px 30px rgba(0,0,0,0.15)', p: 1 }}>
          <CardContent sx={{ p: 3 }}>
            
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121', mb: 0.5 }}>
              {isRegister ? 'Crear Perfil' : 'Iniciar Sesión'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {isRegister ? 'Completa tus datos de registro' : 'Ingresa con tus credenciales institucionales'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {isRegister && (
                <TextField 
                  fullWidth 
                  label="Nombre Completo" 
                  variant="outlined" 
                  margin="normal" 
                  required 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
              
              {/* Input de Correo Institucional */}
              <TextField 
                fullWidth 
                label="Correo Institucional" 
                variant="outlined" 
                margin="normal" 
                required 
                placeholder="usuario@universidad.edu"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              {/* Input de Contraseña */}
              <TextField 
                fullWidth 
                label="Contraseña" 
                type={showPassword ? 'text' : 'password'} 
                variant="outlined" 
                margin="normal" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              {/* Selector de Rol Dinámico */}
              <TextField 
                fullWidth 
                select 
                label="Rol" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                margin="normal"
                InputProps={{
                  endAdornment: <ArrowDropDown sx={{ pointerEvents: 'none', mr: 1, color: 'action.active' }} />
                }}
                SelectProps={{ IconComponent: () => null }} // Quitamos el icono por defecto para usar el del Figma
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="teacher">Docente</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </TextField>

              {/* Botón Principal azul redondeado */}
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                size="large" 
                sx={{ 
                  mt: 3, 
                  mb: 4, 
                  py: 1.6, 
                  fontWeight: 'bold', 
                  borderRadius: 3,
                  fontSize: '16px',
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#115293' }
                }}
              >
                {isRegister ? 'Registrarse' : 'Ingresar'}
              </Button>

              {/* Enrutador alternativo inferior */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link 
                  component="button" 
                  type="button"
                  variant="body2" 
                  onClick={() => setIsRegister(!isRegister)}
                  sx={{ underline: 'hover', fontWeight: 'medium', color: '#1976d2', textDecoration: 'none' }}
                >
                  {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                </Link>
              </Box>

            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}