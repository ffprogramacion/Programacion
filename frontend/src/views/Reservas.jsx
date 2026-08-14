import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, FormControlLabel, Switch, Chip, Button, Stack, Typography, Grid, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  CancelScheduleSend as CancelIcon, 
  Room as RoomIcon, 
  CalendarMonth as CalendarIcon, 
  Person as PersonIcon,
  Layers as LayersIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
// 🏛️ import api from '../api';

export default function Reservas() {
  const { user, reservas, aulas, setReservas } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 NORMALIZACIÓN DE ROL
  const userRole = (user?.rol || user?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  const [soloMias, setSoloMias] = useState(!isAdmin);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // 🚀 CANCELACIÓN ASÍNCRONA A LA API
  const handleCancelarReserva = async (idReserva) => {
    if (!window.confirm("¿Estás seguro de que deseas anular esta reserva? Esta acción no se puede deshacer.")) return;
    
    setLoadingCancel(true);
    try {
      // --- MODO PRODUCCIÓN DJANGO ---
      // await api.patch(`/reservas/${idReserva}/`, { estado: 'Cancelada' });
      
      setReservas((prev) => 
        prev.map(res => res.id === idReserva ? { ...res, estado: 'Cancelada' } : res)
      );
      
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("Hubo un error al intentar anular la reserva. Verifique su conexión.");
    } finally {
      setLoadingCancel(false);
    }
  };


  // =========================================================================
  // LÓGICA 1: RENDERIZADO EXCLUSIVO PARA PROFESORES Y ALUMNOS (CATÁLOGO VISUAL)
  // =========================================================================
  if (!isAdmin) {
    if (!aulas || aulas.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, mt: 5 }}>
          <CircularProgress sx={{ color: '#0f5cb3' }} />
        </Box>
      );
    }

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
                      label={aula.tipo || aula.categoria || 'Espacio Común'} 
                      size="small" 
                      sx={{ bgcolor: 'rgba(15, 92, 179, 0.08)', color: '#0f5cb3', fontWeight: '700', fontSize: '0.7rem', borderRadius: 1.5 }} 
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> {aula.ubicacion || 'Ubicación no especificada'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} /> Capacidad: <strong>{aula.capacidad} pax</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontStyle: 'italic' }}>
                    "{aula.descripcion || 'Sin descripción detallada del espacio.'}"
                  </Typography>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<LayersIcon />}
                    onClick={() => navigate('/reservar', { state: { aulaPreseleccionada: aula.nombre } })}
                    disableElevation
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


  // =========================================================================
  // LÓGICA 2: RENDERIZADO EXCLUSIVO PARA ADMINISTRADORES (DATA GRID COMPLETO)
  // =========================================================================
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, renderCell: (p) => <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: '500' }}>#{String(p.value).slice(-4)}</Typography> },
    { 
      field: 'aula_detalle', // 🚀 Actualizado para mapear con Django
      headerName: 'Aula / Ubicación', 
      flex: 1.5, minWidth: 180, 
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RoomIcon sx={{ color: '#0f5cb3', fontSize: '1.1rem' }} />
          <Typography variant="body2" fontWeight="500" sx={{ color: '#2c3e50' }}>{p.row.aula_detalle?.nombre || p.row.aula}</Typography>
        </Box>
      )
    },
    { 
      field: 'solicitante_detalle', // 🚀 Actualizado para mapear con Django
      headerName: 'Reservado por', 
      flex: 1, minWidth: 130, 
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
          <Typography variant="body2">{p.row.solicitante_detalle?.nombre_completo || p.row.solicitante}</Typography>
        </Box>
      )
    },
    { 
      field: 'fecha_reserva', // 🚀 Actualizado para mapear con Django
      headerName: 'Fecha y Hora', 
      flex: 1.2, minWidth: 160, 
      renderCell: (p) => {
        // Formateador híbrido: entiende Django y el mock local
        let textoFecha = p.row.fecha;
        if (p.row.fecha_reserva && p.row.hora_inicio && p.row.hora_fin) {
          const [anio, mes, dia] = p.row.fecha_reserva.split('-');
          const inicio = p.row.hora_inicio.slice(0, 5);
          const fin = p.row.hora_fin.slice(0, 5);
          textoFecha = `${dia}/${mes}/${anio} - ${inicio} a ${fin} hs`;
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ color: '#00a896', fontSize: '1.1rem' }} />
            <Typography variant="body2" sx={{ color: '#555' }}>{textoFecha}</Typography>
          </Box>
        );
      }
    },
    { 
      field: 'materiales_detalles', // 🚀 Actualizado para mapear con Django
      headerName: 'Materiales Asignados', 
      flex: 1, minWidth: 140, 
      renderCell: (p) => {
        const mats = p.row.materiales_detalles?.length > 0 ? p.row.materiales_detalles.map(m => m.nombre).join(', ') : 'Ninguno';
        return (
          <Typography variant="body2" sx={{ fontStyle: mats === 'Ninguno' ? 'italic' : 'normal', color: mats === 'Ninguno' ? 'text.secondary' : 'text.primary' }}>
            {mats}
          </Typography>
        );
      }
    },
    { 
      field: 'estado', 
      headerName: 'Estado', 
      width: 100, 
      renderCell: (p) => {
        const estadoLabel = p.value || 'Activa';
        const isActive = estadoLabel.toLowerCase() === 'activa';
        return <Chip label={estadoLabel} size="small" sx={{ fontWeight: 'bold', borderRadius: '6px', fontSize: '0.75rem', backgroundColor: isActive ? '#e8f5e9' : '#ffebee', color: isActive ? '#2e7d32' : '#c62828', border: isActive ? '1px solid #c8e6c9' : '1px solid #ffcdd2' }} />
      }
    },
    {
      field: 'acciones',
      headerName: 'Acciones de Control',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" sx={{ alignItems: 'center', height: '100%' }}>
          {(params.row.estado || 'Activa').toLowerCase() === 'activa' ? (
            <Button 
              variant="contained" 
              color="error" 
              size="small" 
              startIcon={<CancelIcon />} 
              disabled={loadingCancel}
              onClick={() => handleCancelarReserva(params.id)} 
              sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem', py: 0.5, px: 1.5, boxShadow: 'none', '&:hover': { backgroundColor: '#d32f2f', boxShadow: 'none' } }}
            >
              Anular
            </Button>
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Sin acciones</Typography>
          )}
        </Stack>
      )
    }
  ];

  const filasFiltradas = soloMias ? reservas.filter(res => res.userId === user?.id || res.usuario_id === user?.id) : reservas;

  return (
    <Box>
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <CardContent sx={{ py: '12px !important', px: 3 }}>
          <FormControlLabel 
            control={<Switch checked={soloMias} onChange={(e) => setSoloMias(e.target.checked)} color="primary" />} 
            label={<Typography variant="body2" fontWeight="600" color="text.secondary" sx={{ userSelect: 'none' }}>Filtrar únicamente mis solicitudes personales</Typography>} 
          />
        </CardContent>
      </Card>
      
      <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ 
            height: 'auto', minHeight: 350, width: '100%', backgroundColor: 'white', 
            '& .MuiDataGrid-root': { border: 'none' }, 
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }, 
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: '700', color: '#475569', fontSize: '0.88rem' }, 
            '& .MuiDataGrid-row': { borderBottom: '1px solid #f1f5f9', '&:nth-of-type(even)': { backgroundColor: '#f8fafc' }, '&:hover': { backgroundColor: '#f0fdfa !important' } }, 
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center' }, 
            '& .MuiDataGrid-footerContainer': { borderTop: '2px solid #e2e8f0', backgroundColor: '#f8fafc' } 
          }}>
            <DataGrid 
              rows={filasFiltradas} 
              columns={columns} 
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick 
              density="comfortable" 
              autoHeight 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}