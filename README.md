# Mercado de libros ULima

Base funcional para el proyecto de Programación Web 2026-2: un mercado de libros y materiales usados entre estudiantes de la Universidad de Lima. Equipo de cinco integrantes, HU-1 a HU-5 en orden. Primera entrega: React con datos locales. Segunda entrega: REST, PostgreSQL y despliegue, conservando la interfaz.

**Estado actual:** esqueleto funcional, no implementación completa de las historias. Catálogo con búsqueda, filtros, orden y paginación; detalle público, perfil público, favoritos locales, acceso demo y pantallas iniciales de publicaciones/ofertas/acuerdos. API de lectura con repositorio seed o Prisma. Registro real, CRUD de avisos, fotos, negociación y coordinación todavía no están implementados. No hay despliegue ni migración remota.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19.3, Vite 8.3, React Router 7.18, Context API, CSS propio, Axios |
| Backend | Node.js 24 LTS, Express 5.2, REST |
| Datos | PostgreSQL en Supabase, Prisma 7.10 estable, adaptador pg |
| Fotografías | Diseño para Supabase Storage; carga real pendiente |
| Autenticación | Implementación propia prevista; Supabase Auth pendiente de permiso docente |
| Despliegue | Dos proyectos Vercel desde el mismo repositorio; sin publicar todavía |

Las versiones exactas están fijadas en package.json y package-lock.json. TypeScript solo compila el cliente generado de Prisma; la aplicación usa JS/JSX. Nunito Sans se sirve localmente, sin depender de Google Fonts.

## Arranque local

Instalar Node.js 24. Ejecutar desde la raíz del proyecto en la terminal de VS Code:

```bash
npm ci
```

La instalación genera y compila Prisma automáticamente; no requiere una base real. En dos terminales separadas:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/health
- Catálogo REST: http://localhost:3001/api/avisos

Por defecto React usa datos locales y funciona sin API. Express usa las semillas locales y no conecta con PostgreSQL. No se necesita un `.env` para esta demostración.

Para probar navegación privada, abrir `/login` y elegir una cuenta demo. Diego permite revisar ofertas enviadas y favoritos, Rosa permite revisar publicaciones y ofertas recibidas, y la cuenta sin actividad muestra estados vacíos. Estas cuentas y sus datos son ficticios. Salir elimina la sesión demo; los favoritos permanecen por usuario en ese navegador.

## Cambiar de mock a API

