import { Outlet } from 'react-router-dom';
import Marco from '../compartido/Marco.jsx';
import Enlace from '../compartido/Enlace.jsx';

export default function Administracion() {
  const secciones = [
    ['metricas', 'Métricas'],
    ['reportes', 'Reportes'],
    ['usuarios', 'Usuarios'],
  ];
  return (
    <Marco
      historia="hu7"
      titulo="Administración"
      descripcion="Métricas y moderación de la comunidad."
    >
      <nav className="neg-acciones" aria-label="Administración">
        {secciones.map(([ruta, nombre]) => (
          <Enlace className="neg-secundario" key={ruta} href={'/administracion/' + ruta}>
            {nombre}
          </Enlace>
        ))}
      </nav>
      <Outlet />
    </Marco>
  );
}
