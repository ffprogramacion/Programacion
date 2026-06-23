import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './views/Login';


import Clases from './views/Clases';
import Reservar from './views/Reservar';
import Reservas from './views/Reservas';
import Profile from './views/Profile';

import GestionAulas from './views/admin/GestionAulas'; 
import StockMateriales from './views/admin/StockMateriales';
import ControlUsuarios from './views/admin/ControlUsuarios';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />

          {/* Filtro de Seguridad Global */}
          <Route element={<ProtectedRoute roles={['student', 'teacher', 'admin']} />}>
            <Route element={<AppShell />}>
              {/* Rutas Comunes */}
              <Route path="/clases" element={<Clases />} />
              <Route path="/reservar" element={<Reservar />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/perfil" element={<Profile />} />

              {/* Rutas con Protección de Rol Avanzada (Solo Admin) */}
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin/aulas" element={<GestionAulas />} />
                <Route path="/admin/stock" element={<StockMateriales />} />
                <Route path="/admin/usuarios" element={<ControlUsuarios />} />
              </Route>

              {/* Redirección por Defecto */}
              <Route path="/" element={<Navigate to="/clases" replace />} />
            </Route>
          </Route>

          {/* Captura de Rutas Inválidas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;