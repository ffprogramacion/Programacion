import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TablaAulas from '../../components/TablaAulas';
import DialogoAula from '../../components/DialogoAula';

export default function GestionAulas() {
  const { aulas, setAulas } = useAuth();
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

  const abrirCreacion = () => {
    setAulaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEdicion = (aula) => {
    setAulaSeleccionada(aula);
    setModalAbierto(true);
  };

  // 🔥 GUARDADO BLINDADO: Usamos 'prevAulas' para evitar bugs de memoria al navegar
  const procesarGuardar = (datosFormulario) => {
    setAulas((prevAulas) => {
      let nuevoArr;
      if (aulaSeleccionada) {
        // MODO EDICIÓN
        nuevoArr = prevAulas.map(a => 
          a.id === aulaSeleccionada.id 
            ? { ...a, ...datosFormulario, capacidad: Number(datosFormulario.capacidad) || 0 } 
            : a
        );
      } else {
        // MODO CREACIÓN
        const nuevoId = prevAulas.length > 0 ? Math.max(...prevAulas.map(a => a.id)) + 1 : 1;
        nuevoArr = [...prevAulas, { ...datosFormulario, id: nuevoId, capacidad: Number(datosFormulario.capacidad) || 0 }];
      }
      
      // Sincronización instantánea con el almacenamiento físico
      localStorage.setItem('universidad_aulas', JSON.stringify(nuevoArr));
      return nuevoArr;
    });
    
    setModalAbierto(false);
  };

  // 🔥 BORRADO BLINDADO
  const procesarBorrar = (id) => {
    setAulas((prevAulas) => {
      const nuevoArr = prevAulas.filter(a => a.id !== id);
      localStorage.setItem('universidad_aulas', JSON.stringify(nuevoArr));
      return nuevoArr;
    });
  };

  return (
    <Box sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a1a1a' }}>
          Control Patrimonial de Aulas
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={abrirCreacion} 
          sx={{ backgroundColor: '#0f5cb3', textTransform: 'none', borderRadius: 2, fontWeight: 'bold', '&:hover': { backgroundColor: '#0c4d96' } }}
        >
          Agregar Nueva Aula
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <CardContent sx={{ p: 0 }}>
          {/* FALLBACK DE SEGURIDAD: Evita que el DataGrid colapse si el array está indefinido */}
          <TablaAulas datos={aulas || []} onEdit={abrirEdicion} onDelete={procesarBorrar} />
        </CardContent>
      </Card>

      <DialogoAula 
        open={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={procesarGuardar} 
        aulaParaEditar={aulaSeleccionada} 
      />
    </Box>
  );
}