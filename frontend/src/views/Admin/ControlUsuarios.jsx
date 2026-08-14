import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Select, MenuItem, FormControl, Chip, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Person as PersonIcon } from '@mui/icons-material';
// 🏛️ Asumimos que tienes una instancia de axios configurada con los interceptores JWT
// import api from '../../api'; 

export default function ControlUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. OBTENER USUARIOS DEL BACKEND DJANGO
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // 🔥 Reemplazar por tu llamada real a la API:
        // const response = await api.get('/usuarios/');
        // setUsuarios(response.data);
        
        // Mock simulando la respuesta de red para no romper tu UI:
        setTimeout(() => {
          setUsuarios([
            { id: 1, legajo: 'UNRAF-4321', nombre: 'Facundo Boide', email: 'facundo.boide@unraf.edu.ar', role: 'estudiante' },
            { id: 2, legajo: 'UNRAF-8812', nombre: 'Milton Ingeniero', email: 'milton@unraf.edu.ar', role: 'profesor' },
            { id: 3, legajo: 'UNRAF-0001', nombre: 'Rectorado Admin', email: 'admin@unraf.edu.ar', role: 'admin' },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // 2. ACTUALIZAR ROL EN EL BACKEND
  const handleRoleChange = async (id, newRole) => {
    // Actualización optimista en el frontend para respuesta inmediata de UI
    const usuariosPrevios = [...usuarios];
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, role: newRole } : u));

    try {
      // 🔥 Petición PATCH para cambiar solo el campo 'role' o 'rol' en la base de datos:
      // await api.patch(`/usuarios/${id}/cambiar_rol/`, { rol: newRole });
      console.log(`Rol del usuario ${id} actualizado en el backend a: ${newRole}`);
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      // Revertimos el cambio si la API falla (ej. por falta de permisos JWT)
      setUsuarios(usuariosPrevios);
      alert("Hubo un error al actualizar los permisos. Verifica tu conexión.");
    }
  };

  const columns = [
    { field: 'legajo', headerName: 'Legajo / Registro', width: 140, renderCell: (p) => <strong>{p.value}</strong> },
    { field: 'nombre', headerName: 'Nombre y Apellido', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'Correo Institucional', flex: 1, minWidth: 240 },
    { 
      field: 'role', 
      headerName: 'Rol Asignado', 
      width: 150,
      renderCell: (p) => {
        const rolNormalizado = (p.value || '').toLowerCase();
        
        // Mapeo tolerante para soportar distintos formatos
        const isAdmin = rolNormalizado === 'admin' || rolNormalizado === 'administrador';
        const isTeacher = rolNormalizado === 'teacher' || rolNormalizado === 'profesor' || rolNormalizado === 'docente';
        
        const label = isAdmin ? 'Administrador' : isTeacher ? 'Docente' : 'Estudiante';
        const color = isAdmin ? 'error' : isTeacher ? 'warning' : 'primary';
        
        return <Chip label={label} color={color} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />;
      }
    },
    {
      field: 'acciones',
      headerName: 'Modificar Permisos',
      width: 180,
      sortable: false,
      renderCell: (params) => {
        // Normalizamos el valor actual para el Select
        let valorActual = (params.row.role || params.row.rol || 'estudiante').toLowerCase();
        if (valorActual === 'profesor' || valorActual === 'docente') valorActual = 'teacher';
        
        return (
          <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
            <Select 
              value={valorActual} 
              onChange={(e) => handleRoleChange(params.row.id, e.target.value)} 
              sx={{ borderRadius: 2, height: '34px', fontSize: '0.85rem' }}
            >
              <MenuItem value="estudiante">Estudiante</MenuItem>
              <MenuItem value="teacher">Docente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
        );
      }
    }
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
        Gobernanza de Cuentas y Roles
      </Typography>
      
      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ height: 450, width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress size={40} sx={{ color: '#0f5cb3' }} />
              </Box>
            ) : (
              <DataGrid 
                rows={usuarios} 
                columns={columns} 
                // 🚀 Sintaxis actualizada DataGrid v6+
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick 
                sx={{ 
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    borderBottom: '1px solid #e2e8f0'
                  }
                }} 
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}