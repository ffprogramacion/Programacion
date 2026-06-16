import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();

  // Si no hay sesión activa, al login forzado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está autorizado para esta ruta específica, lo devuelve a su inicio
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/clases" replace />;
  }

  return <Outlet />;
}