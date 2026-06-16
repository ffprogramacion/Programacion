import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Intentamos levantar el usuario del localStorage si existe al iniciar la app
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('universidad_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Estado de carga para que ProtectedRoute espere antes de redirigir
  const [loading, setLoading] = useState(true);

  // 📝 Estado provisional de reservas (Hardcodeado con persistencia básica)
  const [reservas, setReservas] = useState(() => {
    const savedReservas = localStorage.getItem('universidad_reservas');
    return savedReservas ? JSON.parse(savedReservas) : [
      { id: 1, aula: 'Laboratorio de Sistemas 1', solicitante: 'Facundo Boide', fecha: '12/06/2026 - 14:00', materiales: 'Proyector Epson', estado: 'Activa', userId: '12345' },
      { id: 2, aula: 'Aula Magna', solicitante: 'Ing. Milton', fecha: '15/06/2026 - 09:00', materiales: 'Ninguno', estado: 'Activa', userId: '8888' },
      { id: 3, aula: 'Laboratorio de Electrónica', solicitante: 'Profesor Carlos', fecha: '19/06/2026 - 16:00', materiales: 'Kit Netbooks', estado: 'Cancelada', userId: '9999' }
    ];
  });

  // Efecto para apagar el loading inicial una vez cargado el estado
  useEffect(() => {
    setLoading(false);
  }, []);

  // Sincronizar el estado de reservas con localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('universidad_reservas', JSON.stringify(reservas));
  }, [reservas]);

  // Login: Guarda en estado y en localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('universidad_user', JSON.stringify(userData));
  };

  // Logout: Limpia estado y saca del localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('universidad_user');
  };

  // Función global para agregar reservas (genera IDs únicos incrementales autogestionados)
  const agregarReserva = (nuevaReserva) => {
    setReservas((prev) => {
      const nuevoId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
      return [...prev, { ...nuevaReserva, id: nuevoId, estado: 'Activa' }];
    });
  };

  // Función global para cancelar reservas
  const cancelarReserva = (id) => {
    setReservas((prev) => 
      prev.map(res => res.id === id ? { ...res, estado: 'Cancelada' } : res)
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      setUser, 
      reservas, 
      agregarReserva, 
      cancelarReserva 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);