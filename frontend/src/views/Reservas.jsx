import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, FormControlLabel, Switch, Chip, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  CancelScheduleSend as CancelIcon, 
  Room as RoomIcon, 
  CalendarMonth as CalendarIcon, 
  Person as PersonIcon 
} from '@mui/icons-material';

export default function Reservas() {
  const { user, reservas, cancelarReserva } = useAuth();
  const [soloMias, setSoloMias] = useState(user?.role !== 'admin');

  // Configuración de las columnas con diseño estilizado y elástico
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70, 
      renderCell: (p) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: '500' }}>
          #{String(p.value).slice(-4)}
        </Typography>
      ) 
    },
    { 
      field: 'aula', 
      headerName: 'Aula / Ubicación', 
      flex: 1.5, 
      minWidth: 180,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RoomIcon sx={{ color: '#0f5cb3', fontSize: '1.1rem' }} />
          <Typography variant="body2" fontWeight="500" sx={{ color: '#2c3e50' }}>{p.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'solicitante', 
      headerName: 'Reservado por', 
      flex: 1,
      minWidth: 130,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
          <Typography variant="body2">{p.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'fecha', 
      headerName: 'Fecha y Hora', 
      flex: 1.2,
      minWidth: 160,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: '#00a896', fontSize: '1.1rem' }} />
          <Typography variant="body2" sx={{ color: '#555' }}>{p.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'materiales', 
      headerName: 'Materiales Asignados', 
      flex: 1,
      minWidth: 140,
      renderCell: (p) => (
        <Typography variant="body2" sx={{ fontStyle: p.value === 'Ninguno' ? 'italic' : 'normal', color: p.value === 'Ninguno' ? 'text.secondary' : 'text.primary' }}>
          {p.value}
        </Typography>
      )
    },
    { 
      field: 'estado', 
      headerName: 'Estado', 
      width: 100, 
      renderCell: (p) => {
        const isActive = p.value === 'Activa';
        return (
          <Chip 
            label={p.value} 
            size="small"
            sx={{ 
              fontWeight: 'bold',
              borderRadius: '6px',
              fontSize: '0.75rem',
              backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
              color: isActive ? '#2e7d32' : '#c62828',
              border: isActive ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
            }} 
          />
        );
      }
    },
  ];

  // Si el usuario es ADMIN, añadimos el botón destructivo que gatilla la baja y la notificación
  if (user?.role === 'admin') {
    columns.push({
      field: 'acciones',
      headerName: 'Acciones de Control',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" sx={{ alignItems: 'center', height: '100%' }}>
          {params.row.estado === 'Activa' ? (
            <Button 
              variant="contained" 
              color="error" 
              size="small" 
              startIcon={<CancelIcon />} 
              onClick={() => cancelarReserva(params.id)} // Dispara la lógica unificada
              sx={{ 
                textTransform: 'none', 
                borderRadius: 2, 
                fontSize: '0.75rem', 
                py: 0.5,
                px: 1.5,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#d32f2f', boxShadow: 'none' }
              }}
            >
              Anular
            </Button>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Sin acciones
            </Typography>
          )}
        </Stack>
      )
    });
  }

  const filasFiltradas = soloMias 
    ? reservas.filter(res => res.userId === user?.id) 
    : reservas;

  return (
    <Box>
      {/* Switch de Filtrado Estilizado */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <CardContent sx={{ py: '12px !important', px: 3 }}>
          <FormControlLabel 
            control={
              <Switch 
                checked={soloMias} 
                onChange={(e) => setSoloMias(e.target.checked)} 
                color="primary" 
              />
            } 
            label={
              <Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ userSelect: 'none' }}>
                Filtrar únicamente mis solicitudes personales
              </Typography>
            } 
          />
        </CardContent>
      </Card>
      
      {/* Contenedor Principal de la Tabla */}
      <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box 
            sx={{ 
              height: 'auto', 
              minHeight: 350, 
              width: '100%', 
              backgroundColor: 'white',
              '& .MuiDataGrid-root': { border: 'none' },
              '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: '700', color: '#475569', fontSize: '0.88rem' },
              '& .MuiDataGrid-row': {
                borderBottom: '1px solid #f1f5f9',
                '&:nth-of-type(even)': { backgroundColor: '#f8fafc' },
                '&:hover': { backgroundColor: '#f0fdfa !important', transition: 'background-color 0.2s ease' },
              },
              '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', borderBottom: 'none' },
              '& .MuiDataGrid-footerContainer': { borderTop: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }
            }}
          >
            <DataGrid 
              rows={filasFiltradas} 
              columns={columns} 
              pageSize={5} 
              rowsPerPageOptions={[5]}
              disableSelectionOnClick 
              density="comfortable"
              autoHeight 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}