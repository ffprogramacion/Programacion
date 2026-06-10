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

  // Función para los botones redondos de acceso rápido de tu mockup
  const handleQuickAccess = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') setEmail('alumno@unraf.edu.ar');
    if (selectedRole === 'teacher') setEmail('profesor.milton@unraf.edu.ar');
    if (selectedRole === 'admin') setEmail('admin@unraf.edu.ar');
  };

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #0f5cb3 0%, #1976d2 100%)', // Paleta UNRaf
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        px: 2
      }}
    >
      <CssBaseline />
      
<Box 
  sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    mb: 4, 
    mt: 2  
  }}
>
  <img 
    src={logoUnraf} // <-- Aquí se pasa la variable que importaste arriba
    alt="Logo Institucional UNRaf" 
    style={{ 
      width: 'auto', 
      height: '65px', 
      objectFit: 'contain'
    }} 
  />
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

              {/* Sección Acceso Rápos Demo de tu Prototipo */}
              {!isRegister && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.5px' }}>
                    acceso rápido demo
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                    <Button variant="outlined" size="small" onClick={() => handleQuickAccess('student')} sx={{ borderRadius: 4, px: 2, textTransform: 'none', borderColor: '#1976d2', color: '#1976d2', fontWeight: 'bold' }}>
                      Estudiante
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => handleQuickAccess('teacher')} sx={{ borderRadius: 4, px: 2, textTransform: 'none', borderColor: '#2e7d32', color: '#2e7d32', fontWeight: 'bold' }}>
                      Docente
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => handleQuickAccess('admin')} sx={{ borderRadius: 4, px: 2, textTransform: 'none', borderColor: '#d84315', color: '#d84315', fontWeight: 'bold' }}>
                      Admin
                    </Button>
                  </Box>
                </Box>
              )}

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