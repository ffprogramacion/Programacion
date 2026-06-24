import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Card, CardContent, Button, Stack, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Room as RoomIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

export default function GestionAulas() {
  const { aulas, setAulas } = useAuth();
  
  // Estados de control del formulario integrado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  
  // Estado para los campos de texto
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });

  const handleIniciarCrear = () => {
    setAulaSeleccionada(null);
    setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });
    setMostrarFormulario(true);
  };

  const handleIniciarEditar = (aula) => {
    setAulaSeleccionada(aula);
    setFormData({
      nombre: aula.nombre || '',
      ubicacion: aula.ubicacion || '',
      capacidad: aula.capacidad || '',
      tipo: aula.tipo || ''
    });
    setMostrarFormulario(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formData.nombre) return;

    if (aulaSeleccionada) {
      // MODO EDICIÓN
      setAulas(aulas.map(a => a.id === aulaSeleccionada.id ? { ...a, ...formData, capacidad: Number(formData.capacidad) || 0 } : a));
    } else {
      // MODO CREACIÓN
      const nuevoId = aulas.length > 0 ? Math.max(...aulas.map(a => a.id)) + 1 : 1;
      setAulas([...aulas, { id: nuevoId, ...formData, capacidad: Number(formData.capacidad) || 0 }]);
    }

    // Reset de estados
    setMostrarFormulario(false);
    setAulaSeleccionada(null);
    setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { 
      field: 'nombre', 
      headerName: 'Aula / Espacio', 
      flex: 1.2, 
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <RoomIcon sx={{ color: '#0f5cb3', fontSize: '18px' }} /> 
          <Typography variant="body2" fontWeight="500">{p.value}</Typography>
        </Box>
      )
    },
    { field: 'ubicacion', headerName: 'Ubicación Física', flex: 1.2 },
    { field: 'capacidad', headerName: 'Capacidad', flex: 0.7, type: 'number' },
    { field: 'tipo', headerName: 'Tipo', flex: 0.9 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
            onClick={() => handleIniciarEditar(params.row)}
            sx={{ textTransform: 'none', py: 0.3, px: 1, fontSize: '0.75rem', borderRadius: 1.5, backgroundColor: '#0f5cb3' }}
          >
            Editar
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setAulas(aulas.filter(a => a.id !== params.id))}
            sx={{ textTransform: 'none', py: 0.3, px: 1, fontSize: '0.75rem', borderRadius: 1.5, minWidth: 'auto' }}
          >
            <DeleteIcon sx={{ fontSize: '14px' }} />
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      
      {/* CABECERA PRINCIPAL */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
          Control Patrimonial de Aulas
        </Typography>
        {!mostrarFormulario && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleIniciarCrear} 
            sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold', '&:hover': { backgroundColor: '#0c4d96' } }}
          >
            Agregar Nueva Aula
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        
        {/* 🗛 BLOQUE 1: FORMULARIO INTEGRADO (Aparece ARRIBA ocupando todo el ancho disponible) */}
        {mostrarFormulario && (
          <Grid item xs={12}>
            <Card 
              component="form"
              onSubmit={handleGuardar}
              sx={{ 
                borderRadius: 4, 
                boxShadow: '0px 8px 30px rgba(0,0,0,0.05)', 
                border: '1px solid #0f5cb3',
                mb: 1
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
                    {aulaSeleccionada ? `✏️ Modificando: ${aulaSeleccionada.nombre} (ID: ${aulaSeleccionada.id})` : '🏛️ Registrar Nuevo Espacio Físico'}
                  </Typography>
                  <IconButton size="small" onClick={() => setMostrarFormulario(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      fullWidth 
                      required
                      label="Nombre del Aula" 
                      value={formData.nombre} 
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      fullWidth 
                      label="Ubicación Física" 
                      value={formData.ubicacion} 
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      fullWidth 
                      label="Capacidad Alumnos" 
                      type="number"
                      value={formData.capacidad} 
                      onChange={(e) => setFormData({...formData, capacidad: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      fullWidth 
                      label="Tipo de Espacio" 
                      value={formData.tipo} 
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => { setMostrarFormulario(false); setAulaSeleccionada(null); }}
                    sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold', px: 4, '&:hover': { backgroundColor: '#0c4d96' } }}
                  >
                    {aulaSeleccionada ? 'Actualizar Cambios' : 'Guardar Espacio'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 📊 BLOQUE 2: LA TABLA CON LA GRILLA DE MATERIAL UI */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0px 8px 24px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ width: '100%', backgroundColor: 'white' }}>
                <DataGrid 
                  rows={aulas} 
                  columns={columns} 
                  pageSize={5} 
                  rowsPerPageOptions={[5]} 
                  autoHeight
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}