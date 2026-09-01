import { AuthProvider } from './context/AuthContext';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Vistas Públicas
import Login from './views/Login';

// Vistas Generales / Privadas
import Clases from './views/Clases';
import Reservar from './views/Reservar';
import Reservas from './views/Reservas';
import Profile from './views/Profile';

// Vistas Exclusivas del Administrador
//import GestionAulas from './views/admin/GestionAulas'; 
//import StockMateriales from './views/admin/StockMateriales';
//import ControlUsuarios from './views/admin/ControlUsuarios';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />

          {/* Redirección por Defecto desde la Raíz */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas Autenticadas (Soporta nombres en inglés y español para el rol) */}
          <Route element={<ProtectedRoute roles={['student', 'teacher', 'admin', 'estudiante', 'profesor', 'docente']} />}>
            <Route element={<AppShell />}>
              
              {/* Vistas Generales */}
              <Route path="/clases" element={<Clases />} />
              <Route path="/reservar" element={<Reservar />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/perfil" element={<Profile />} />

              {/* Rutas Exclusivas para Administrador */}
              {/* <Route element={<ProtectedRoute roles={['admin', 'administrador']} />}>
                <Route path="/admin/aulas" element={<GestionAulas />} />
                <Route path="/admin/stock" element={<StockMateriales />} />
                <Route path="/admin/usuarios" element={<ControlUsuarios />} />
              </Route> */}

            </Route>
          </Route>

          {/* Captura de Rutas Desconocidas (404) -> Redirige a raíz para procesar auth */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;