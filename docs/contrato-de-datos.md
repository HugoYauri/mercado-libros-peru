# Contrato de datos compartido

Este contrato v0.1 define la interfaz común de las cinco historias. El grupo debe acordar sus cambios antes de integrarlos. Los estados y etiquetas están en `shared/contracts/domain.js`; las semillas de ejemplo están en `shared/seeds/demo.json`.

## Convenciones

Identificadores opacos de tipo string. Fechas ISO 8601 con zona UTC; la interfaz debe presentar fechas y horarios de campus en America/Lima. Dinero en PEN como string decimal con dos posiciones, por ejemplo `"95.00"`, y Decimal(10,2) en PostgreSQL; no guardar dinero como flotante. `null` indica ausencia. El teléfono y los datos de acceso nunca forman parte del perfil público.

## Usuario

| Campo | Tipo | Regla |
| --- | --- | --- |
| id | string | Identificador |
| nombres, apellidos | string | Requeridos, sin solo espacios |
| correo | string | Institucional, normalizado y único |
| contrasenaHash | string privado | Solo backend y base; jamás JSON público |
| carrera | string | Requerido |
| ciclo | integer | Validar rango al implementar HU-1 |
| telefono, puntoPreferido | string/null | Perfil privado |
| rol | USUARIO / ADMINISTRADOR | Nunca elegible libremente en registro |
| estado | ACTIVO / BLOQUEADO | Bloqueado no puede iniciar sesión |
| creadoEn, actualizadoEn | datetime | Fechas del sistema |

Perfil público: únicamente id, nombres, apellidos, carrera, ciclo y creadoEn. En las semillas todos los perfiles son ficticios; el seed crea hashes aleatorios sin una contraseña conocida de acceso. No usar las cuentas demo como cuentas reales.

## Aviso

| Campo | Tipo | Regla |
| --- | --- | --- |
| id, vendedorId | string | Propietario validado en servidor |
| titulo | string | Hasta 80 caracteres, obligatorio |
| descripcion | string | Obligatoria |
| categoriaId | string | FK a Categoria |
| cursoId | string/null | FK a Curso |
| condicion | enum | COMO_NUEVO, MUY_BUEN_ESTADO, BUEN_ESTADO, CON_MARCAS |
| precioPedido | decimal string | Mayor que cero |
| aceptaOfertas | boolean | Permite negociar debajo del precio pedido |
| precioMinimo | decimal string/null | Si se usa, mayor que cero y no superior al pedido |
| estado | enum | BORRADOR, PUBLICADO, PAUSADO, VENDIDO |
| fotografias | Fotografia[] | Referencia de Storage y orden, no archivo binario |
| publicadoEn | datetime/null | Requerido cuando se publica |
| creadoEn, actualizadoEn | datetime | Fechas del sistema |

Transiciones previstas: BORRADOR → PUBLICADO; PUBLICADO ↔ PAUSADO; PUBLICADO → VENDIDO solo por cierre de HU-5. Duplicar genera un identificador nuevo en BORRADOR. Para eliminar con ofertas activas se necesita confirmación explícita y un criterio acordado para conservar la trazabilidad.

No se agrega RESERVADO como quinto estado. La reserva se deriva de un acuerdo no terminal del aviso. Mientras haya una reserva se impiden nuevas ofertas/aceptaciones sobre el mismo aviso, aunque todavía no esté vendido. Su indicador visual y tratamiento en el listado se completarán al integrar HU-4 y HU-5.

Categoria y Curso: id y nombre único. Fotografia: id, avisoId, bucket, ruta, orden entero y textoAlternativo; orden único por aviso. Favorito: clave compuesta usuarioId + avisoId y creadoEn. Un favorito vendido se conserva con aviso visual.

## Oferta e historial

| Campo | Tipo | Regla |
| --- | --- | --- |
| id, avisoId, compradorId | string | Comprador distinto del vendedor |
| montoActual | decimal string | Mayor que cero; validar mínimos y aceptación de ofertas |
| mensaje | string/null | Opcional, con longitud máxima a acordar |
| estado | enum | ENVIADA, CONTRAOFERTADA, ACEPTADA, RECHAZADA, RETIRADA, VENCIDA |
| turnoUsuarioId | string | Parte que debe responder |
| venceEn | datetime | Plazo acordado por el grupo/docente |
| creadoEn, actualizadoEn | datetime | Fechas del sistema |
| movimientos | MovimientoOferta[] | Secuencia inmutable y ordenada |

MovimientoOferta: id, ofertaId, actorId, accion, monto decimal/null, mensaje string/null, creadoEn. Acciones previstas: ENVIAR, CONTRAOFERTAR, ACEPTAR, RECHAZAR, RETIRAR, VENCER. `turnoUsuarioId` debe ser comprador o vendedor del aviso, validado en servicio.

Solo una oferta ENVIADA/CONTRAOFERTADA por comprador y aviso. Vencer una oferta debe actualizar su estado antes de decidir unicidad o una respuesta. La retirada solo se admite mientras no haya respuesta. Aceptar fija el monto pactado, crea exactamente un acuerdo y rechaza otras ofertas activas del aviso en una única transacción, con control de concurrencia. Ninguna de estas escrituras está implementada todavía.

## Acuerdo y trazabilidad

