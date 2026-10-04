# ROADMAP DEL SISTEMA

Mercado de libros y materiales usados · Universidad de Lima

Revisión local del repositorio · 3 de octubre de 2026

## 1. Estado actual

El repositorio contiene una base funcional en etapa de esqueleto. La interfaz permite recorrer el catálogo, aplicar filtros y ver detalles; también presenta acceso demo y pantallas iniciales para publicaciones, ofertas y acuerdos. La API ofrece lecturas públicas sobre datos semilla o Prisma. Las operaciones privadas y escrituras de las historias obligatorias todavía no están implementadas. La documentación del propio repositorio indica que el equipo desarrolla HU-1 a HU-5; HU-6 y HU-7 quedan como ampliaciones futuras.

La sesión demo solo controla navegación local. No autentica ni autoriza solicitudes en Express. El modo API ofrece un recorrido HTTP de lectura, pero no implica una conexión validada a PostgreSQL: el endpoint de salud informa databaseVerified=false. Supabase, Storage, migraciones aplicadas y despliegue Vercel siguen pendientes.

## 2. Arquitectura y stack

| Capa | Tecnologías y estado |
| --- | --- |
| Frontend | React 19.3, Vite 8.3, React Router 7.18, Context API, Axios y CSS propio. Servicios intercambiables mock/API. |
| Backend | Node.js 24, Express 5.2 y API REST; controladores, servicios y repositorio de catálogo. |
| Datos | PostgreSQL previsto en Supabase; Prisma 7.10 y adaptador pg. Esquema y seed existen; conexión/migración real pendiente. |
| Fotografías | Supabase Storage previsto; carga y permisos reales pendientes. |
| Autenticación | Login demo en mock. Autenticación propia en Express prevista; decisión sobre Supabase Auth requiere confirmación docente. |
| Despliegue | Dos proyectos Vercel previstos; aún no desplegados. |

Recorrido implementado para lecturas: página React → adaptador de servicio → Axios (en modo API) → ruta Express → controlador → servicio → repositorio → seed o Prisma. En modo mock, la interfaz consume servicios locales. No existen endpoints de escritura.

Estructura principal observada:

`frontend/src/{components,context,hooks,pages,routes,services,styles}`

`backend/src/{config,controllers,middleware,models,repositories,routes,services}`

`backend/prisma/{schema.prisma,seed.js,migrations}`

`shared/{contracts,seeds}`

`docs/{arquitectura.md,contrato-de-datos.md,verificacion.md}`

## 3. Roadmap por historia de usuario

### HU-1 — Cuenta y acceso

Estado: 🟡 Parcial: demostración local; autenticación real pendiente.

Existe login de selección de cuenta ficticia, persistencia de sesión mock, cierre y protección de vistas privadas por rol/estado en el frontend. Registro y recuperación son pantallas pendientes; el servicio backend auth es solo punto de integración.

Archivos relevantes:

`frontend/src/context/SessionContext.jsx (19 líneas)`

`frontend/src/pages/auth/LoginPage.jsx (95 líneas)`

`frontend/src/pages/auth/CuentaPage.jsx (29 líneas)`

`backend/src/services/auth.service.js (8 líneas)`

LOC directamente atribuibles: 151 líneas físicas / 151 no vacías (4 archivos).. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Selector demo, Context API, cierre de sesión, protección visual y páginas de acceso/cuenta.

Pendiente:

Registro real, hash y validaciones, login REST, sesiones revocables, autorización backend, edición de perfil, cambio y recuperación simulada segura de contraseña.

Flujo previsto: Registro → validación institucional → hash → login → sesión revocable → autorización por rol/estado → cuenta; recuperación mediante token temporal simulado.

### HU-2 — Publicaciones

Estado: 🟡 Inicial: listado demo; CRUD no implementado.

La vista muestra los avisos del usuario desde los datos demo. Las rutas nueva y editar presentan contenido de preparación y no permiten guardar cambios.

Archivos relevantes:

`frontend/src/pages/publicaciones/PublicacionesPage.jsx (50 líneas)`

LOC directamente atribuibles: 50 líneas físicas / 50 no vacías (1 archivo).. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Listado, estado y precio de avisos ficticios; enlaces a rutas nuevas/de edición.

Pendiente:

