import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Card, CardContent, FormControlLabel, Switch, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Reservas() {
  const { user } = useAuth();
  const [soloMias, setSoloMias] = useState(true);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'aula', headerName: 'Aula / Ubicación', width: 180 },
    { field: 'solicitante', headerName: 'Reservado por', width: 150 },
    { field: 'fecha', headerName: 'Fecha y Hora', width: 200 },
    { field: 'materiales', headerName: 'Materiales', width: 150 },
    { field: 'estado', headerName: 'Estado', width: 120, renderCell: (p) => <Chip label={p.value} color={p.value === 'Activa' ? 'success' : 'error'} size="small" /> },
  ];

  const todasLasReservas = [
    { id: 1, aula: 'Laboratorio 1', solicitante: 'Facundo Boide', fecha: '12/06/2026 - 14:00', materiales: 'Proyector', estado: 'Activa', userId: '12345' },
    { id: 2, aula: 'Aula 3', solicitante: 'Ing. Milton', fecha: '15/06/2026 - 09:00', materiales: 'Ninguno', estado: 'Activa', userId: '8888' }
  ];

  const filasFiltradas = soloMias ? todasLasReservas.filter(res => res.userId === user?.id) : todasLasReservas;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: '12px !important' }}>
          <FormControlLabel control={<Switch checked={soloMias} onChange={(e) => setSoloMias(e.target.checked)} />} label="Filtrar solo Mis Reservas" />
        </CardContent>
      </Card>
      <div style={{ height: 350, width: '100%', backgroundColor: 'white' }}>
        <DataGrid rows={filasFiltradas} columns={columns} pageSize={5} disableSelectionOnClick />
      </div>
    </Box>
  );
}