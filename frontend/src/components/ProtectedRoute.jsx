import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  // 1. Mientas se verifica el token contra la API de Django
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  // 2. Si no hay usuario autenticado -> Redirigir al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Normalizamos la verificación del rol (soporta tanto user.role como user.rol)
  const userRole = user.role || user.rol;

  // 4. Si la ruta requiere roles específicos y el usuario no los posee
  if (roles && (!userRole || !roles.includes(userRole))) {
    return <Navigate to="/clases" replace />;
  }

  // 5. Autenticado y autorizado -> Renderiza los componentes hijos
  return <Outlet />;
}