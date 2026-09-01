import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ roles }) {
  // 1. Verificamos si hay una sesión activa en el navegador
  const storedData = localStorage.getItem('usuario_activo');
  const user = storedData ? JSON.parse(storedData) : null;

  // Si no hay usuario logueado, se va al login obligatoriamente
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Extraemos y normalizamos el rol (buscamos en todas las rutas posibles del objeto)
  const rawRole = user?.profile?.rol || user?.rol || user?.role || 'student';
  const userRole = rawRole.toLowerCase();

  // 3. Validación estricta de Roles
  if (roles && roles.length > 0) {
    // Normalizamos la lista de roles permitidos que pasamos desde App.jsx
    const normalizedRoles = roles.map(r => r.toLowerCase());
    
    // Si el rol del usuario NO está incluido en los permitidos para esta ruta:
    if (!normalizedRoles.includes(userRole)) {
      // Lo redirigimos a su vista general permitida (por ejemplo, /clases)
      return <Navigate to="/clases" replace />;
    }
  }

  // 4. Si el usuario cuenta con el rol correcto, se le otorga el acceso
  return <Outlet />;
}