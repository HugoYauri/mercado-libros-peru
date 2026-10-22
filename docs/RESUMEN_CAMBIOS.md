# Cambios y verificaciones — Entrega1_v1.2

Referencia: `Entrega1_v1`. Las pantallas de esa rama utilizan HTML directo y
scripts sencillos; esta entrega conserva ese enfoque con componentes React,
estados locales, formularios HTML y arreglos pequeños dentro del JSX.

## Resultado por HU

| HU  | Cambios                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HU1 | Formularios de acceso, registro y recuperación ilustrativos; ficha editable local; sin autenticación, registro de cuentas ni bloqueo de intentos.                  |
| HU2 | Mis publicaciones con seis ejemplos locales, búsqueda, filtros, modales y cambios de estado. Formulario y galería independientes, fotos en memoria y vista previa. |
| HU3 | Catálogo, detalle, favoritos y perfil con ejemplos propios. Filtros, orden, miniaturas, oferta y reporte local.                                                    |
| HU4 | Listado e hilo ilustrativo sin integración con acuerdos. Respuestas y contraofertas locales mediante formularios básicos.                                          |
| HU5 | Acuerdos, detalle, coordinación y confirmaciones independientes. Calificación ilustrativa propia, sin importar HU6.                                                |
| HU6 | Pendientes, recibidas y enviadas locales; modal sencillo de calificación.                                                                                          |
| HU7 | Administración separada en métricas, reportes, detalle y fichas ilustrativas. Filtros y moderación local, sin cuentas con credenciales.                            |

Cabecera y pie se comparten mediante `Cabecera`, `Pie` y `Marco`. Las siete HU
se abren directamente por `/hu1` a `/hu7`. Las referencias visuales a otras HU
se conservan en la navegación, sin transferir datos ni ejecutar sus recorridos.

`MisPublicaciones.jsx` pasa de 419 a 240 líneas y de ocho a cuatro estados. Se
eliminaron las consultas de propietarios, ofertas e historiales, los efectos de
sincronización y la carga compartida de fotografías. Los ejemplos permanecen en
el propio componente. Los estados locales del conjunto de componentes pasan de
95 a 57; el único efecto restante abre y cierra el diálogo HTML compartido.

## Verificaciones realizadas

| Comprobación                                | Resultado                                                                                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instalación con `npm ci`                    | Correcta, usando el archivo de dependencias existente                                                                                                                               |
| `npm test`                                  | 31 pruebas aprobadas; 27 rutas, estados vacíos, independencia de HU y restricciones de dependencias                                                                                 |
| `npm run build`                             | Correcto con Vite 8.3.4, 76 módulos transformados                                                                                                                                   |
| Formato de JSX y prueba de espacios con Git | Sin errores                                                                                                                                                                         |
| Navegador Chromium                          | Acceso ilustrativo, registro, recuperación, edición de ficha, publicaciones, galería, catálogo, favoritos, reportes, ofertas, acuerdos, calificaciones y administración comprobados |
| Entradas `/hu1`–`/hu7`                      | Abren la HU correspondiente sin iniciar sesión                                                                                                                                      |
| Navegador a 390 px                          | Sin desbordamiento horizontal de página en las once vistas principales revisadas; las tablas conservan su desplazamiento interno                                                    |
| Consola del navegador                       | Sin errores de JavaScript en los recorridos comprobados                                                                                                                             |
| Fotografías                                 | Selección, portada, eliminación, rechazo de formato y actualización de la vista previa comprobados                                                                                  |
| Persistencia e integración                  | Sin almacenamiento del navegador, cuentas precargadas ni módulos de negocio compartidos                                                                                             |
| Mockups                                     | Las 32 imágenes de referencia tienen los mismos hashes SHA-256 que antes de los cambios                                                                                             |
| Estilos originales                          | Ninguna hoja de estilo existente fue modificada. `modales.css` reutiliza las reglas del modal original                                                                              |

Las imágenes disponibles cubren H1–H5. HU6 y HU7 mantienen las clases y la
presentación que ya tenía el proyecto. La conservación de imágenes y CSS se
verificó por archivo; la revisión visual no constituye una medición de igualdad
píxel por píxel.

