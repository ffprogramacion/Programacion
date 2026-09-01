import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../service/api.js'; 
import { 
  Box, Card, CardContent, TextField, Button, Typography, 
  MenuItem, Container, CssBaseline, InputAdornment, IconButton, Link, Alert
} from '@mui/material';
import { 
  AccountCircle, Lock, Visibility, VisibilityOff, ArrowDropDown 
} from '@mui/icons-material';
import logoUnraf from '../assets/logo-unraf.png';

export default function Login() {
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(false);
  
  // Campos del Formulario
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  // Estados de carga y error
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isRegister) {
        // ----------------------------------------------------
        // 1. INICIO DE SESIÓN DIRECTO
        // ----------------------------------------------------
        const response = await api.post('login/', {
          username: username,
          password: password
        });

        const userData = response.data || {};

        // 🚀 EXTRACCIÓN Y ESTANDARIZACIÓN ESTRICTA DEL ROL REAL
        // Buscamos el rol de manera segura donde sea que lo envíe el backend
        const backendRole = userData.rol || userData.role || userData.profile?.rol || 'student';

        // Armamos el objeto de sesión institucional blindado
        const usuarioSeguro = {
          id: userData.id || 1,
          username: userData.username || username,
          nombre: userData.nombre || userData.first_name || userData.name || username,
          rol: backendRole.toLowerCase(), // Normalizado para que el Sidebar lo filtre a la perfección
          ...userData 
        };

        // Guardamos los datos limpios en el navegador
        localStorage.setItem('usuario_activo', JSON.stringify(usuarioSeguro));
        
        // Recarga forzada limpia para que el layout lea los roles y renderice el Sidebar correspondiente
        window.location.href = '/clases';

      } else {
        // ----------------------------------------------------
        // 2. REGISTRO DE USUARIO
        // ----------------------------------------------------
        const [firstName, ...lastNameArray] = fullName.trim().split(' ');
        const lastName = lastNameArray.join(' ');

        await api.post('register/', {
          username: username,
          email: email,
          password: password,
          first_name: firstName || '',
          last_name: lastName || '',
          profile: {
            rol: role
          }
        });

        // Cambiamos a modo Login tras registro exitoso
        setIsRegister(false);
        setError('¡Cuenta creada con éxito! Por favor iniciá sesión.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Formateo de respuesta de error devuelta por Django REST Framework
        const data = err.response.data;
        const msg = typeof data === 'object' 
          ? Object.entries(data).map(([key, val]) => `${key}: ${val}`).join(' | ') 
          : data;
        setError(`Error: ${msg}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error de conexión con el servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'linear-gradient(135deg, #0f5cb3 0%, #114682 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', overflowY: 'auto', p: 2
      }}
    >
      <CssBaseline />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, mt: 2 }}>
        <img src={logoUnraf} alt="Logo UNRaf" style={{ height: '155px', marginBottom: '12px' }} />
        <Typography variant="body2" sx={{ color: 'white', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>
          UNRaf - Sistema de reserva de aulas
        </Typography>
      </Box>

      <Container maxWidth="xs" disableGutters>
        <Card sx={{ borderRadius: 4, boxShadow: '0px 10px 30px rgba(0,0,0,0.15)', p: 1 }}>
          <CardContent sx={{ p: 3 }}>
            
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#212121', mb: 0.5 }}>
              {isRegister ? 'Crear Perfil' : 'Iniciar Sesión'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isRegister ? 'Completa tus datos de registro' : 'Ingresa con tus credenciales institucionales'}
            </Typography>

            {/* Alerta para mostrar Errores o Mensajes de Éxito */}
            {error && (
              <Alert severity={error.includes('éxito') ? 'success' : 'error'} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              
              {/* Usuario */}
              <TextField 
                fullWidth 
                label="Usuario" 
                variant="outlined" 
                margin="normal" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {isRegister && (
                <>
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
                  <TextField 
                    fullWidth 
                    label="Correo Institucional" 
                    type="email"
                    variant="outlined" 
                    margin="normal" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </>
              )}
              
              {/* Contraseña */}
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
              
              {/* Selector de Rol en Registro */}
              {isRegister && (
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
                  SelectProps={{ IconComponent: () => null }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="student">Estudiante</MenuItem>
                  <MenuItem value="teacher">Docente</MenuItem>
                  {/* <MenuItem value="admin">Administrador</MenuItem> */}
                </TextField>
              )}

              {/* Botón Principal */}
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ 
                  mt: 3, mb: 3, py: 1.6, fontWeight: 'bold', borderRadius: 3,
                  fontSize: '16px', backgroundColor: '#1976d2', textTransform: 'none',
                  '&:hover': { backgroundColor: '#115293' }
                }}
              >
                {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Ingresar')}
              </Button>

              {/* Link para alternar Registro/Login */}
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Link 
                  component="button" 
                  type="button"
                  variant="body2" 
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  sx={{ fontWeight: 'medium', color: '#1976d2', textDecoration: 'none' }}
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