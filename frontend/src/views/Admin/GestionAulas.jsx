import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // 👈 Conexión al contexto global (ajusta los ../ según tu carpeta)
import { Box, Typography, Card, CardContent, Button, Stack, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Room as RoomIcon } from '@mui/icons-material';

export default function GestionAulas() {
  const { aulas, setAulas } = useAuth(); // 👈 Consumimos el estado global compartido
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });

  // Configuración de columnas fluida y elástica sin scroll horizontal
  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { 
      field: 'nombre', 
      headerName: 'Aula / Espacio', 
      flex: 1.5, 
      minWidth: 180,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <RoomIcon sx={{ color: '#0f5cb3' }} /> 
          <Typography variant="body2" fontWeight="500" sx={{ color: '#2c3e50' }}>{p.value}</Typography>
        </Box>
      )
    },
    { field: 'ubicacion', headerName: 'Ubicación Física', flex: 1.5, minWidth: 180 },
    { field: 'capacidad', headerName: 'Capacidad', flex: 0.8, minWidth: 90, type: 'number' },
    { field: 'tipo', headerName: 'Tipo de Aula', flex: 1, minWidth: 120 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
          <IconButton size="small" color="primary"><EditIcon /></IconButton>
          {/* 🔥 Sincronización global al eliminar */}
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => setAulas(aulas.filter(a => a.id !== params.id))}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      )
    }
  ];

  // 🔥 Sincronización global al guardar un aula nueva
  const handleSave = () => {
    if (!formData.nombre) return;
    
    const nuevoId = aulas.length > 0 ? Math.max(...aulas.map(a => a.id)) + 1 : 1;
    
    setAulas([
      ...aulas, 
      { 
        id: nuevoId, 
        ...formData, 
        capacidad: Number(formData.capacidad) || 0 
      }
    ]);
    
    setOpen(false);
    setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
          Control Patrimonial de Aulas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)} 
          sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
        >
          Agregar Nueva Aula
        </Button>
      </Box>

      {/* Tabla Estilizada con autoHeight */}
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
              rows={aulas} 
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

      {/* Modal CRUD */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">Registrar Espacio Físico</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Nombre del Aula" margin="normal" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          <TextField fullWidth label="Ubicación Detallada" margin="normal" value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} />
          <TextField fullWidth label="Capacidad de Alumnos" type="number" margin="normal" value={formData.capacidad} onChange={(e) => setFormData({...formData, capacidad: e.target.value})} />
          <TextField fullWidth label="Tipo (Ej: Informática, Común)" margin="normal" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#0f5cb3', textTransform: 'none' }}>
            Guardar Aula
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}