| Campo | Tipo | Regla |
| --- | --- | --- |
| id, ofertaId, avisoId | string | Una oferta aceptada origina un acuerdo |
| compradorId, vendedorId | string | Derivados de la oferta y el aviso |
| montoPactado | decimal string | Inmutable tras la aceptación |
| estado | enum | PENDIENTE, PROPUESTO, ACORDADO, ENTREGADO, CANCELADO |
| punto | string/null | Punto dentro del campus |
| horarioInicio, horarioFin | datetime/null | Fin posterior al inicio, propuesta vigente |
| versionPropuesta | integer | Incrementa al cambiar punto u horario |
| confirmadoComprador, confirmadoVendedor | boolean | Confirman la misma versión |
| entregaCompradorEn, entregaVendedorEn | datetime/null | Cada parte confirma su entrega |
| codigoEntregaHash | string privado/null | Generado al confirmar ambos el encuentro |
| motivoCancelacion | string/null | Obligatorio al cancelar |
| creadoEn, actualizadoEn | datetime | Fechas del sistema |
| cambios | CambioAcuerdo[] | Historial inmutable |

CambioAcuerdo: id, acuerdoId, actorId, accion, datos JSON y creadoEn. Registrar generación, propuestas, alternativas, confirmaciones, entregas y cancelación. Una nueva propuesta reinicia ambas confirmaciones y revoca el código anterior. Solo los participantes ven contacto y datos privados del acuerdo. El código de entrega requiere generación segura y verificación en servidor.

Cuando ambas partes confirman entrega, una transacción cierra el acuerdo como ENTREGADO y cambia el aviso a VENDIDO. Confirmar una sola parte no vende el aviso. Cancelar registra motivo, cierra como CANCELADO, invalida el código y devuelve el aviso a PUBLICADO; no borra el historial. Solo un acuerdo no terminal por aviso.

## Restricciones necesarias en la migración inicial

El esquema Prisma contiene claves, FKs e índices convencionales. Antes de implementar escrituras, añadir y probar las restricciones SQL de la migración; todavía no están aplicadas:

```sql
CREATE UNIQUE INDEX oferta_activa_por_comprador
ON "Oferta" ("avisoId", "compradorId")
WHERE "estado" IN ('ENVIADA', 'CONTRAOFERTADA');

CREATE UNIQUE INDEX acuerdo_activo_por_aviso
ON "Acuerdo" ("avisoId")
WHERE "estado" IN ('PENDIENTE', 'PROPUESTO', 'ACORDADO');

ALTER TABLE "Aviso" ADD CONSTRAINT precio_aviso_valido
CHECK ("precioPedido" > 0 AND ("precioMinimo" IS NULL
OR ("precioMinimo" > 0 AND "precioMinimo" <= "precioPedido")));
ALTER TABLE "Oferta" ADD CONSTRAINT monto_oferta_positivo CHECK ("montoActual" > 0);
ALTER TABLE "Acuerdo" ADD CONSTRAINT partes_distintas CHECK ("compradorId" <> "vendedorId");
ALTER TABLE "Acuerdo" ADD CONSTRAINT cancelacion_con_motivo
CHECK ("estado" <> 'CANCELADO' OR ("motivoCancelacion" IS NOT NULL
AND length(trim("motivoCancelacion")) > 0));
```

Completar también verificaciones para rango horario, orden de fotografías, límites de ciclo y coherencia de estados. Las invariantes que involucran varias tablas requieren servicios transaccionales y pruebas concurrentes. En tablas de `public`, activar RLS y no otorgar acceso de escritura directo al navegador; si todo acceso se hace con Prisma, desactivar Data API o usar un esquema no expuesto. La conexión de Express necesita un rol de base apropiado y autorización en los servicios.

## REST implementado

| Método y ruta | Respuesta | Acceso |
| --- | --- | --- |
| GET /api/health | status, service, dataSource, databaseVerified, scope | Público; liveness, no readiness de base |
| GET /api/metadata | categorias[], cursos[] | Público |
| GET /api/avisos | items[], total, page, limit, pages | Solo publicados |
| GET /api/avisos/:id | Aviso | Publicado o vendido; resto 404 |
| GET /api/usuarios/:id | Perfil público | Sin datos de contacto ni acceso |

Filtros: q, categoriaId, cursoId, condicion, min, max, orden, page y limit. Orden: recientes, precio-asc o precio-desc. Página empieza en 1, limit entre 1 y 24 (por defecto 6). Filtros inválidos: 400. Recurso inexistente/no visible: 404. Fallo interno: 500. Error JSON: `{ "error": { "code": "...", "message": "...", "details": {} } }` (details opcional).

## Casos semilla

Usuarios ficticios comprador, vendedor y cuenta sin actividad; avisos en los cuatro estados; favorito vendido; búsqueda sin resultados; oferta contraofertada, aceptada y vencida; acuerdo con solo una entrega confirmada y acuerdo cerrado por ambas partes. Las páginas de ofertas/acuerdos solo permiten leer esos ejemplos.

Calificacion (HU-6), Reporte y panel administrativo (HU-7) quedan fuera del alcance del equipo de cinco. Los plazos de ofertas, mínimos de reputación y edición de calificaciones no se deducen de cifras ficticias en los mockups.
