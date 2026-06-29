import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Stack, Avatar, Tooltip, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Domain as DomainIcon } from '@mui/icons-material';

export default function TablaAulas({ datos, onEdit, onDelete }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    
    // 🔥 NUEVA COLUMNA: Miniatura de la Foto
    { 
      field: 'imagen', 
      headerName: 'Foto', 
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Avatar 
            variant="rounded" 
            src={params.value || ''} 
            sx={{ width: 40, height: 40, bgcolor: 'rgba(15, 92, 179, 0.1)' }}
          >
            {!params.value && <DomainIcon sx={{ color: '#0f5cb3' }} />}
          </Avatar>
        </Box>
      )
    },
    
    { 
      field: 'nombre', 
      headerName: 'Aula / Espacio', 
      flex: 1.2,
      // Sumamos un Tooltip para que el Admin pueda leer la descripción al pasar el mouse por el nombre
      renderCell: (params) => (
        <Tooltip title={params.row.descripcion || 'Sin descripción'} placement="top-start" arrow>
          <Typography variant="body2" sx={{ cursor: 'help', fontWeight: '500' }}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    { field: 'ubicacion', headerName: 'Ubicación Física', flex: 1.2 },
    { field: 'capacidad', headerName: 'Capacidad', flex: 0.8, type: 'number' },
    { field: 'tipo', headerName: 'Tipo', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones de Control',
      width: 200, // Ancho fijo seguro para los botones de acción
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => onEdit(params.row)}
            sx={{ textTransform: 'none', backgroundColor: '#0f5cb3' }}
          >
            Editar
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(params.row.id)}
            sx={{ textTransform: 'none' }}
          >
            Borrar
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', backgroundColor: 'white' }}>
      <DataGrid
        rows={datos}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableSelectionOnClick
        rowHeight={60} // Hacemos las filas un poquito más altas para que entre bien la foto
      />
    </Box>
  );
}