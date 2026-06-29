import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('universidad_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // 🏛️ INICIALIZADOR ROBUSTO: Respeta si el array está vacío para no inyectar "zombies"
  const [aulas, setAulas] = useState(() => {
    const savedAulas = localStorage.getItem('universidad_aulas');
    if (savedAulas !== null) {
      try {
        const parsed = JSON.parse(savedAulas);
        if (Array.isArray(parsed)) return parsed; // Acepta arrays vacíos []
      } catch (e) {
        console.error("Error leyendo aulas, reseteando...", e);
      }
    }
    
    // Solo inyecta esto la primerísima vez que se entra al sistema
    const aulasPorDefecto = [
      { 
        id: 1, 
        nombre: 'Laboratorio de Sistemas 1', 
        ubicacion: 'Planta Alta - Edificio Azul', 
        capacidad: 30, 
        tipo: 'Informática',
        imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
        descripcion: 'Laboratorio equipado con 30 estaciones de trabajo, proyectores duales y pizarrones inteligentes para clases de programación.'
      },
      { 
        id: 2, 
        nombre: 'Laboratorio de Electrónica', 
        ubicacion: 'Planta Baja - Bloque I+D', 
        capacidad: 20, 
        tipo: 'Taller Técnico',
        imagen: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
        descripcion: 'Espacio acondicionado con osciloscopios, fuentes regulables y estaciones de soldado para prácticas de hardware y embebidos.'
      },
      { 
        id: 3, 
        nombre: 'Aula Magna', 
        ubicacion: 'Bloque Central', 
        capacidad: 120, 
        tipo: 'Auditorio',
        imagen: 'https://images.unsplash.com/photo-1592284988788-b21a8a25c34d?q=80&w=800&auto=format&fit=crop',
        descripcion: 'Auditorio principal con acústica profesional, sistema de microfonía y pantalla gigante para conferencias y seminarios masivos.'
      },
      { 
        id: 4, 
        nombre: 'Sala de Estudio Común', 
        ubicacion: 'Anexo Biblioteca', 
        capacidad: 15, 
        tipo: 'Estudio',
        imagen: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=800&auto=format&fit=crop',
        descripcion: 'Espacio silencioso para lectura y trabajos en grupos reducidos. Cuenta con tomas de corriente en cada mesa.'
      },
    ];
    localStorage.setItem('universidad_aulas', JSON.stringify(aulasPorDefecto));
    return aulasPorDefecto;
  });

  const [clases, setClases] = useState(() => {
    const savedClases = localStorage.getItem('universidad_clases');
    return savedClases ? JSON.parse(savedClases) : [
      { id: 1, nombre: 'Álgebra Lineal', profesorId: 'prof-1', profesor: 'Ing. Milton', ubicacion: 'Laboratorio de Sistemas 2', horario: 'Lunes 14:00 a 18:00', alumnosCount: 24, clave: 'ALG2026' },
      { id: 2, nombre: 'Sistemas Embebidos', profesorId: 'prof-1', profesor: 'Ing. Milton', ubicacion: 'Aula 3', horario: 'Miércoles 09:00 a 13:00', alumnosCount: 18, clave: 'EMB32' }
    ];
  });

  const [suscripciones, setSuscripciones] = useState(() => {
    const savedSusc = localStorage.getItem('universidad_suscripciones');
    return savedSusc ? JSON.parse(savedSusc) : [{ id: 1, alumnoId: '12345', claseId: 2 }];
  });

  const [reservas, setReservas] = useState(() => {
    const savedReservas = localStorage.getItem('universidad_reservas');
    return savedReservas ? JSON.parse(savedReservas) : [
      { id: 1, aula: 'Laboratorio de Sistemas 1', solicitante: 'Facundo Boide', fecha: '12/06/2026 - de 14:00 a 16:00 hs', materiales: 'Proyector Epson', estado: 'Activa', userId: '12345', claseId: null },
      { id: 2, aula: 'Aula Magna', solicitante: 'Ing. Milton', fecha: '15/06/2026 - de 09:00 a 12:00 hs', materiales: 'Ninguno', estado: 'Activa', userId: 'prof-1', claseId: 1 }
    ];
  });

  const [notificaciones, setNotificaciones] = useState(() => {
    const savedNotifs = localStorage.getItem('universidad_notificaciones');
    return savedNotifs ? JSON.parse(savedNotifs) : [{ id: 1, text: "✨ Sistema: Bienvenido al gestor de reservas de aulas UNRaf." }];
  });

  useEffect(() => { setLoading(false); }, []);

  // Sincronizadores Reactivos
  useEffect(() => { localStorage.setItem('universidad_reservas', JSON.stringify(reservas)); }, [reservas]);
  useEffect(() => { localStorage.setItem('universidad_notificaciones', JSON.stringify(notificaciones)); }, [notificaciones]);
  useEffect(() => { localStorage.setItem('universidad_aulas', JSON.stringify(aulas)); }, [aulas]);
  useEffect(() => { localStorage.setItem('universidad_clases', JSON.stringify(clases)); }, [clases]);
  useEffect(() => { localStorage.setItem('universidad_suscripciones', JSON.stringify(suscripciones)); }, [suscripciones]);

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