Copiar `frontend/.env.example` a `frontend/.env` y ajustar:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_URL=http://localhost:3001/api
```

Reiniciar Vite. El inicio, catálogo, detalle y perfil usan Axios → Express → repositorio seed; esto demuestra el recorrido HTTP sin una base real. La API aún no permite login, favoritos ni escrituras. Para volver a las pantallas privadas de demostración, usar `VITE_DATA_SOURCE=mock`.

Los adaptadores en `services/mock` y `services/api` tienen la misma interfaz. Las páginas llaman a estos servicios y no conocen el origen de datos. No implementar un fallback silencioso de API a mock: un error de API debe ser visible.

## Variables y secretos

| Variable | Visibilidad | Uso |
| --- | --- | --- |
| VITE_DATA_SOURCE, VITE_API_URL | Pública | Selección de servicios y URL REST |
| VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY | Pública | Reservadas para Storage futuro |
| PORT, NODE_ENV, FRONTEND_ORIGIN, DATA_SOURCE | Configuración de servidor | Puerto, CORS y origen del repositorio |
| DATABASE_URL | Privada, solo backend | Conexión runtime de Prisma |
| DIRECT_URL | Privada, solo backend | Migraciones mediante conexión directa o pooler de sesión |
| SUPABASE_URL, SUPABASE_STORAGE_BUCKET | Configuración backend | Integración futura de fotos |
| SUPABASE_SECRET_KEY | Secreto, solo backend | Autorizaciones de Storage futuras |

No añadir credenciales a Git ni variables privadas con prefijo VITE_. `.env` y sus variantes están excluidos; `.env.example` solo contiene valores no secretos. Las variables vacías de Supabase son intencionales.

## Configurar Supabase cuando tengan el proyecto

1. Obtener un proyecto de desarrollo y copiar las cadenas de conexión desde **Connect**. DATABASE_URL será la conexión runtime; para Vercel normalmente usar el pooler transaccional. DIRECT_URL será la conexión directa o pooler de sesión para la CLI. No inventar host ni credenciales.
2. Copiar `backend/.env.example` a `backend/.env` y configurar ambas URLs, `FRONTEND_ORIGIN` y `DATA_SOURCE=prisma`.
3. Revisar permisos de la base. Prisma consulta desde Express; el navegador no accede a tablas. Desactivar Data API si no se usa, o proteger los esquemas expuestos con RLS y sin escritura pública.
4. En una base de desarrollo autorizada, generar la migración con `npm run prisma:migrate:dev -w backend -- --name inicial --create-only`. Revisar SQL y añadir las restricciones del contrato antes de aplicar. Todavía no existe una migración lista para producción.
5. Aplicar y verificar la migración en desarrollo. Cargar los mismos ejemplos con `npm run prisma:seed -w backend` solo si desean datos ficticios. El seed usa una transacción y no se ejecuta automáticamente; rechaza NODE_ENV=production.
6. Comprobar el catálogo real con `VITE_DATA_SOURCE=api`. No habilitar escrituras antes de terminar autenticación y permisos.

El esquema puede validarse y el cliente puede generarse sin DATABASE_URL/DIRECT_URL. Esa comprobación no acredita conexión a PostgreSQL, migraciones o consultas reales.

## Comprobaciones

```bash
npm run check
npm run build
npm run prisma:generate
```

`check` ejecuta ESLint, revisión de sintaxis, Prisma validate y pruebas Node de contratos/API. Las pruebas fuerzan DATA_SOURCE=seed y NODE_ENV=test; no consultan una base remota. `build` compila React y regenera el cliente Prisma. El informe de la preparación inicial está en [docs/verificacion.md](docs/verificacion.md).

## Despliegue previsto en Vercel

Crear dos proyectos vinculados al mismo repositorio privado, sin desplegar producción hasta completar configuración y alcance:

| Ajuste | Frontend | Backend |
| --- | --- | --- |
| Root Directory | frontend | backend |
| Framework | Vite | Express |
| Install Command | `cd .. && npm ci --include=dev` | `cd .. && npm ci --include=dev` |
| Build Command | `npm run build` | `npm run build` |
| Output | dist | Detección nativa Express |
| Node | 24.x | 24.x |

Activar **Include source files outside of the Root Directory** en ambos, porque importan `shared/` y usan el lockfile raíz. El backend exporta la app y Vercel detecta Express sin wrapper adicional. El frontend incluye reescritura a index.html para recargar `/catalogo/stewart` y otras rutas.

Frontend: VITE_API_URL debe apuntar a la URL HTTPS del backend terminada en `/api`, con VITE_DATA_SOURCE=api. Backend: NODE_ENV=production, DATA_SOURCE=prisma, DATABASE_URL real y FRONTEND_ORIGIN igual al dominio permitido del frontend. La app rechaza modo seed en producción. Prisma generate forma parte del build; las migraciones no se ejecutan durante ese build. Migrar por separado únicamente después de revisar y probar la migración. Las URLs de preview requieren configurar su origen CORS exacto; no abrir CORS a todos los dominios.

La configuración es preparatoria y no ha sido verificada en un despliegue remoto. Faltan credenciales, proyectos Vercel y la autenticación completa. Los límites y elegibilidad del plan gratuito deberán revisarse al desplegar.

## Trabajo del equipo

Mantener `main` como rama de integración. Cada integrante desarrolla una historia completa en su rama, por ejemplo `integrante-1/hu-1`; el grupo define la asignación real. Abrir pull requests y pedir revisión a otro integrante antes de integrar. No inventar contribuciones de otras personas ni escribir en la entidad de otro responsable sin coordinar.

Los cambios al contrato se acuerdan en grupo. La navegación y los componentes comunes se integran entre todos. HU-6 y HU-7 no sustituyen ninguna historia obligatoria y solo se documentan como ampliación futura.

## Documentación

- [Arquitectura y decisiones](docs/arquitectura.md)
- [Contrato de datos y restricciones](docs/contrato-de-datos.md)
- [Árbol real de archivos versionables](docs/arbol-de-archivos.txt)
- [Verificación y pendientes](docs/verificacion.md)

Las instrucciones del enunciado DOCX prevalecen sobre el prompt. Se tomó del PDF la paleta terracota, Nunito Sans, superficies claras, bordes y organización general. Las cifras de ejemplo de los mockups no se presentan como métricas reales ni se implementan historias fuera del alcance.
