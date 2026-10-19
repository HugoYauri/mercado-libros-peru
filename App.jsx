import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import { Privado } from './pages/compartido/Marco.jsx';
import Calificaciones from './pages/reputacion/Calificaciones.jsx';
import Administracion from './pages/administracion/Administracion.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />
        <Route
          path="/ingresar"
          element={<IniciarSesion />}
        />
        <Route
          path="/registro"
          element={<Registro />}
        />
        <Route
          path="/recuperar-contrasena"
          element={<RecuperarContrasena />}
        />
        <Route
          path="/mi-cuenta"
          element={
            <Privado>
              <MiCuenta />
            </Privado>
          }
        />
        <Route
          path="/mensajes-acceso"
          element={<MensajesAcceso />}
        />
        <Route
          path="/acceso-denegado"
          element={<AccesoDenegado />}
        />
        <Route
          path="/no-encontrado"
          element={<PaginaNoEncontrada />}
        />
        <Route
          path="/mis-publicaciones"
          element={
            <Privado>
              <MisPublicaciones />
            </Privado>
          }
        />
        <Route
          path="/nuevo-aviso"
          element={
            <Privado>
              <NuevoAviso />
            </Privado>
          }
        />
        <Route
          path="/fotografias-aviso"
          element={
            <Privado>
              <FotografiasAviso />
            </Privado>
          }
        />
        <Route
          path="/catalogo"
          element={<Catalogo />}
        />
        <Route
          path="/aviso"
          element={<DetalleAviso />}
        />
        <Route
          path="/favoritos"
          element={
            <Privado>
              <Favoritos />
            </Privado>
          }
        />
        <Route
          path="/vendedor"
          element={<PerfilVendedor />}
        />
        <Route
          path="*"
          element={<PaginaNoEncontrada />}
        />
        <Route
          path="/ofertas"
          element={
            <Privado>
              <Ofertas />
            </Privado>
          }
        />
        <Route
          path="/ofertas/:id"
          element={
            <Privado>
              <DetalleOferta />
            </Privado>
          }
        />
        <Route
          path="/acuerdos"
          element={
            <Privado>
              <MisAcuerdos />
            </Privado>
          }
        />
        <Route
          path="/acuerdos/:id"
          element={
            <Privado>
              <DetalleAcuerdo />
            </Privado>
          }
        />
        <Route
          path="/calificaciones"
          element={
            <Privado>
              <Calificaciones />
            </Privado>
          }
        />
        <Route
          path="/administracion/*"
          element={
            <Privado administrador>
              <Administracion />
            </Privado>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
