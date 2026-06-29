import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

export default function DialogoAula({ open, onClose, onSave, aulaParaEditar }) {
  // Estado local e independiente para los campos del formulario, ahora incluye imagen y descripcion
  const [formData, setFormData] = useState({ 
    nombre: '', 
    ubicacion: '', 
    capacidad: '', 
    tipo: '',
    imagen: '',
    descripcion: ''
  });

  // Cada vez que cambia el aula elegida (o se limpia), actualizamos los campos
  useEffect(() => {
    if (aulaParaEditar) {
      setFormData({
        ...aulaParaEditar,
        imagen: aulaParaEditar.imagen || '',
        descripcion: aulaParaEditar.descripcion || ''
      });
    } else {
      setFormData({ nombre: '', ubicacion: '', capacidad: '', tipo: '', imagen: '', descripcion: '' });
    }
  }, [aulaParaEditar, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"> {/* Cambiado a 'md' para más espacio */}
      <DialogTitle fontWeight="bold">
        {aulaParaEditar ? '✏️ Modificar Espacio Físico' : '🏛️ Registrar Nueva Aula'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Campos principales */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre del Aula / Espacio"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ubicación Física (Edificio, Planta...)"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacidad Máxima de Alumnos"
                type="number"
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Espacio (Auditorio, Lab...)"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              />
            </Grid>

            {/* 🔥 NUEVOS CAMPOS: Imagen y Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL de la Fotografía de Referencia"
                placeholder="Ej: https://images.unsplash.com/photo-123..."
                value={formData.imagen}
                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                helperText="Pegá el enlace directo de una imagen de internet. Si dejás esto vacío, se usará una foto genérica."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción detallada de las instalaciones y recursos"
                placeholder="Ej: Aula equipada con 3 pizarrones digitales, proyector láser, tomas de corriente en pupitres..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', fontWeight: 'bold' }}>
            {aulaParaEditar ? 'Actualizar Cambios' : 'Guardar Espacio'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}