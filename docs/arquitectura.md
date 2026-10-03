# Arquitectura del mercado de libros ULima

Esta base permite trabajar con datos locales en la primera entrega y sustituir lecturas por REST en la segunda. Solo el catálogo tiene un recorrido de lectura completo entre React y Express; las cinco historias aún requieren desarrollo.

## Capas y responsabilidades

| Capa | Responsabilidad | Archivos de referencia |
| --- | --- | --- |
| Rutas React | Navegación y protección visual de vistas | `frontend/src/routes/AppRoutes.jsx` |
| Páginas | Presentación y eventos de interfaz | `frontend/src/pages/` |
| Context y hooks | Sesión demo y carga de servicios | `frontend/src/context/`, `frontend/src/hooks/` |
| Servicios frontend | Interfaz común para mock y API | `frontend/src/services/` |
| Rutas Express | Endpoints y validación del contrato HTTP | `backend/src/routes/` |
| Controladores | Entrada y salida HTTP, sin acceso a datos | `backend/src/controllers/` |
| Servicios backend | Reglas de negocio y visibilidad | `backend/src/services/` |
| Repositorios | Acceso a semillas o consultas con Prisma | `backend/src/repositories/` |
| Modelos de dominio | Estados compartidos | `backend/src/models/` |
| Prisma | Tablas, relaciones y generación del cliente | `backend/prisma/` |

Secuencia: página → servicio mock/API → ruta → controlador → servicio → repositorio → Prisma → PostgreSQL. En modo seed, el repositorio usa el JSON compartido y no consulta una base.

Los controladores nunca importan Prisma. Los componentes no importan las semillas ni consultan PostgreSQL. Los adaptadores del frontend exponen los mismos métodos; las operaciones REST aún inexistentes responden con un error explícito en lugar de fingir persistencia.

## Autenticación

Supabase Auth no está adoptado. El docente debe confirmar si su uso reemplazaría la construcción de HU-1. Hasta esa respuesta, la implementación prevista es propia en Express: hash de contraseñas con sal y parámetros adecuados, validación del correo institucional, sesión revocable, comprobación de rol y estado de cuenta, y permisos por propietario o participante. Elegir y documentar cookies HttpOnly con protección CSRF o una estrategia equivalente antes de implementar.

`auth.service.js` delimita el punto de integración, pero todavía no autentica. El selector demo guarda una identidad ficticia en sessionStorage. Esta identidad solo controla la navegación local y nunca debe convertirse en prueba de autorización para Express. Actualmente no existen endpoints de escritura o privados. En modo API no se habilita la sesión demo.

El enunciado excluye envío real de correos. Recuperación de contraseña se construirá como flujo simulado, con tokens temporales de un solo uso y respuesta genérica; no usar un código fijo ni revelar si una cuenta existe.

## Ajustes al árbol solicitado

Se añadió un `package.json` raíz con npm workspaces y un único `package-lock.json`, que fija todas las dependencias. Instalar desde la raíz. Se añadió `backend/prisma.config.js` para Prisma 7 y `backend/tsconfig.prisma.json`: el generador actual produce TypeScript y este archivo lo compila a JavaScript. El código de la aplicación sigue en JS/JSX. Los directorios `.generated` y `generated` se regeneran en instalación/build y no se versionan.

`backend/server.js` exporta Express para Vercel y abre un puerto solo fuera de Vercel. No hace falta el antiguo wrapper `api/index.js` ni una reescritura catch-all del backend. El frontend sí tiene reescritura SPA para las rutas profundas.

## Componentes comunes

Encabezado, navegación, tarjeta de aviso, etiquetas, placeholder de fotografía, estados de carga/vacío y diálogo de confirmación están en `components/shared`. Quitar un favorito local usa este diálogo; las siguientes acciones destructivas lo reutilizarán. La galería real y los formularios de edición siguen pendientes.

## Entregas y colaboración

| Historia | Primera entrega | Segunda entrega |
| --- | --- | --- |
| HU-1 | Formularios, validación local, sesión simulada y perfil | Autenticación propia, sesiones y permisos |
| HU-2 | CRUD local, fotos locales, estados y duplicado | Propiedad en servidor, Prisma y Storage |
| HU-3 | Catálogo, filtros, detalle y favoritos locales | Consultas REST, favoritos privados y paginación |
| HU-4 | Negociaciones locales y su historial | Transacciones, unicidad activa y vencimiento |
| HU-5 | Coordinación y confirmaciones locales | Acuerdos transaccionales y trazabilidad |

Esta tabla es el trabajo previsto, no una lista de funcionalidades completadas. Una rama por integrante; cada cambio al contrato compartido necesita acuerdo del equipo. HU-6 y HU-7 son ampliaciones futuras y no tienen enlaces en la aplicación.

## Storage previsto

El archivo se guarda en un bucket privado; Fotografia conserva `bucket`, `ruta`, `orden` y `textoAlternativo`. No se guarda una URL firmada permanente. Después de autenticar al usuario y comprobar propiedad, Express podrá emitir una autorización de carga para una ruta única del aviso. React carga directamente a Storage con `uploadToSignedUrl`; Express recibe únicamente los metadatos, revalida existencia, tipo, tamaño y propiedad, y registra la referencia. Propuesta de límites: hasta 6 archivos JPEG/PNG/WebP de 5 MB por aviso, a validar durante HU-2.

La clave privada queda en el backend. No habilitar escritura pública ni asumir que el JWT propio de Express es un JWT de Supabase Auth. Las políticas y autorizaciones firmadas deben diseñarse para la autenticación finalmente elegida. La lectura pública del catálogo podrá usar URLs de descarga firmadas por el backend para las fotografías de avisos visibles. No pasar archivos de 5 MB por una Vercel Function.

## Fuentes técnicas revisadas

- [Prisma 7 y generación del cliente](https://www.prisma.io/docs/orm/prisma-schema/overview/generators)
- [Configuración de Prisma](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
- [Conexión Prisma con Supabase](https://supabase.com/docs/guides/database/prisma)
- [Carga firmada en Storage](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl)
- [Express en Vercel](https://vercel.com/docs/frameworks/backend/express)
- [Vite](https://vite.dev/guide/)

El changelog de Supabase se revisó el 3 de octubre de 2026; no se usan extensiones o funciones afectadas por los cambios identificados. Se fijó Prisma 7.10.0 estable, evitando el dist-tag latest que apuntaba a una versión candidata de Prisma 8.
