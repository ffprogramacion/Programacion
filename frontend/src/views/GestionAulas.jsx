import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Room as RoomIcon } from '@mui/icons-material';

export default function GestionAulas() {
  const [open, setOpen] = useState(false);
  const [aulas, setAulas] = useState([
    { id: 1, nombre: 'Laboratorio de Sistemas 1', ubicacion: 'Planta Alta - Edificio Azul', capacidad: 30, tipo: 'Informática' },
    { id: 2, nombre: 'Laboratorio de Electrónica', ubicacion: 'Planta Baja - Bloque I+D', capacidad: 20, tipo: 'Taller Técnico' },
    { id: 3, nombre: 'Aula Magna', ubicacion: 'Bloque Central', capacidad: 120, tipo: 'Auditorio' },
    { id: 4, nombre: 'Sala de Estudio Común', ubicacion: 'Anexo Biblioteca', capacidad: 15, tipo: 'Estudio' },
  ]);

  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });

  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'nombre', headerName: 'Aula / Espacio', width: 220, renderCell: (p) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
        <RoomIcon sx={{ color: '#0f5cb3' }} /> {p.value}
      </Box>
    )},
    { field: 'ubicacion', headerName: 'Ubicación Física', width: 220 },
    { field: 'capacidad', headerName: 'Capacidad', width: 110, type: 'number' },
    { field: 'tipo', headerName: 'Tipo de Aula', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', height: '100%' }}>
          <IconButton size="small" color="primary"><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => setAulas(aulas.filter(a => a.id !== params.id))}><DeleteIcon /></IconButton>
        </Stack>
      )
    }
  ];

  const handleSave = () => {
    setAulas([...aulas, { id: aulas.length + 1, ...formData, capacidad: Number(formData.capacidad) }]);
    setOpen(false);
    setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a1a1a' }}>Control Patrimonial de Aulas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2 }}>
          Agregar Nueva Aula
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <div style={{ height: 400, width: '100%', backgroundColor: 'white' }}>
            <DataGrid rows={aulas} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick sx={{ border: 'none' }} />
          </div>
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
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#0f5cb3', textTransform: 'none' }}>Guardar Aula</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}