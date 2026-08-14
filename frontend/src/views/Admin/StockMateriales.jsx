import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MaterialCard from '../../components/MaterialCard';
import { useAuth } from '../../context/AuthContext';
// 🏛️ import api from '../../api';

export default function StockMateriales() {
  const [open, setOpen] = useState(false);
  const { inventario, setInventario } = useAuth();
  const [form, setForm] = useState({ nombre: '', categoria: 'default', total: '' });

  // 🚀 ACTUALIZACIÓN DE STOCK ASÍNCRONA (PATCH)
  const handleStockChange = async (dbId, increment) => {
    // 1. Buscamos el ítem afectado y calculamos su nuevo stock
    const itemAfectado = inventario.find(i => i.id === dbId);
    if (!itemAfectado) return;
    
    const nextStock = itemAfectado.stock + (increment ? 1 : -1);
    
    // Validación de límites: no puede haber stock negativo ni mayor al total físico
    if (nextStock < 0 || nextStock > itemAfectado.total) return;

    // 2. Actualización optimista de la UI (rápida)
    const inventarioPrevio = [...inventario];
    setInventario(prev => prev.map(item => item.id === dbId ? { ...item, stock: nextStock } : item));

    try {
      // 3. Impactamos el cambio en Django
      // await api.patch(`/inventario/${dbId}/`, { stock: nextStock });
      console.log(`Stock del recurso ${dbId} actualizado a ${nextStock} en el servidor.`);
    } catch (error) {
      console.error("Error al actualizar stock en el servidor:", error);
      // Revertimos visualmente si la red falla
      setInventario(inventarioPrevio);
      alert("Hubo un error de sincronización. Comprueba tu conexión.");
    }
  };

  // 🚀 CREACIÓN DE RECURSO ASÍNCRONA (POST)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.total) return;

    try {
      // Generamos un color para el front (podrías guardarlo en DB si quieres)
      const colores = ['#0f5cb3', '#00a896', '#fbc02d', '#673ab7'];
      const colorAsignado = colores[(inventario?.length || 0) % colores.length];

      const payloadBackend = {
        nombre: form.nombre,
        categoria: form.categoria, // Cambiado de 'tipo' a 'categoria' para no usar la palabra reservada 'id'
        stock: Number(form.total), 
        total: Number(form.total),
        color: colorAsignado
      };

      // --- MODO PRODUCCIÓN DJANGO ---
      // const response = await api.post('/inventario/', payloadBackend);
      // const nuevoItemDB = response.data; // Aquí Django ya le asignó el 'id' real
      
      // Mock para mantener funcionando tu UI local:
      const nuevoIdDB = inventario.length > 0 ? Math.max(...inventario.map(i => i.id)) + 1 : 1;
      const nuevoItemDB = { ...payloadBackend, id: nuevoIdDB };

      setInventario((prev) => [...prev, nuevoItemDB]);
      
      setOpen(false);
      setForm({ nombre: '', categoria: 'default', total: '' });
    } catch (error) {
      console.error("Error al crear el material:", error);
      alert("No se pudo registrar el nuevo recurso.");
    }
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
          disableElevation
          sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
        >
          Nuevo Recurso
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Usamos i.id en vez del viejo uniqueId */}
        {inventario && inventario.map((item) => (
          <MaterialCard 
            key={item.id} 
            item={item} 
            onStockChange={(increment) => handleStockChange(item.id, increment)} 
          />
        ))}
      </Grid>

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
              value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
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
            <Button type="submit" variant="contained" disableElevation sx={{ backgroundColor: '#0f5cb3', textTransform: 'none' }}>
              Alta de Material
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}