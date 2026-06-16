import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // 🔥 Movimos el listado de reservas al cerebro global
  const [reservas, setReservas] = useState([
    { id: 1, aula: 'Laboratorio de Sistemas 1', solicitante: 'Facundo Boide', fecha: '12/06/2026 - 14:00', materiales: 'Proyector Epson', estado: 'Activa', userId: '12345' },
    { id: 2, aula: 'Aula Magna', solicitante: 'Ing. Milton', fecha: '15/06/2026 - 09:00', materiales: 'Ninguno', estado: 'Activa', userId: '8888' },
    { id: 3, aula: 'Laboratorio de Electrónica', solicitante: 'Profesor Carlos', fecha: '19/06/2026 - 16:00', materiales: 'Kit Netbooks', estado: 'Cancelada', userId: '9999' }
  ]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Función global para agregar reservas desde cualquier pantalla
  const agregarReserva = (nuevaReserva) => {
    setReservas((prev) => [...prev, nuevaReserva]);
  };

  // Función global para cancelar reservas (para el Admin o el usuario)
  const cancelarReserva = (id) => {
    setReservas((prev) => prev.map(res => res.id === id ? { ...res, estado: 'Cancelada' } : res));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, reservas, agregarReserva, cancelarReserva }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);