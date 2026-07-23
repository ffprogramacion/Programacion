import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; // O un Spinner de MUI

  // 1. Si no hay usuario logueado -> Redirigir a Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si el rol del usuario no está dentro de los roles permitidos -> Redirigir a Clases
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/clases" replace />;
  }

  // 3. Si pasa las validaciones, renderizar las rutas hijas
  return <Outlet />;
}