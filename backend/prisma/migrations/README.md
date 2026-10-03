No hay migraciones ejecutadas ni generadas contra un proyecto remoto.

Con una base de desarrollo autorizada, generar la migración inicial con `npm run prisma:migrate:dev -w backend -- --name inicial --create-only`. Revisar el SQL y añadir los índices parciales y restricciones descritos en `docs/contrato-de-datos.md`, además de RLS o un esquema no expuesto a Data API. Luego aplicar sobre desarrollo, verificar las restricciones y conservar aquí la migración revisada. No usar `db push` como sustituto del historial.

La carpeta contiene documentación, no una migración lista para producción.
