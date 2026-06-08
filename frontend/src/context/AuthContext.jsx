import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simulamos un usuario inicial para que pruebes las vistas.
  // Cambia el role a 'teacher' o 'admin' para ver cómo se transforma la app.
  const [user, setUser] = useState({
    name: "Facundo Boide",
    role: "student", // Valores: 'student', 'teacher', 'admin'
    id: "12345"
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);