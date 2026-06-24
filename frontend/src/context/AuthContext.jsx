import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Usuario
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('universidad_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // 2. Aulas
  const [aulas, setAulas] = useState(() => {
    const savedAulas = localStorage.getItem('universidad_aulas');
    if (savedAulas) {
      try {
        const parsed = JSON.parse(savedAulas);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error leyendo aulas, reseteando...", e);
      }
    }
    
    const aulasPorDefecto = [
      { id: 1, nombre: 'Laboratorio de Sistemas 1', ubicacion: 'Planta Alta - Edificio Azul', capacidad: 30, tipo: 'Informática' },
      { id: 2, nombre: 'Laboratorio de Electrónica', ubicacion: 'Planta Baja - Bloque I+D', capacidad: 20, tipo: 'Taller Técnico' },
      { id: 3, nombre: 'Aula Magna', ubicacion: 'Bloque Central', capacidad: 120, tipo: 'Auditorio' },
      { id: 4, nombre: 'Sala de Estudio Común', ubicacion: 'Anexo Biblioteca', capacidad: 15, tipo: 'Estudio' },
    ];
    localStorage.setItem('universidad_aulas', JSON.stringify(aulasPorDefecto));
    return aulasPorDefecto;
  });

  // 3. Clases / Materias Centralizadas
  const [clases, setClases] = useState(() => {
    const savedClases = localStorage.getItem('universidad_clases');
    return savedClases ? JSON.parse(savedClases) : [
      { id: 1, nombre: 'Álgebra Lineal', profesorId: 'prof-1', profesor: 'Ing. Milton', ubicacion: 'Laboratorio de Sistemas 2', horario: 'Lunes 14:00 a 18:00', alumnosCount: 24, clave: 'ALG2026' },
      { id: 2, nombre: 'Sistemas Embebidos', profesorId: 'prof-1', profesor: 'Ing. Milton', ubicacion: 'Aula 3', horario: 'Miércoles 09:00 a 13:00', alumnosCount: 18, clave: 'EMB32' }
    ];
  });

  // 4. Suscripciones de alumnos a las materias
  const [suscripciones, setSuscripciones] = useState(() => {
    const savedSusc = localStorage.getItem('universidad_suscripciones');
    return savedSusc ? JSON.parse(savedSusc) : [
      { id: 1, alumnoId: '12345', claseId: 2 } // Facundo Boide pre-inscrito en Sistemas Embebidos
    ];
  });

  // 5. Reservas con soporte para id de clase
  const [reservas, setReservas] = useState(() => {
    const savedReservas = localStorage.getItem('universidad_reservas');
    return savedReservas ? JSON.parse(savedReservas) : [
      { id: 1, aula: 'Laboratorio de Sistemas 1', solicitante: 'Facundo Boide', fecha: '12/06/2026 - de 14:00 a 16:00 hs', materiales: 'Proyector Epson', estado: 'Activa', userId: '12345', claseId: null },
      { id: 2, aula: 'Aula Magna', solicitante: 'Ing. Milton', fecha: '15/06/2026 - de 09:00 a 12:00 hs', materiales: 'Ninguno', estado: 'Activa', userId: 'prof-1', claseId: 1 }
    ];
  });

  // 6. Notificaciones
  const [notificaciones, setNotificaciones] = useState(() => {
    const savedNotifs = localStorage.getItem('universidad_notificaciones');
    return savedNotifs ? JSON.parse(savedNotifs) : [
      { id: 1, text: "✨ Sistema: Bienvenido al gestor de reservas de aulas UNRaf." }
    ];
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  // Sincronizadores estrictos con localStorage
  useEffect(() => {
    localStorage.setItem('universidad_reservas', JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    localStorage.setItem('universidad_notificaciones', JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    localStorage.setItem('universidad_aulas', JSON.stringify(aulas));
  }, [aulas]);

  useEffect(() => {
    localStorage.setItem('universidad_clases', JSON.stringify(clases));
  }, [clases]);

  useEffect(() => {
    localStorage.setItem('universidad_suscripciones', JSON.stringify(suscripciones));
  }, [suscripciones]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('universidad_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setNotificaciones([]);
    localStorage.removeItem('universidad_user');
    localStorage.removeItem('universidad_notificaciones');
  };

  const agregarReserva = (nuevaReserva) => {
    setReservas((prev) => {
      const nuevoId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
      
      setNotificaciones((prevNotif) => [
        { id: Date.now(), text: `📅 Reservaste con éxito el espacio: ${nuevaReserva.aula}.` },
        ...prevNotif
      ]);

      return [...prev, { ...nuevaReserva, id: nuevoId, estado: 'Activa' }];
    });
  };

  const cancelarReserva = (id) => {
    let aulaNombre = "un aula";
    setReservas((prev) => prev.map(res => {
      if (res.id === id) {
        aulaNombre = res.aula;
        return { ...res, estado: 'Cancelada' };
      }
      return res;
    }));

    setNotificaciones((prevNotif) => [
      { id: Date.now(), text: `⚠️ Tu reserva de "${aulaNombre}" fue dada de baja por el Administrador.` },
      ...prevNotif
    ]);
  };

  const limpiarNotificaciones = () => setNotificaciones([]);

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, logout, setUser, 
      reservas, agregarReserva, cancelarReserva,
      notificaciones, limpiarNotificaciones,
      aulas, setAulas, clases, setClases, suscripciones, setSuscripciones
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);