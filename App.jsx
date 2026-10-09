import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/HU1_CuentaAcceso/Landing.html" replace />} />
        <Route path="/HU1_CuentaAcceso/Landing.html" element={<Landing />} />
        <Route path="/HU1_CuentaAcceso/IniciarSesion.html" element={<IniciarSesion />} />
        <Route path="/HU1_CuentaAcceso/Registro.html" element={<Registro />} />
        <Route path="/HU1_CuentaAcceso/RecuperarContrasena.html" element={<RecuperarContrasena />} />
        <Route path="/HU1_CuentaAcceso/MiCuenta.html" element={<MiCuenta />} />
        <Route path="/HU1_CuentaAcceso/MensajesAcceso.html" element={<MensajesAcceso />} />
        <Route path="/HU1_CuentaAcceso/AccesoDenegado.html" element={<AccesoDenegado />} />
        <Route path="/HU1_CuentaAcceso/PaginaNoEncontrada.html" element={<PaginaNoEncontrada />} />
        <Route path="/HU2_Publicaciones/MisPublicaciones.html" element={<MisPublicaciones />} />
        <Route path="/HU2_Publicaciones/NuevoAviso.html" element={<NuevoAviso />} />
        <Route path="/HU2_Publicaciones/FotografiasAviso.html" element={<FotografiasAviso />} />
        <Route path="/HU3_Catalogo/Catalogo.html" element={<Catalogo />} />
        <Route path="/HU3_Catalogo/DetalleAviso.html" element={<DetalleAviso />} />
        <Route path="/HU3_Catalogo/Favoritos.html" element={<Favoritos />} />
        <Route path="/HU3_Catalogo/PerfilVendedor.html" element={<PerfilVendedor />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}
