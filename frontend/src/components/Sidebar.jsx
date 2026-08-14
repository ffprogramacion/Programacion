import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { 
  Class as ClassIcon, 
  CalendarMonth as CalendarIcon, 
  History as HistoryIcon, 
  AdminPanelSettings as AdminIcon, 
  ExitToApp as LogoutIcon, 
  Person as PersonIcon, 
  Inventory as StockIcon, 
  Group as UsersIcon,
  AddHomeWorkOutlined as AulaIcon,
  VerifiedUser as VerifiedIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ drawerWidth, mobileOpen, onDrawerToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // 🚀 Normalización robusta para API de Django
  const userRole = (user?.rol || user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'administrador';
  const isTeacher = userRole === 'teacher' || userRole === 'profesor' || userRole === 'docente';
  
  // Normalizamos el nombre (soporta fields genéricos de Django Auth)
  const userName = user?.nombre || user?.first_name || user?.name || 'USUARIO UNRAF';
  const userInitial = userName.trim()[0].toUpperCase();

  // Etiqueta visual para la credencial
  let roleLabel = 'Estudiante';
  if (isAdmin) roleLabel = 'Administrador';
  else if (isTeacher) roleLabel = 'Docente';

  // Matriz de enrutamiento ampliada para soportar nomenclaturas EN/ES
  const menuItems = [
    { 
      text: 'Mis Clases', 
      path: '/clases', 
      icon: <ClassIcon />, 
      roles: ['student', 'estudiante', 'teacher', 'profesor', 'docente'] 
    },
    { 
      text: 'Reservar Aulas', 
      path: '/reservar', 
      icon: <CalendarIcon />, 
      roles: ['student', 'estudiante', 'teacher', 'profesor', 'docente'] 
    },
    { 
      text: isAdmin ? 'Reservas Históricas' : 'Aulas Disponibles', 
      path: '/reservas', 
      icon: <AulaIcon />, 
      // Esta ruta la ven todos
      roles: ['student', 'estudiante', 'teacher', 'profesor', 'docente', 'admin', 'administrador'] 
    },
    { 
      text: 'Mi Perfil', 
      path: '/perfil', 
      icon: <PersonIcon />, 
      roles: ['student', 'estudiante', 'teacher', 'profesor', 'docente', 'admin', 'administrador'] 
    },
    
    // Rutas Exclusivas del Panel de Control de Administración
    { text: 'Gestión de Aulas', path: '/admin/aulas', icon: <AdminIcon />, roles: ['admin', 'administrador'] },
    { text: 'Stock de Materiales', path: '/admin/stock', icon: <StockIcon />, roles: ['admin', 'administrador'] },
    { text: 'Control de Usuarios', path: '/admin/usuarios', icon: <UsersIcon />, roles: ['admin', 'administrador'] },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {user && (
          <Box 
            sx={{ 
              m: 2, 
              p: 2, 
              borderRadius: 3, 
              bgcolor: 'rgba(15, 92, 179, 0.04)', 
              border: '1px solid rgba(15, 92, 179, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            {/* Mini Avatar del Usuario */}
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: '#0f5cb3', 
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0px 4px 10px rgba(15,92,179,0.2)'
              }}
            >
              {userInitial}
            </Avatar>

            {/* Datos Tipográficos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#0f5cb3', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  fontWeight: '800',
                  fontSize: '0.65rem',
                  mb: 0.5
                }}
              >
                Credencial Activa
              </Typography>
              
              <Typography variant="body1" fontWeight="bold" noWrap sx={{ color: '#1e293b', lineHeight: 1.1 }}>
                {userName}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#64748b', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  mt: 0.5
                }}
              >
                <VerifiedIcon sx={{ fontSize: '0.9rem', color: '#10b981' }} />
                {roleLabel}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ mx: 2, mb: 1, borderColor: '#f1f5f9' }} />
      
      <List sx={{ px: 2, mt: 1, flexGrow: 1 }}>
        {menuItems
          // Filtramos usando el userRole normalizado
          .filter((item) => item.roles.includes(userRole))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  selected={isActive} 
                  onClick={mobileOpen ? onDrawerToggle : undefined}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    bgcolor: isActive ? 'rgba(15, 92, 179, 0.08)' : 'transparent',
                    borderLeft: isActive ? '4px solid #0f5cb3' : '4px solid transparent',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(15, 92, 179, 0.1)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#0f5cb3' : 'text.secondary', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: isActive ? '#0f5cb3' : 'text.primary', 
                        fontWeight: isActive ? '600' : '400',
                        fontSize: '0.92rem'
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
      
      <Divider sx={{ mx: 2 }} />
      <List sx={{ px: 2, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, py: 1.2 }}>
            <ListItemIcon sx={{ minWidth: '40px' }}><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión" 
              sx={{ '& .MuiTypography-root': { color: 'error.main', fontWeight: '500', fontSize: '0.92rem' } }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }} 
        sx={{ 
          display: { xs: 'block', sm: 'none' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' } 
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
      
      <Drawer
        variant="permanent"
        sx={{ 
          display: { xs: 'none', sm: 'block' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' } 
        }}
        open
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    </Box>
  );
}