Crear, editar, eliminar y duplicar; borradores y estados; validaciones; fotos y orden; persistencia con comprobación de propiedad en servidor.

Flujo previsto: Formulario → validación → borrador → fotos → publicar/pausar/reactivar/vender → API → repositorio → Prisma/Storage.

### HU-3 — Catálogo y búsqueda

Estado: 🟢 Avanzada dentro del alcance de lectura.

Es el módulo más desarrollado: catálogo con búsqueda/filtros/orden/paginación, detalle, perfil público y favoritos locales; existen endpoints REST de lectura y pruebas para el catálogo.

Archivos relevantes:

`frontend/src/pages/catalogo/CatalogoPage.jsx (211 líneas)`

`frontend/src/pages/catalogo/DetallePage.jsx (137)`

`frontend/src/pages/catalogo/FavoritosPage.jsx (33)`

`frontend/src/pages/catalogo/PerfilPage.jsx (33)`

`frontend/src/components/shared/AvisoCard.jsx (18)`

`backend/src/controllers/catalogo.controller.js (15)`

`backend/src/routes/catalogo.routes.js (33)`

`backend/src/services/catalogo.service.js (18)`

`backend/src/repositories/catalogo.repository.js (108)`

LOC directamente atribuibles: 606 líneas físicas / 605 no vacías (9 archivos).. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Búsqueda, filtros, orden, paginación, detalle, perfil, favoritos locales y endpoints GET para avisos, usuarios y metadata. Lectura por seed y soporte de repositorio Prisma.

Pendiente:

Persistencia segura de favoritos y conexión PostgreSQL probada; autenticación para vistas privadas, galería real y validación exhaustiva de casos límite.

Flujo previsto: Catálogo → servicio mock/API → GET Express → controlador → servicio → repositorio → seed/Prisma. Favoritos todavía se guardan localmente.

### HU-4 — Ofertas

Estado: 🟡 Solo lectura/demo.

La interfaz muestra ofertas enviadas/recibidas y movimientos semilla. La documentación de arquitectura y el contrato confirman que ninguna escritura de negociación existe.

Archivos relevantes:

`frontend/src/pages/ofertas/OfertasPage.jsx (63 líneas)`

LOC directamente atribuibles: 63 líneas físicas / 63 no vacías (1 archivo).. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Listado, estados, montos e historial de movimientos ficticios.

Pendiente:

Enviar, aceptar, rechazar, contraofertar, retirar y vencer; unicidad, turnos, controles de concurrencia e historial persistente en transacciones.

Flujo previsto: Aviso → enviar oferta → respuesta/contraoferta → aceptación → fijar monto → crear acuerdo y cerrar otras ofertas en transacción.

### HU-5 — Acuerdos de entrega

Estado: 🟡 Solo lectura/demo.

La interfaz muestra acuerdos semilla, estado de confirmación de cada participante y trazabilidad. No permite proponer, aceptar, cancelar ni confirmar entregas.

Archivos relevantes:

`frontend/src/pages/acuerdos/AcuerdosPage.jsx (72 líneas)`

LOC directamente atribuibles: 72 líneas físicas / 72 no vacías (1 archivo).. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Visualización de punto, monto, estado, confirmaciones e historial ficticio.

Pendiente:

Creación tras aceptar oferta, propuestas de punto/horario, cambios, código de entrega seguro, confirmación mutua, cancelación y cierre transaccional del aviso como vendido.

Flujo previsto: Oferta aceptada → acuerdo → propuesta y aceptación → código → ambas confirmaciones → entregado y aviso vendido; cancelación conserva historial.

### HU-6 — Reputación

Estado: 🔴 No implementada; futura.

No hay páginas, endpoints ni modelos de calificación específicos. El contrato menciona HU-6 como fuera del alcance del equipo de cinco integrantes.

Archivos relevantes:

`Sin archivos de implementación HU-6 identificados.`

LOC directamente atribuibles: 0 líneas específicas actuales.. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Nada implementado; no se cuenta el campo de perfil genérico como reputación.

Pendiente:

Calificar mutuamente acuerdos entregados, comentario, unicidad por participante/acuerdo, promedio público y distintivo de confianza, según alcance futuro acordado.

Flujo previsto: Acuerdo ENTREGADO → habilitar evaluación → guardar → recalcular promedio → mostrar en perfil.

