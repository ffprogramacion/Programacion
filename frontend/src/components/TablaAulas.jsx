import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Stack, Avatar, Tooltip, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Domain as DomainIcon } from '@mui/icons-material';

export default function TablaAulas({ datos, onEdit, onDelete }) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    
    { 
      field: 'imagen', 
      headerName: 'Foto', 
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Avatar 
            variant="rounded" 
            // Si la API devuelve un path relativo (ej: /media/fotos/aula1.jpg), el src lo procesará bien
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
      renderCell: (params) => (
        <Tooltip title={params.row.descripcion || 'Sin descripción detallada'} placement="top-start" arrow>
          <Typography variant="body2" sx={{ cursor: 'help', fontWeight: '600', color: '#1e293b' }}>
            {params.value || 'Sin nombre'}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: 'ubicacion', 
      headerName: 'Ubicación Física', 
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || 'No especificada'}
        </Typography>
      )
    },
    { 
      field: 'capacidad', 
      headerName: 'Capacidad', 
      flex: 0.8, 
      type: 'number',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="500">
          {params.value ? `${params.value} pax` : '-'}
        </Typography>
      )
    },
    { field: 'tipo', headerName: 'Tipo', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones de Control',
      width: 200, 
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => onEdit(params.row)}
            disableElevation
            sx={{ 
              textTransform: 'none', 
              backgroundColor: '#0f5cb3',
              '&:hover': { backgroundColor: '#0c4a91' }
            }}
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
    <Box 
      sx={{ 
        width: '100%', 
        backgroundColor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}
    >
      <DataGrid
        rows={datos}
        columns={columns}
        // 🚀 Sintaxis moderna para paginación (MUI v6+)
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        autoHeight
        disableRowSelectionOnClick // 🚀 Reemplaza al viejo disableSelectionOnClick
        rowHeight={64} // Altura ajustada
        sx={{
          border: 'none', // Quitamos el borde por defecto para usar el del contenedor superior
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8fafc', // Encabezados sutilmente grises
            color: '#475569',
            fontWeight: 'bold',
            borderBottom: '1px solid #e2e8f0'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f1f5f9'
          }
        }}
      />
    </Box>
  );
}