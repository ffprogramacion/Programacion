import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Select, MenuItem, FormControl, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Person as PersonIcon } from '@mui/icons-material';

export default function ControlUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, legajo: 'UNRAF-4321', nombre: 'Facundo Boide', email: 'facundo.boide@unraf.edu.ar', role: 'student' },
    { id: 2, legajo: 'UNRAF-8812', nombre: 'Milton Ingeniero', email: 'milton@unraf.edu.ar', role: 'teacher' },
    { id: 3, legajo: 'UNRAF-0001', nombre: 'Rectorado Admin', email: 'admin@unraf.edu.ar', role: 'admin' },
  ]);

  const handleRoleChange = (id, newRole) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const columns = [
    { field: 'legajo', headerName: 'Legajo / Registro', width: 140, renderCell: (p) => <strong>{p.value}</strong> },
    { field: 'nombre', headerName: 'Nombre y Apellido', width: 200 },
    { field: 'email', headerName: 'Correo Institucional', width: 240 },
    { 
      field: 'role', 
      headerName: 'Rol Asignado', 
      width: 150,
      renderCell: (p) => {
        const label = p.value === 'admin' ? 'Administrador' : p.value === 'teacher' ? 'Docente' : 'Estudiante';
        const color = p.value === 'admin' ? 'error' : p.value === 'teacher' ? 'warning' : 'primary';
        return <Chip label={label} color={color} size="small" variant="outlined" />;
      }
    },
    {
      field: 'acciones',
      headerName: 'Modificar Permisos',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
          <Select value={params.row.role} onChange={(e) => handleRoleChange(params.id, e.target.value)} sx={{ borderRadius: 2, height: '34px', fontSize: '0.85rem' }}>
            <MenuItem value="student">Estudiante</MenuItem>
            <MenuItem value="teacher">Docente</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
        </FormControl>
      )
    }
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Gobernanza de Cuentas y Roles</Typography>
      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <div style={{ height: 350, width: '100%', backgroundColor: 'white' }}>
            <DataGrid rows={usuarios} columns={columns} pageSize={5} disableSelectionOnClick sx={{ border: 'none' }} />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}