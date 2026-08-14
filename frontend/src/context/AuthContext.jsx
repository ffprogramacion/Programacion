import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../service/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados de datos sincronizados con la API
  const [aulas, setAulas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [clases, setClases] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  // Función Helper para normalizar el usuario que viene de Django
  const normalizarUsuario = (userData) => {
    return {
      ...userData,
      // Mapeamos los datos anidados de Django a las variables planas que usa React
      role: userData.profile?.rol || 'student',
      name: userData.nombre_completo || userData.first_name || 'Usuario',
      legajo: userData.profile?.legajo
    };
  };

  // 1. Cargar el usuario y los datos iniciales
  useEffect(() => {
    const inicializarSesion = async () => {
      // Leemos el token de acceso directo (más seguro y fácil para axios)
      const token = localStorage.getItem('access');
      
      if (token) {
        try {
          // Consultamos el perfil del usuario autenticado
          const { data: userData } = await api.get('/me/'); 
          setUser(normalizarUsuario(userData));

          // Cargar datos principales en paralelo
          const [resAulas, resReservas, resInventario] = await Promise.all([
            api.get('reservas/aulas/'),
            api.get('reservas/reservas/'),
            api.get('reservas/materiales/'),
            api.get('academia/comisiones/')
            // Nota: Si tienes un endpoint para /clases/, agrégalo aquí
          ]);

          setAulas(resAulas.data);
          setReservas(resReservas.data);
          setInventario(resInventario.data);
          setClases(resClases.data);
        } catch (error) {
          console.error('Error al inicializar sesión:', error);
          logout(); 
        }
      }
      setLoading(false);
    };

    inicializarSesion();
  }, []);

  // 2. Función de Login con JWT
  const login = async (username, password) => {
    try {
      // POST al endpoint de SimpleJWT
      const { data } = await api.post('/token/', { username, password }); 
      
      // Guardamos tokens planos para que el interceptor de api.js los lea fácil
      localStorage.setItem('access', data.access);
      if (data.refresh) localStorage.setItem('refresh', data.refresh);
      
      // Obtenemos los datos del usuario recién logueado
      const { data: userData } = await api.get('/me/');
      
      const usuarioNormalizado = normalizarUsuario(userData);
      setUser(usuarioNormalizado);
      
      return usuarioNormalizado;
    } catch (error) {
      console.error('Error en el login:', error);
      throw new Error(error.response?.data?.detail || 'Credenciales incorrectas');
    }
  };

  // 3. Función de Logout
  const logout = () => {
    setUser(null);
    setNotificaciones([]);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('universidad_tokens'); // Por retrocompatibilidad si quedó alguno
  };

  // 4. Acciones conectadas a las APIs
  const agregarReserva = async (nuevaReserva) => {
    try {
      // En tu Reservar.jsx ya armamos el payloadBackend correcto
      const { data: creada } = await api.post('/reservas/', nuevaReserva);
      setReservas((prev) => [creada, ...prev]); // Colocamos la nueva primero
      setNotificaciones((prev) => [
        { id: Date.now(), text: `📅 Reservaste con éxito el espacio.` },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error al agregar reserva:', error);
      throw error;
    }
  };

  const cancelarReserva = async (id) => {
    try {
      // Ajustado al estándar de actualización parcial de DRF
      await api.patch(`/reservas/${id}/`, { estado: 'Cancelada' });
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'Cancelada' } : r))
      );
      setNotificaciones((prev) => [
        { id: Date.now(), text: `⚠️ Tu reserva fue cancelada.` },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  };

  // 🔥 5. Función Faltante: Consumir Recursos (Requerida por Reservar.jsx)
  const consumirRecursos = (materialesIds) => {
    // Actualización optimista del estado local. 
    // Django ya restará el stock real en la base de datos al guardar la reserva, 
    // pero esto evita que el usuario tenga que recargar la página para ver el nuevo stock.
    setInventario(prev => prev.map(m => 
      materialesIds.includes(m.id) ? { ...m, stock_total: Math.max(0, m.stock_total - 1) } : m
    ));
  };

  const limpiarNotificaciones = () => setNotificaciones([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        reservas,
        agregarReserva,
        cancelarReserva,
        notificaciones,
        limpiarNotificaciones,
        aulas,
        setAulas,
        clases,
        setClases,
        suscripciones,
        setSuscripciones,
        inventario,
        setInventario,
        consumirRecursos, // Exportamos la función
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);