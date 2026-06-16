import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Badge, Avatar } from '@mui/material';
import { Tv as ProyectorIcon, Computer as LaptopIcon, Cable as CableIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

export default function StockMateriales() {
  const [inventario, setInventario] = useState([
    { id: 'proyector', nombre: 'Proyectores Epson X51', stock: 3, total: 5, icon: <ProyectorIcon fontSize="large" />, color: '#0f5cb3' },
    { id: 'notebooks', nombre: 'Kits Netbooks Educativas', stock: 2, total: 4, icon: <LaptopIcon fontSize="large" />, color: '#00a896' },
    { id: 'cables', nombre: 'Adaptadores HDMI / VGA', stock: 7, total: 10, icon: <CableIcon fontSize="large" />, color: '#fbc02d' },
  ]);

  const handleStockChange = (id, increment) => {
    setInventario(inventario.map(item => {
      if (item.id === id) {
        const nextStock = item.stock + (increment ? 1 : -1);
        if (nextStock >= 0 && nextStock <= item.total) {
          return { ...item, stock: nextStock };
        }
      }
      return item;
    }));
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Panel de Control de Recursos Fijos</Typography>
      
      <Grid container spacing={3}>
        {inventario.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', borderTop: `6px solid ${item.color}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 56, height: 56 }}>
                    {item.icon}
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">{item.stock}</Typography>
                    <Typography variant="caption" color="text.secondary">Disponibles de {item.total}</Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{item.nombre}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Nivel de ocupación actual: {((item.total - item.stock) / item.total * 100).toFixed(0)}%
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button fullWidth variant="outlined" startIcon={<RemoveIcon />} color="error" onClick={() => handleStockChange(item.id, false)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                    Prestar
                  </Button>
                  <Button fullWidth variant="contained" startIcon={<AddIcon />} color="success" onClick={() => handleStockChange(item.id, true)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                    Devolver
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}