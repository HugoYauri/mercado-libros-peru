# Verificación de la base inicial

Revisión realizada el 3 de octubre de 2026 sobre Node.js 24.19.0. Se leyeron el prompt adjunto, el enunciado DOCX y las vistas del PDF antes de construir la base.

| Comprobación | Resultado |
| --- | --- |
| Instalación reproducible con npm ci | Correcta desde package-lock.json |
| Generación y compilación de cliente Prisma 7.10 | Correcta, sin conexión remota |
| Prisma validate | Esquema válido |
| ESLint frontend | Sin errores ni advertencias |
| Sintaxis de backend | Correcta |
| Pruebas automatizadas Node | 9 aprobadas, 0 fallos |
| Build React/Vite | Correcto |
| Build backend | Cliente Prisma generado y compilado |
| Arranque de Express | Correcto; GET /api/health devuelve 200 |
| Arranque de Vite | Correcto en interfaz local 127.0.0.1 |
| Navegación en navegador | Inicio, catálogo, detalle, sesión demo, vistas privadas, 404 y acceso denegado |
| Búsqueda y filtros | Resultados coherentes y estado sin coincidencias |
| Sesión demo y cierre | Redirige al login y recupera ruta de destino; salir elimina sesión |
| Favoritos locales | Guardado/quita, confirmación de retiro y mensajes de resultado |
| Cuenta sin actividad | Estado vacío de acuerdos visible |
| Responsive | Verificado a 390 px de ancho; documento sin desbordamiento horizontal |
| Recorrido HTTP | React → Axios → Express → servicio → repositorio seed comprobado |
| Recarga de ruta profunda | Detalle vuelve a cargar correctamente en desarrollo |
| Errores de navegador | Sin errores de JavaScript, consola ni overlay de Vite |

La verificación visual se hizo con Playwright y Chrome Headless Shell 154. Se inspeccionaron las capturas de inicio, catálogo y móvil. El daemon de agent-browser no pudo iniciarse por las restricciones de sockets del entorno, por lo que se usó Playwright para completar las comprobaciones. No se atribuyen a una base real los resultados del repositorio seed.

## Qué prueban los tests Node

Health; filtros, orden y paginación; validación de rangos/precios/página; visibilidad de borradores y pausados; detalle de vendido; proyección de perfil sin datos privados; ausencia de escrituras; unicidad de ofertas activas en semillas; aceptación con acuerdo y vendido solo al confirmar ambos; escenarios vacíos y favorito vendido. Los tests fuerzan modo seed y no acceden a proyectos remotos.

Las invariantes de negociación se comprobaron sobre las semillas. Esto no demuestra una implementación transaccional de HU-4/HU-5, que aún no existe.

## Pendientes reales

- Crear el repositorio privado y transferir el primer commit: la conexión reconoce HugoYauri, pero el plugin disponible no expone creación de repositorios.
- Confirmar con el docente si se permite Supabase Auth. Mientras tanto se mantiene la decisión de autenticación propia prevista.
- Completar las cinco historias, empezando por HU-1. La sesión demo no sustituye autenticación del servidor.
- Configurar un proyecto Supabase, DATABASE_URL, DIRECT_URL y permisos. No se probaron conexión real, consultas Prisma, migraciones ni seed contra PostgreSQL.
- Generar, revisar y probar la migración inicial con restricciones parciales y protección del esquema.
- Integrar Storage y verificar permisos, límites y referencias de fotografías.
- Configurar los dos proyectos Vercel, variables, CORS y pruebas de rutas profundas en el alojamiento. No se desplegó producción.

## Prueba manual reproducible

Con ambos servidores locales arrancados: visitar `/`; filtrar `/catalogo` por libros; buscar un texto inexistente; abrir `/publicaciones` sin sesión; elegir Rosa en login; revisar ofertas recibidas y `/acuerdos/acuerdo-1`; salir; elegir la cuenta sin actividad; comprobar acuerdos vacíos; elegir Diego y probar guardar/quitar favorito; abrir una ruta inexistente. Repetir catálogo y detalle con VITE_DATA_SOURCE=api para comprobar Axios y Express. Revisar también el catálogo en una ventana móvil.
