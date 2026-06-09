import { useState } from 'react'
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './views/Login';
import Clases from './views/Clases';
import Reservar from './views/Reservar';
import Reservas from './views/Reservas';
import Profile from './views/Profile';

function App() {
return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/clases" element={<Clases />} />
              <Route path="/reservar" element={<Reservar />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/perfil" element={<Profile />} />
              
              {/* Vistas de ejemplo para cuando crees las pantallas de admin */}

              <Route path="/" element={<Navigate to="/clases" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
