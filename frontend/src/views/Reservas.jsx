import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, FormControlLabel, Switch, Chip, Button, Stack, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  CancelScheduleSend as CancelIcon, 
  Room as RoomIcon, 
  CalendarMonth as CalendarIcon, 
  Person as PersonIcon,
  Layers as LayersIcon,
  Groups as GroupsIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function Reservas() {
  const { user, reservas, cancelarReserva, aulas } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [soloMias, setSoloMias] = useState(user?.role !== 'admin');
  const [aulaSeleccionada, setAulaSeleccionada] = useState(
    location.state?.aulaPreseleccionada || (aulas.length > 0 ? aulas[0].nombre : '')
  );

  // LÓGICA 1: RENDERIZADO EXCLUSIVO PARA PROFESORES Y ALUMNOS (CATÁLOGO VISUAL DE TARJETAS)
  if (user?.role !== 'admin') {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
          Explorá las aulas, laboratorios y auditorios habilitados en el campus. Seleccioná el espacio que necesites para solicitar el turno.
        </Typography>

        <Grid container spacing={3}>
          {aulas.map((aula) => (
            <Grid item xs={12} sm={6} md={4} key={aula.id}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', 
                  border: '1px solid #eef2f6',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0px 10px 25px rgba(15,92,179,0.08)', borderColor: '#0f5cb3' }
                }}
              >
                {/* Renderizado de la Imagen Fotográfica */}
                <CardMedia
                  component="img"
                  height="160"
                  image={aula.imagen || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'} 
                  alt={`Foto de ${aula.nombre}`}
                  sx={{ borderBottom: '1px solid #eef2f6' }}
                />

                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b', fontSize: '1.1rem', lineHeight: 1.2, mb: 1 }}>
                      {aula.nombre}
                    </Typography>
                    <Chip 
                      label={aula.tipo} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(15, 92, 179, 0.08)', color: '#0f5cb3', fontWeight: '700', fontSize: '0.7rem', borderRadius: 1.5 }} 
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> {aula.ubicacion}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> Capacidad: <strong>{aula.capacidad} pax</strong>
                  </Typography>

                  {/* Renderizado de la Descripción */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                    "{aula.descripcion || 'Sin descripción detallada del espacio.'}"
                  </Typography>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<LayersIcon />}
                    onClick={() => navigate('/reservar', { state: { aulaPreseleccionada: aula.nombre } })}
                    sx={{ 
                      mt: 'auto',
                      textTransform: 'none', 
                      borderRadius: 2.5, 
                      backgroundColor: '#0f5cb3', 
                      fontWeight: '700',
                      '&:hover': { backgroundColor: '#0c4d96' }
                    }}
                  >
                    Solicitar este Espacio
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // LÓGICA 2: RENDERIZADO EXCLUSIVO PARA ADMINISTRADORES (TABLA COMPLETA CON DATA GRID)
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: '500' }}>#{String(p.value).slice(-4)}</Typography> },
    { field: 'aula', headerName: 'Aula / Ubicación', flex: 1.5, minWidth: 180, renderCell: (p) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><RoomIcon sx={{ color: '#0f5cb3', fontSize: '1.1rem' }} /><Typography variant="body2" fontWeight="500" sx={{ color: '#2c3e50' }}>{p.value}</Typography></Box> },
    { field: 'solicitante', headerName: 'Reservado por', flex: 1, minWidth: 130, renderCell: (p) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PersonIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} /><Typography variant="body2">{p.value}</Typography></Box> },
    { field: 'fecha', headerName: 'Fecha y Hora', flex: 1.2, minWidth: 160, renderCell: (p) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarIcon sx={{ color: '#00a896', fontSize: '1.1rem' }} /><Typography variant="body2" sx={{ color: '#555' }}>{p.value}</Typography></Box> },
    { field: 'materiales', headerName: 'Materiales Asignados', flex: 1, minWidth: 140, renderCell: (p) => <Typography variant="body2" sx={{ fontStyle: p.value === 'Ninguno' ? 'italic' : 'normal', color: p.value === 'Ninguno' ? 'text.secondary' : 'text.primary' }}>{p.value}</Typography> },
    { 
      field: 'estado', 
      headerName: 'Estado', 
      width: 100, 
      renderCell: (p) => {
        const isActive = p.value === 'Activa';
        return <Chip label={p.value} size="small" sx={{ fontWeight: 'bold', borderRadius: '6px', fontSize: '0.75rem', backgroundColor: isActive ? '#e8f5e9' : '#ffebee', color: isActive ? '#2e7d32' : '#c62828', border: isActive ? '1px solid #c8e6c9' : '1px solid #ffcdd2' }} />
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones de Control',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" sx={{ alignItems: 'center', height: '100%' }}>
          {params.row.estado === 'Activa' ? (
            <Button variant="contained" color="error" size="small" startIcon={<CancelIcon />} onClick={() => cancelarReserva(params.id)} sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem', py: 0.5, px: 1.5, boxShadow: 'none', '&:hover': { backgroundColor: '#d32f2f', boxShadow: 'none' } }}>Anular</Button>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Sin acciones</Typography>
          )}
        </Stack>
      )
    }
  ];

  const filasFiltradas = soloMias ? reservas.filter(res => res.userId === user?.id) : reservas;

  return (
    <Box>
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <CardContent sx={{ py: '12px !important', px: 3 }}>
          <FormControlLabel control={<Switch checked={soloMias} onChange={(e) => setSoloMias(e.target.checked)} color="primary" />} label={<Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ userSelect: 'none' }}>Filtrar únicamente mis solicitudes personales</Typography>} />
        </CardContent>
      </Card>
      
      <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ height: 'auto', minHeight: 350, width: '100%', backgroundColor: 'white', '& .MuiDataGrid-root': { border: 'none' }, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }, '& .MuiDataGrid-columnHeaderTitle': { fontWeight: '700', color: '#475569', fontSize: '0.88rem' }, '& .MuiDataGrid-row': { borderBottom: '1px solid #f1f5f9', '&:nth-of-type(even)': { backgroundColor: '#f8fafc' }, '&:hover': { backgroundColor: '#f0fdfa !important' } }, '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' }, '& .MuiDataGrid-footerContainer': { borderTop: '2px solid #e2e8f0', backgroundColor: '#f8fafc' } }}>
            <DataGrid rows={filasFiltradas} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick density="comfortable" autoHeight />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}