`main` permanece en `f3c1e344c99e6b9c7bd304fd0f7fbc708a8e6758` y
`Entrega1_v1` en `74b854a0599301948fad19653833e6a9f28d1eb5`.

## Archivos modificados

### Modificados

- `.prettierrc.json`
- `App.jsx`
- `README.md`
- `assets/js/compartido/rutas.js`
- `docs/HISTORIAS_FUNCIONALES.md`
- `docs/flujo-datos-hu2.html`
- `main.jsx`
- `pages/acuerdos/AcuerdoGenerado.jsx`
- `pages/acuerdos/ComponentesAcuerdo.jsx`
- `pages/acuerdos/CoordinarEntrega.jsx`
- `pages/acuerdos/DetalleAcuerdo.jsx`
- `pages/acuerdos/MisAcuerdos.jsx`
- `pages/acuerdos/ModalCancelarAcuerdo.jsx`
- `pages/administracion/Administracion.jsx`
- `pages/catalogo/Catalogo.jsx`
- `pages/catalogo/DetalleAviso.jsx`
- `pages/catalogo/Favoritos.jsx`
- `pages/catalogo/PerfilVendedor.jsx`
- `pages/compartido/BotonReporte.jsx`
- `pages/compartido/Marco.jsx`
- `pages/compartido/TarjetaAviso.jsx`
- `pages/cuenta/AccesoDenegado.jsx`
- `pages/cuenta/ComponentesCuenta.jsx`
- `pages/cuenta/IniciarSesion.jsx`
- `pages/cuenta/Landing.jsx`
- `pages/cuenta/MarcoCuenta.jsx`
- `pages/cuenta/MensajesAcceso.jsx`
- `pages/cuenta/MiCuenta.jsx`
- `pages/cuenta/PaginaNoEncontrada.jsx`
- `pages/cuenta/RecuperarContrasena.jsx`
- `pages/cuenta/Registro.jsx`
- `pages/ofertas/DetalleOferta.jsx`
- `pages/ofertas/ModalOferta.jsx`
- `pages/ofertas/Ofertas.jsx`
- `pages/publicaciones/FotografiasAviso.jsx`
- `pages/publicaciones/GaleriaFotografias.jsx`
- `pages/publicaciones/MisPublicaciones.jsx`
- `pages/publicaciones/ModalesPublicacion.jsx`
- `pages/publicaciones/NuevoAviso.jsx`
- `pages/publicaciones/VistaPreviaAviso.jsx`
- `pages/reputacion/Calificaciones.jsx`

### Añadidos

- `assets/css/modales.css`
- `docs/EJEMPLOS_HU.md`
- `docs/RESUMEN_CAMBIOS.md`
- `pages/administracion/DetalleReporte.jsx`
- `pages/administracion/Metricas.jsx`
- `pages/administracion/ModalModeracion.jsx`
- `pages/administracion/Reportes.jsx`
- `pages/administracion/Usuarios.jsx`
- `pages/catalogo/OfertaEjemplo.jsx`
- `pages/compartido/Cabecera.jsx`
- `pages/compartido/Enlace.jsx`
- `pages/compartido/Pie.jsx`
- `pages/reputacion/ModalCalificacion.jsx`
- `tests/interfaces.test.js`

### Eliminados

- `assets/js/compartido/sesion.js`
- `assets/js/compartido/storage.js`
- `assets/js/hu2/publicaciones.js`
- `assets/js/hu4/ofertas.js`
- `assets/js/hu5/acuerdos.js`
- `assets/js/hu6/reputacion.js`
- `assets/js/hu7/moderacion.js`
- `datos/demostracion.js`
- `datos/iniciales.js`
- `datos/usuarios.js`
- `tests/cuenta-reputacion-moderacion.test.js`
- `tests/negociacion.test.js`

Los módulos y pruebas de integración eliminados correspondían a la persistencia y a los recorridos compartidos que ya no forman parte de este prototipo. Se sustituyeron por `tests/interfaces.test.js` y la guía manual `docs/EJEMPLOS_HU.md`.
