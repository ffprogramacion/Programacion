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

// Mapeo dinámico para renderizar el icono según lo que elija o cree el Admin
const iconMap = {
  proyector: <ProyectorIcon fontSize="large" />,
  notebooks: <LaptopIcon fontSize="large" />,
  cables: <CableIcon fontSize="large" />,
  default: <DefaultIcon fontSize="large" />
};

export default function MaterialCard({ item, onStockChange }) {
  // Si el tipo de icono no existe en el mapa, usa el por defecto
  const renderIcon = iconMap[item.id] || iconMap['default'];

  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', borderTop: `6px solid ${item.color}`, height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 56, height: 56 }}>
              {renderIcon}
            </Avatar>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight="bold" color="text.primary">{item.stock}</Typography>
              <Typography variant="caption" color="text.secondary">Disponibles de {item.total}</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{item.nombre}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nivel de ocupación actual: {item.total > 0 ? ((item.total - item.stock) / item.total * 100).toFixed(0) : 0}%
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<RemoveIcon />} 
              color="error" 
              onClick={() => onStockChange(item.uniqueId, false)} 
              sx={{ borderRadius: 2, textTransform: 'none' }}
              disabled={item.stock === 0}
            >
              Prestar
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<AddIcon />} 
              color="success" 
              onClick={() => onStockChange(item.uniqueId, true)} 
              sx={{ borderRadius: 2, textTransform: 'none' }}
              disabled={item.stock === item.total}
            >
              Devolver
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}