### HU-7 — Moderación y métricas

Estado: 🔴 No implementada; futura.

No hay páginas administrativas, endpoints ni modelos de reporte/bitácora específicos. La documentación del contrato excluye esta ampliación del alcance actual.

Archivos relevantes:

`Sin archivos de implementación HU-7 identificados.`

LOC directamente atribuibles: 0 líneas específicas actuales.. Estimación de líneas físicas de los archivos funcionales listados; excluye rutas, servicios mock compartidos, contratos, modelos y estilos globales salvo que se indique.

Ya existe:

Nada implementado específicamente para moderación o métricas.

Pendiente:

Reportes, revisión administrativa, retiro de avisos, bloqueo de cuentas, bitácora y tablero con métricas definidas y datos reales.

Flujo previsto: Usuario reporta → administrador revisa → acción documentada; en paralelo, datos del sistema → métricas verificables.

## 4. Resumen de avance y LOC

| HU | Módulo | LOC directas aproximadas | Estado |
| --- | --- | --- | --- |
| HU-1 | Cuenta y acceso | 151 (4 archivos) | Parcial/demo |
| HU-2 | Publicaciones | 50 (1 archivo) | Inicial/listado |
| HU-3 | Catálogo y búsqueda | 606 (9 archivos) | Avanzada en lectura |
| HU-4 | Ofertas | 63 (1 archivo) | Solo demo/lectura |
| HU-5 | Acuerdos | 72 (1 archivo) | Solo demo/lectura |
| HU-6 | Reputación | 0 | No implementada/futura |
| HU-7 | Moderación y métricas | 0 | No implementada/futura |

Las cifras cuentan líneas físicas de los archivos funcionales listados en esta revisión local; los archivos no contienen líneas vacías en la mayoría de los casos. Son aproximaciones de atribución, no medida de avance ni tamaño total de la historia. Se excluyen archivos compartidos como AppRoutes.jsx, servicios mock/API, contratos, esquema Prisma, semillas, CSS y componentes globales, por lo que las cifras no se deben sumar como tamaño completo del producto. Los modelos Oferta y Acuerdo en Prisma y los datos seed describen estructura/ejemplos, pero no demuestran flujos de escritura implementados.

## 5. Pendientes generales

Completar primero HU-1 a HU-5 conforme a la asignación del equipo y al enunciado; las vistas existentes son una base, no funcionalidades terminadas.

Confirmar con el docente el proveedor de autenticación y completar sesiones y permisos en backend.

Configurar PostgreSQL/Supabase en un entorno autorizado; preparar y revisar migración SQL, restricciones e índices, y probar consultas reales.

Implementar operaciones de escritura con validación, ownership, transacciones e historial.

Integrar Storage privado para fotografías con carga autorizada, validación de metadatos y límites acordados.

Configurar y verificar los dos proyectos de Vercel solo cuando existan credenciales y configuración aprobadas.

Mantener HU-6 y HU-7 como futuras, sin presentarlas como trabajo en curso o ya implementado.

## 6. Flujos del sistema

| Flujo | Estado actual |
| --- | --- |
| Lectura del catálogo | Implementado por mock o API GET; filtros, paginación y perfiles/detalle públicos. |
| Acceso | Sesión demo solo en navegador; no autoriza al backend. Registro/login real pendientes. |
| Publicación | Listado demo. Creación, edición, fotos y cambios de estado pendientes. |
| Negociación | Lectura de ofertas semilla; toda acción de oferta pendiente. |
| Entrega | Lectura de acuerdos semilla; propuestas y confirmaciones pendientes. |
| Reputación y moderación | HU-6 y HU-7 sin implementación; ampliaciones futuras. |

## 7. Resumen general

La base ya permite demostrar el catálogo y su recorrido de lectura React–Express, además de navegar por pantallas demo para varias historias. La brecha principal está en la autenticación y las escrituras privadas con persistencia real. HU-3 es el módulo funcionalmente más avanzado; HU-1, HU-2, HU-4 y HU-5 permanecen parciales o preparatorios. HU-6 y HU-7 son futuras y tienen cero líneas de implementación específicas en el repositorio revisado. Este documento describe la copia local observada el 3 de octubre de 2026.
