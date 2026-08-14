import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

export default function DialogoAula({ open, onClose, onSave, aulaParaEditar }) {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    ubicacion: '', 
    capacidad: '', 
    tipo: '',
    imagen: '',
    descripcion: ''
  });

  useEffect(() => {
    if (aulaParaEditar && open) {
      // Si hay un aula para editar, cargamos sus datos exactos (incluyendo el ID oculto)
      setFormData({
        ...aulaParaEditar,
        imagen: aulaParaEditar.imagen || '',
        descripcion: aulaParaEditar.descripcion || '',
        capacidad: aulaParaEditar.capacidad || ''
      });
    } else if (!open) {
      // Cuando se cierra el modal, reseteamos a blanco para evitar "fantasmas" 
      // si el usuario abre inmediatamente el modal de "Registrar Nueva Aula"
      setFormData({ 
        nombre: '', 
        ubicacion: '', 
        capacidad: '', 
        tipo: '', 
        imagen: '', 
        descripcion: '' 
      });
    }
  }, [aulaParaEditar, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalizamos los datos antes de enviarlos a la API (Django)
    const payload = {
      ...formData,
      // Aseguramos que la capacidad sea un entero válido para la base de datos
      capacidad: formData.capacidad ? parseInt(formData.capacidad, 10) : 0,
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight="bold" sx={{ color: '#1a1a1a' }}>
        {aulaParaEditar ? '✏️ Modificar Espacio Físico' : '🏛️ Registrar Nueva Aula'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ backgroundColor: '#fdfdfd' }}>
          <Grid container spacing={3}>
            
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
                required
                label="Ubicación Física (Edificio, Planta...)"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Capacidad Máxima de Alumnos"
                type="number"
                inputProps={{ min: 1 }} // Validación nativa para evitar valores negativos
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Tipo de Espacio (Auditorio, Lab...)"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              />
            </Grid>

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
        
        <DialogActions sx={{ p: 2.5, backgroundColor: '#fdfdfd' }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disableElevation // Estilo más plano y moderno
            sx={{ 
              backgroundColor: '#0f5cb3', 
              textTransform: 'none', 
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#0c4a91' } // Efecto hover institucional
            }}
          >
            {aulaParaEditar ? 'Actualizar Cambios' : 'Guardar Espacio'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}