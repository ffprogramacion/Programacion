import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../service/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [aulas, setAulas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [clases, setClases] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const inicializarSesion = async () => {
      const storedUser = localStorage.getItem('usuario_activo');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));

          // 🚀 Peticiones reales al backend (sin mock)
          const [resAulas, resReservas, resInventario, resClases] = await Promise.all([
            api.get('reservas/aulas/'),
            api.get('reservas/reservas/'),
            api.get('reservas/materiales/'),
            api.get('academia/comisiones/')
          ]);

          // 🚀 Blindaje anti-paginación: extrae el arreglo venga como venga
          setAulas(resAulas.data.results || resAulas.data);
          setReservas(resReservas.data.results || resReservas.data);
          setInventario(resInventario.data.results || resInventario.data);
          setClases(resClases.data.results || resClases.data);
        } catch (error) {
          console.error('Error al cargar datos del backend:', error);
        }
      }
      setLoading(false);
    };

    inicializarSesion();
  }, []);

  const logout = () => {
    setUser(null);
    setNotificaciones([]);
    setAulas([]);
    setClases([]);
    setReservas([]);
    localStorage.removeItem('usuario_activo');
    window.location.href = '/login'; // Redirección forzada para limpiar memoria
  };

  const agregarReserva = async (nuevaReserva) => {
    try {
      const { data: creada } = await api.post('/reservas/', nuevaReserva);
      setReservas((prev) => [creada, ...prev]);
    } catch (error) {
      console.error('Error al agregar reserva:', error);
      throw error;
    }
  };

  const cancelarReserva = async (id) => {
    try {
      await api.patch(`/reservas/${id}/`, { estado: 'Cancelada' });
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'Cancelada' } : r))
      );
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      throw error;
    }
  };

  const consumirRecursos = (materialesIds) => {
    setInventario(prev => prev.map(m => 
      materialesIds.includes(m.id) ? { ...m, stock_total: Math.max(0, m.stock_total - 1) } : m
    ));
  };

  const limpiarNotificaciones = () => setNotificaciones([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, 
        loading,
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
        consumirRecursos, 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);