import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MaterialCard from '../../components/MaterialCard';
// 🔥 IMPORTAMOS EL CONTEXTO GLOBAL
import { useAuth } from '../../context/AuthContext';

export default function StockMateriales() {
  const [open, setOpen] = useState(false);
  
  // 🔥 Usamos el INVENTARIO GLOBAL del Contexto, chau al estado local
  const { inventario, setInventario } = useAuth();

  // Estado para el formulario del nuevo producto
  const [form, setForm] = useState({ nombre: '', tipo: 'default', total: '' });

  const handleStockChange = (uniqueId, increment) => {
    // 🔥 ACTUALIZACIÓN BLINDADA
    setInventario((prev) => {
      const nuevoInv = prev.map(item => {
        if (item.uniqueId === uniqueId) {
          const nextStock = item.stock + (increment ? 1 : -1);
          if (nextStock >= 0 && nextStock <= item.total) {
            return { ...item, stock: nextStock };
          }
        }
        return item;
      });
      // Guardado forzado instantáneo
      localStorage.setItem('universidad_inventario', JSON.stringify(nuevoInv));
      return nuevoInv;
    });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.total) return;

    setInventario((prev) => {
      const colores = ['#0f5cb3', '#00a896', '#fbc02d', '#673ab7'];
      const colorAsignado = colores[prev.length % colores.length];

      const nuevoItem = {
        uniqueId: Date.now(), // ID numérico único
        id: form.tipo,
        nombre: form.nombre,
        stock: Number(form.total), 
        total: Number(form.total),
        color: colorAsignado
      };

      const nuevoInv = [...prev, nuevoItem];
      // Guardado forzado instantáneo
      localStorage.setItem('universidad_inventario', JSON.stringify(nuevoInv));
      return nuevoInv;
    });

    setOpen(false);
    setForm({ nombre: '', tipo: 'default', total: '' }); // Reset formulario
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
          Panel de Control de Recursos Fijos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
        >
          Nuevo Recurso
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {inventario && inventario.map((item) => (
          <MaterialCard 
            key={item.uniqueId} 
            item={item} 
            onStockChange={handleStockChange} 
          />
        ))}
      </Grid>

      {/* Modal para Crear Producto */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleCreateProduct}>
          <DialogTitle fontWeight="bold">Registrar Nuevo Material</DialogTitle>
          <DialogContent>
            <TextField 
              fullWidth label="Nombre del Recurso" margin="normal" required
              value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <TextField 
              fullWidth select label="Categoría / Icono" margin="normal"
              value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <MenuItem value="default">Genérico / Caja de Herramientas</MenuItem>
              <MenuItem value="proyector">Proyector / TV</MenuItem>
              <MenuItem value="notebooks">Notebook / PC</MenuItem>
              <MenuItem value="cables">Cables / Conectores</MenuItem>
            </TextField>
            <TextField 
              fullWidth type="number" label="Cantidad Total en Inventario" margin="normal" required
              inputProps={{ min: 1 }} value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f5cb3', textTransform: 'none' }}>
              Alta de Material
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}