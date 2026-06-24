import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

export default function ModalAula({ open, onClose, onSave, aulaEditar }) {
  const [formData, setFormData] = useState({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });

  // Sincronizador de estados del ciclo de vida del Modal
  useEffect(() => {
    if (aulaEditar) {
      setFormData({
        nombre: aulaEditar.nombre || '',
        ubicacion: aulaEditar.ubicacion || '',
        capacidad: aulaEditar.capacidad || '',
        tipo: aulaEditar.tipo || ''
      });
    } else {
      setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '' });
    }
  }, [aulaEditar, open]); 

  const handleConfirmar = () => {
    if (!formData.nombre) return;
    
    onSave({
      ...formData,
      capacidad: Number(formData.capacidad) || 0
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight="bold">
        {aulaEditar ? 'Modificar Espacio Físico' : 'Registrar Espacio Físico'}
      </DialogTitle>
      <DialogContent>
        <TextField 
          fullWidth 
          label="Nombre del Aula" 
          margin="normal" 
          value={formData.nombre} 
          onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
        />
        <TextField 
          fullWidth 
          label="Ubicación Detallada" 
          margin="normal" 
          value={formData.ubicacion} 
          onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} 
        />
        <TextField 
          fullWidth 
          label="Capacidad de Alumnos" 
          type="number" 
          margin="normal" 
          value={formData.capacidad} 
          onChange={(e) => setFormData({...formData, capacidad: e.target.value})} 
        />
        <TextField 
          fullWidth 
          label="Tipo (Ej: Informática, Común)" 
          margin="normal" 
          value={formData.tipo} 
          onChange={(e) => setFormData({...formData, tipo: e.target.value})} 
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirmar} 
          sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', fontWeight: 'bold' }}
        >
          {aulaEditar ? 'Guardar Cambios' : 'Registrar Aula'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}