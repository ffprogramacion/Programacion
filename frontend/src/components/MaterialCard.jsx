import React from 'react';
import { Grid, Card, CardContent, Box, Avatar, Typography, Stack, Button } from '@mui/material';
import { 
  Tv as ProyectorIcon, 
  Computer as LaptopIcon, 
  Cable as CableIcon, 
  Category as DefaultIcon,
  Add as AddIcon, 
  Remove as RemoveIcon 
} from '@mui/icons-material';

// 🔄 Asignación inteligente de íconos basada en el nombre del material
const getIconMap = (nombre) => {
  if (!nombre) return <DefaultIcon fontSize="large" />;
  
  const nombreNormalizado = nombre.toLowerCase();
  
  if (nombreNormalizado.includes('proyector') || nombreNormalizado.includes('cañón')) {
    return <ProyectorIcon fontSize="large" />;
  }
  if (nombreNormalizado.includes('notebook') || nombreNormalizado.includes('laptop') || nombreNormalizado.includes('pc')) {
    return <LaptopIcon fontSize="large" />;
  }
  if (nombreNormalizado.includes('cable') || nombreNormalizado.includes('alargue') || nombreNormalizado.includes('adaptador')) {
    return <CableIcon fontSize="large" />;
  }
  
  return <DefaultIcon fontSize="large" />;
};

export default function MaterialCard({ item, onStockChange }) {
  const renderIcon = getIconMap(item.nombre);
  
  // Prevención de fallos si la API no envía un color definido (usamos el institucional)
  const cardColor = item.color || '#0f5cb3'; 
  
  // Valores por defecto seguros para evitar NaN o divisiones por cero
  const total = item.total || 0;
  const stock = item.stock || 0;
  const porcentajeOcupacion = total > 0 ? ((total - stock) / total * 100).toFixed(0) : 0;

  return (
    <Grid item xs={12} md={4}>
      <Card 
        sx={{ 
          borderRadius: 3, 
          boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', 
          borderTop: `6px solid ${cardColor}`, 
          height: '100%' 
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: `${cardColor}15`, color: cardColor, width: 56, height: 56 }}>
              {renderIcon}
            </Avatar>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight="bold" color="text.primary">{stock}</Typography>
              <Typography variant="caption" color="text.secondary">Disponibles de {total}</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {item.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nivel de ocupación actual: {porcentajeOcupacion}%
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<RemoveIcon />} 
              color="error" 
              // 🚀 Cambio crítico: usamos item.id estándar de DB
              onClick={() => onStockChange(item.id, false)} 
              sx={{ borderRadius: 2, textTransform: 'none' }}
              disabled={stock === 0}
            >
              Prestar
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<AddIcon />} 
              color="success" 
              // 🚀 Cambio crítico: usamos item.id estándar de DB
              onClick={() => onStockChange(item.id, true)} 
              sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
              disabled={stock === total}
            >
              Devolver
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}