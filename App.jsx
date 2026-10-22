import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Landing from './pages/cuenta/Landing.jsx';
import IniciarSesion from './pages/cuenta/IniciarSesion.jsx';
import Registro from './pages/cuenta/Registro.jsx';
import RecuperarContrasena from './pages/cuenta/RecuperarContrasena.jsx';
import MiCuenta from './pages/cuenta/MiCuenta.jsx';
import MensajesAcceso from './pages/cuenta/MensajesAcceso.jsx';
import AccesoDenegado from './pages/cuenta/AccesoDenegado.jsx';
import PaginaNoEncontrada from './pages/cuenta/PaginaNoEncontrada.jsx';
import MisPublicaciones from './pages/publicaciones/MisPublicaciones.jsx';
import NuevoAviso from './pages/publicaciones/NuevoAviso.jsx';
import FotografiasAviso from './pages/publicaciones/FotografiasAviso.jsx';
import Catalogo from './pages/catalogo/Catalogo.jsx';
import DetalleAviso from './pages/catalogo/DetalleAviso.jsx';
import Favoritos from './pages/catalogo/Favoritos.jsx';
import PerfilVendedor from './pages/catalogo/PerfilVendedor.jsx';
import Ofertas from './pages/ofertas/Ofertas.jsx';
import DetalleOferta from './pages/ofertas/DetalleOferta.jsx';
import MisAcuerdos from './pages/acuerdos/MisAcuerdos.jsx';
import DetalleAcuerdo from './pages/acuerdos/DetalleAcuerdo.jsx';
import AcuerdoGenerado from './pages/acuerdos/AcuerdoGenerado.jsx';
import Calificaciones from './pages/reputacion/Calificaciones.jsx';
import Administracion from './pages/administracion/Administracion.jsx';
import Metricas from './pages/administracion/Metricas.jsx';
import Reportes from './pages/administracion/Reportes.jsx';
import DetalleReporte from './pages/administracion/DetalleReporte.jsx';
import Usuarios from './pages/administracion/Usuarios.jsx';

export function Pantallas() {
  const { pathname, search } = useLocation();
  return (
    <Routes key={pathname + search}>
      <Route path="/" element={<Landing />} />
      <Route path="/ingresar" element={<IniciarSesion />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route path="/mi-cuenta" element={<MiCuenta />} />
      <Route path="/mensajes-acceso" element={<MensajesAcceso />} />
      <Route path="/acceso-denegado" element={<AccesoDenegado />} />
      <Route path="/no-encontrado" element={<PaginaNoEncontrada />} />
      <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
      <Route path="/nuevo-aviso" element={<NuevoAviso />} />
      <Route path="/fotografias-aviso" element={<FotografiasAviso />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/aviso" element={<DetalleAviso />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/vendedor" element={<PerfilVendedor />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/ofertas/:id" element={<DetalleOferta />} />
      <Route path="/acuerdos" element={<MisAcuerdos />} />
      <Route path="/acuerdos/:id" element={<DetalleAcuerdo />} />
      <Route path="/acuerdo-generado" element={<AcuerdoGenerado />} />
      <Route path="/calificaciones" element={<Calificaciones />} />
      <Route path="/administracion" element={<Administracion />}>
        <Route index element={<Navigate to="metricas" replace />} />
        <Route path="metricas" element={<Metricas />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="reportes/:id" element={<DetalleReporte />} />
        <Route path="usuarios" element={<Usuarios />} />
      </Route>
      <Route path="/hu1" element={<Navigate to="/" replace />} />
      <Route path="/hu2" element={<Navigate to="/mis-publicaciones" replace />} />
      <Route path="/hu3" element={<Navigate to="/catalogo" replace />} />
      <Route path="/hu4" element={<Navigate to="/ofertas" replace />} />
      <Route path="/hu5" element={<Navigate to="/acuerdos" replace />} />
      <Route path="/hu6" element={<Navigate to="/calificaciones" replace />} />
      <Route path="/hu7" element={<Navigate to="/administracion/metricas" replace />} />
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Pantallas />
    </BrowserRouter>
  );
}
