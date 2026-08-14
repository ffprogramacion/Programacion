import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TablaAulas from '../../components/TablaAulas';
import DialogoAula from '../../components/DialogoAula';
// 🏛️ import api from '../../api';

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

  // 🚀 GUARDADO ASÍNCRONO CON LA API
  const procesarGuardar = async (datosFormulario) => {
    try {
      if (aulaSeleccionada) {
        // --- MODO EDICIÓN (PUT / PATCH) ---
        // const response = await api.put(`/aulas/${aulaSeleccionada.id}/`, datosFormulario);
        // const aulaActualizadaDB = response.data;

        // Mock para mantener funcionando tu UI actual:
        const aulaActualizadaDB = { 
          ...aulaSeleccionada, 
          ...datosFormulario, 
          capacidad: Number(datosFormulario.capacidad) || 0 
        };
        
        // Actualizamos el estado solo después de una respuesta exitosa
        setAulas((prevAulas) => prevAulas.map(a => a.id === aulaSeleccionada.id ? aulaActualizadaDB : a));
      } else {
        // --- MODO CREACIÓN (POST) ---
        // Al enviar el POST sin ID, Django lo crea y nos devuelve el objeto con el ID real de la BD.
        // const response = await api.post('/aulas/', datosFormulario);
        // const nuevaAulaDB = response.data;

        // Mock para mantener funcionando tu UI actual:
        const nuevoIdDB = aulas.length > 0 ? Math.max(...aulas.map(a => a.id)) + 1 : 1;
        const nuevaAulaDB = { 
          ...datosFormulario, 
          id: nuevoIdDB, 
          capacidad: Number(datosFormulario.capacidad) || 0 
        };
        
        // Agregamos el aula oficial de la base de datos a nuestro estado
        setAulas((prevAulas) => [...prevAulas, nuevaAulaDB]);
      }
      
      setModalAbierto(false);
    } catch (error) {
      console.error("Error al guardar el aula en el servidor:", error);
      alert("Hubo un problema de conexión al guardar. Revisa la consola.");
    }
  };

  // 🚀 BORRADO ASÍNCRONO SEGURO
  const procesarBorrar = async (id) => {
    // Es buena práctica de UX pedir confirmación antes de disparar un DELETE
    if (!window.confirm("¿Estás seguro de que deseas eliminar este espacio del sistema?")) return;

    try {
      // Petición DELETE a Django:
      // await api.delete(`/aulas/${id}/`);
      
      // Si la API responde OK, borramos del frontend
      setAulas((prevAulas) => prevAulas.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error al borrar el aula:", error);
      alert("No se pudo eliminar el aula. Es posible que tenga reservas activas asociadas.");
    }
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
          disableElevation
          sx={{ 
            backgroundColor: '#0f5cb3', 
            textTransform: 'none', 
            borderRadius: 2, 
            fontWeight: 'bold', 
            px: 3,
            '&:hover': { backgroundColor: '#0c4d96' } 
          }}
        >
          Agregar Nueva Aula
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 0 }}>
          <TablaAulas datos={aulas || []} onEdit={abrirEdicion} onDelete={procesarBorrar} />
        </CardContent>
      </Card>

      {/* Condicionamos el renderizado para que el componente se desmonte y limpie sus estados internos */}
      {modalAbierto && (
        <DialogoAula 
          open={modalAbierto} 
          onClose={() => setModalAbierto(false)} 
          onSave={procesarGuardar} 
          aulaParaEditar={aulaSeleccionada} 
        />
      )}
    </Box>
  );
}