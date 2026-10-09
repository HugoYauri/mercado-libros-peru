# Tablón ULima · avance HU1–HU3

Sitio estático hecho con HTML, Tailwind CSS por CDN y JavaScript vanilla. No incluye servidor de aplicación ni API.

## Organización

- `HU1_CuentaAcceso/`: Landing, acceso, registro, recuperación, Mi cuenta y estados de error.
- `HU2_Publicaciones/`: listado, formulario y fotografías de avisos.
- `HU3_Catalogo/`: búsqueda, detalle, favoritos y perfil público.
- `assets/css/estilos.css`: fuente y estilos propios que complementan Tailwind.
- `assets/js/compartido/`: almacenamiento del navegador y acceso a fotos.
- `assets/js/hu2/` y `assets/js/hu3/`: comportamiento de cada historia.
- `datos/iniciales.js`: avisos de demostración que se cargan la primera vez.

## Abrir el proyecto

Abre la carpeta con un servidor estático local, por ejemplo la extensión Live Server de Visual Studio Code, y entra a `index.html`. Este servidor solo entrega los archivos HTML, CSS y JavaScript; no ejecuta lógica de aplicación. La carga de Tailwind y Nunito Sans necesita conexión a Internet.

## Persistencia de demostración

- Los avisos y favoritos se guardan en `localStorage`.
- Las fotos se guardan como archivos en IndexedDB.
- La sesión de demostración vive en `sessionStorage`.
- Los datos pertenecen al navegador y al origen local usados para la prueba.
- Las cuentas, recuperación de contraseña y permisos son demostrativos; no ingresar contraseñas reales.

La negociación de ofertas, acuerdos, calificaciones y administración queda fuera del avance HU1–HU3.
