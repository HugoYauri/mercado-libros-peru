import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession.js";
import { Layout } from "../components/shared/Layout.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { CatalogoPage } from "../pages/catalogo/CatalogoPage.jsx";
import { DetallePage } from "../pages/catalogo/DetallePage.jsx";
import { PerfilPage } from "../pages/catalogo/PerfilPage.jsx";
import { FavoritosPage } from "../pages/catalogo/FavoritosPage.jsx";
import { LoginPage } from "../pages/auth/LoginPage.jsx";
import { CuentaPage } from "../pages/auth/CuentaPage.jsx";
import { PublicacionesPage } from "../pages/publicaciones/PublicacionesPage.jsx";
import { OfertasPage } from "../pages/ofertas/OfertasPage.jsx";
import { AcuerdosPage } from "../pages/acuerdos/AcuerdosPage.jsx";
import { PendingPage } from "../pages/PendingPage.jsx";
import { StatusPage } from "../pages/StatusPage.jsx";
function RequireSession() {
  const { user } = useSession();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.rol !== "USUARIO" || user.estado !== "ACTIVO")
    return <Navigate to="/acceso-denegado" replace />;
  return <Outlet />;
}
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="registro"
          element={
            <PendingPage
              title="Crear cuenta"
              text="Registro con correo institucional, validación junto al campo y almacenamiento de contraseña con hash en el servidor."
              fields={[
                "Nombres y apellidos",
                "Correo @aloe.ulima.edu.pe",
                "Contraseña y confirmación",
                "Carrera y ciclo",
              ]}
            />
          }
        />
        <Route
          path="recuperar-contrasena"
          element={
            <PendingPage
              title="Recuperar contraseña"
              text="HU-1 implementará un flujo simulado de recuperación con token temporal y respuesta genérica. El enunciado excluye el envío real de correos."
            />
          }
        />
        <Route path="catalogo" element={<CatalogoPage />} />
        <Route path="catalogo/:avisoId" element={<DetallePage />} />
        <Route path="usuarios/:usuarioId" element={<PerfilPage />} />
        <Route path="acceso-denegado" element={<StatusPage denied />} />
        <Route element={<RequireSession />}>
          <Route path="mi-cuenta" element={<CuentaPage />} />
          <Route path="favoritos" element={<FavoritosPage />} />
          <Route path="publicaciones" element={<PublicacionesPage />} />
          <Route
            path="publicaciones/nueva"
            element={
              <PendingPage
                title="Nuevo aviso"
                text="HU-2 implementará el formulario, borradores y fotografías. La carga directa a Supabase Storage se integrará después de configurar permisos de servidor."
                fields={[
                  "Título y descripción",
                  "Categoría y curso",
                  "Estado del producto",
                  "Precio pedido y aceptación de ofertas",
                  "Fotografías y orden",
                ]}
              />
            }
          />
          <Route
            path="publicaciones/:avisoId/editar"
            element={
              <PendingPage
                title="Editar aviso"
                text="HU-2 validará que la sesión sea del propietario antes de leer o editar sus datos. La ruta inicial no permite modificar avisos."
              />
            }
          />
          <Route
            path="ofertas"
            element={<Navigate to="/ofertas/enviadas" replace />}
          />
          <Route
            path="ofertas/enviadas"
            element={<OfertasPage tipo="enviadas" />}
          />
          <Route
            path="ofertas/recibidas"
            element={<OfertasPage tipo="recibidas" />}
          />
          <Route path="ofertas/:ofertaId" element={<OfertasPage detail />} />
          <Route path="acuerdos" element={<AcuerdosPage />} />
          <Route path="acuerdos/:acuerdoId" element={<AcuerdosPage detail />} />
        </Route>
        <Route path="*" element={<StatusPage />} />
      </Route>
    </Routes>
  );
}
