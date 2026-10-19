# 3. HISTORIAS FUNCIONALES

MercadoLibros V2 — avance de frontend en React. Este documento describe lo
implementado y cómo comprobarlo. Los datos son locales de demostración, no
transacciones reales. Las imágenes son capturas de la implementación, utilizadas
como referencia visual de los mockups; no constituyen un archivo editable de Figma.

## 3.1. HU-1 — Cuenta y acceso

### 3.1.1. Objetivo de la HU-1

Permitir que un estudiante cree su cuenta, ingrese y gestione sus datos,
separando visitantes, estudiantes y administradores.

### 3.1.2. Landing pública

Ruta `/`. Presenta la propuesta del tablón, búsqueda, categorías, publicaciones
disponibles, pasos de uso y normas. El contador se obtiene de los avisos publicados.

### 3.1.3. Inicio de sesión

Ruta `/ingresar`. Comprueba correo y contraseña, permite mostrar la clave y
regresa a la ruta privada solicitada. El administrador ingresa a su panel.
Cuatro intentos incorrectos bloquean el acceso durante un minuto.

### 3.1.4. Registro de usuario

Ruta `/registro`. Solicita datos personales y académicos, correo institucional,
contraseña y confirmación. Rechaza correos repetidos y exige aceptar las normas.
Las nuevas cuentas siempre tienen rol de estudiante.

### 3.1.5. Recuperación de contraseña

Ruta `/recuperar-contrasena`. Genera un enlace local de un solo uso y vigencia
de 15 minutos. Permite establecer una contraseña nueva. La pantalla aclara que
no se envían correos: el envío real necesita un backend.

### 3.1.6. Mi cuenta

Ruta `/mi-cuenta`. Permite editar nombres, apellidos, teléfono, carrera y ciclo,
descartar cambios y cambiar la clave comprobando la anterior.

### 3.1.7. Acceso denegado

Ruta `/acceso-denegado`. Un estudiante que intenta abrir la administración es
redirigido a esta pantalla. Incluye regreso al catálogo y acceso con otra cuenta.

### 3.1.8. Página no encontrada (404)

Una ruta desconocida muestra la pantalla 404. También se puede visitar
`/no-encontrado`. La navegación permite volver al inicio o al catálogo.

### 3.1.9. Mensajes y modales de acceso

El registro y la recuperación muestran confirmaciones; los formularios muestran
errores de datos o credenciales. `/mensajes-acceso` reúne ejemplos y un modal
demostrativo que no modifica la cuenta.

### 3.1.10. Validaciones y estados

Correo institucional, usuario único, contraseña de al menos ocho caracteres con
mayúscula y número, confirmación coincidente, datos obligatorios y teléfono de
nueve dígitos cuando se completa. Una cuenta bloqueada no puede ingresar.
Las rutas privadas redirigen al inicio de sesión.

### 3.1.11. Mockups de HU-1

![Inicio de sesión](mockups/hu1.jpg)

### 3.1.12. Implementación de HU-1

`pages/cuenta/` contiene componentes React. La lógica vigente está en
`assets/js/compartido/sesion.js`; los usuarios de ejemplo, en
`datos/usuarios.js`. La sesión se conserva por pestaña en sessionStorage.
La protección es de demostración frontend, no reemplaza autorización en servidor.

## 3.2. HU-2 — Publicaciones

### 3.2.1. Objetivo de la HU-2

Permitir al propietario crear, editar y administrar la disponibilidad de su
material académico con fotografías y reglas de precio.

### 3.2.2. Mis publicaciones · con datos

`/mis-publicaciones` muestra únicamente avisos de la cuenta activa, con precio,
categoría, curso y estado. Permite filtrar y acceder a edición o fotografías.

### 3.2.3. Mis publicaciones · estado vacío

Una cuenta nueva no tiene avisos. Se ofrece crear el primero. Los filtros sin
coincidencias también muestran un estado vacío.

### 3.2.4. Nuevo aviso

`/nuevo-aviso` incluye título, descripción, categoría, curso, condición, precio,
aceptación de rebajas, mínimo y fotos. Permite publicar o guardar un borrador.
`?id=...` edita un aviso propio.

### 3.2.5. Nuevo aviso · errores de validación

Publicar un formulario incompleto presenta una lista de errores sin perder los
datos. Se exige título de 15 caracteres, descripción de 20, curso, categoría,
condición, precio positivo, mínimo no superior al precio y al menos una imagen.
Un borrador admite título desde tres caracteres y no requiere foto.

### 3.2.6. Carga de fotografías

`/fotografias-aviso?id=...` permite administrar las imágenes de un aviso propio.
Admite hasta seis JPG o PNG de máximo 5 MB cada uno. Ofrece vista previa,
eliminación y cambio de orden; la primera foto cargada es la portada.
Las imágenes se guardan en IndexedDB. Un fallo al cargar fotos impide guardar
para evitar sobrescribirlas involuntariamente.

### 3.2.7. Modales de estado y eliminación

Pausar, volver a publicar y eliminar requieren confirmación. La eliminación es
lógica y cierra ofertas pendientes. Un aviso reservado, vendido o retirado por
moderación no admite edición ni estos cambios. Un borrador se publica desde
Editar, completando sus datos.

Referencia visual de HU-2:

![Mis publicaciones](mockups/hu2.jpg)

Implementación: `pages/publicaciones/`, `assets/js/hu2/publicaciones.js` y
`assets/js/compartido/storage.js`.

## 3.3. HU-3 — Catálogo y búsqueda

### 3.3.1. Objetivo de la HU-3

Facilitar el descubrimiento de materiales y la consulta del vendedor antes de
guardar un favorito o iniciar una oferta.

### 3.3.2. Catálogo · con resultados

`/catalogo` muestra tarjetas de avisos publicados, precio, curso, condición y
portada. Oculta publicaciones no disponibles y vendedores bloqueados.

### 3.3.3. Catálogo · sin resultados

Una búsqueda sin coincidencias muestra un mensaje y permite limpiar filtros.
Ejemplo: buscar "producto inexistente xyz".

### 3.3.4. Catálogo · cargando con esqueletos

Al entrar aparecen tarjetas de carga durante la preparación inicial del catálogo.
La demora es simulada para el avance local. La animación respeta la preferencia
del sistema de reducir movimiento.

### 3.3.5. Detalle del aviso · sin sesión

`/aviso?id=...` muestra material, galería, precio, descripción y vendedor.
Ofertar o guardar un favorito requiere ingresar; se conserva la ruta de regreso.

### 3.3.6. Detalle · con oferta activa propia

Si el comprador ya tiene una propuesta pendiente, puede abrir su negociación.
No puede enviar una segunda oferta activa sobre el mismo aviso.

### 3.3.7. Detalle · aviso vendido

Los avisos vendidos conservan su detalle y muestran su estado, sin admitir nuevas
ofertas. Ejemplo original: `/aviso?id=av-5`.

### 3.3.8. Favoritos

`/favoritos` reúne los guardados de la cuenta activa. Permite quitarlos y muestra
un estado vacío cuando corresponde. Los favoritos no se comparten entre cuentas.

### 3.3.9. Perfil público del vendedor

`/vendedor?correo=...` presenta el usuario real, su actividad publicada,
reputación y opiniones recibidas. Permite reportar una cuenta ajena.

### 3.3.10. Búsqueda y filtros

Texto, categoría, curso, condición y rango de precio combinables. Los enlaces de
la landing precargan la categoría y la búsqueda global precarga el texto.

### 3.3.11. Ordenamiento y paginación

Orden por más recientes, menor precio o mayor precio. Seis avisos por página,
controles anterior/siguiente y contador. Cambiar filtros regresa a la página uno.

### 3.3.12. Validaciones y estados

Se indican rangos de precio inválidos. Un aviso inexistente u oculto muestra que
no está disponible. Los controles de oferta respetan propietario y estado.

### 3.3.13. Mockups de HU-3

![Catálogo](mockups/hu3.jpg)

### 3.3.14. Implementación de HU-3

`pages/catalogo/`, tarjeta reutilizable en `pages/compartido/TarjetaAviso.jsx`
y almacenamiento compartido. Filtros, paginación y favoritos usan estado React.

## 3.4. HU-4 — Ofertas

### 3.4.1. Objetivo de la HU-4

Negociar un precio conservando el historial y respetando el turno de respuesta.

### 3.4.2. Ofertas recibidas · con datos

`/ofertas` abre las propuestas recibidas por el vendedor. Rosa tiene una oferta
de Diego sobre Álgebra lineal. Se muestra monto, estado y quién debe responder.

### 3.4.3. Ofertas enviadas · con datos

La pestaña Enviadas reúne las propuestas de compra del usuario. Rosa tiene una
oferta enviada sobre Programación con Java, cuyo vendedor es Diego.

### 3.4.4. Ofertas · estado vacío

Una cuenta sin negociaciones o un filtro sin coincidencias presenta un mensaje
y enlace para explorar el catálogo.

### 3.4.5. Hilo de negociación

`/ofertas/:id` conserva propuestas, mensajes, autor y fecha. Solo comprador y
vendedor pueden consultar el hilo. Indica último monto y acciones permitidas.

### 3.4.6. Modales de oferta y contraoferta

El detalle del aviso abre el formulario de oferta. El hilo abre el de
contraoferta y las confirmaciones de las acciones disponibles.

### 3.4.7. Funcionalidades de gestión de ofertas

Enviar, aceptar, rechazar, contraofertar y retirar. Aceptar reserva el aviso,
cierra otras propuestas pendientes y genera un acuerdo único. Una contraoferta
cambia el turno a la otra persona. El comprador puede retirar su oferta pendiente.

### 3.4.8. Validaciones de HU-4

Sesión activa, aviso publicado, vendedor no bloqueado, comprador distinto del
propietario, monto entre mínimo y precio, máximo dos decimales, sin duplicados.
Las contraofertas deben cambiar el monto. Solo responde quien tiene el turno.
Las negociaciones terminadas no se modifican.

### 3.4.9. Mockups de HU-4

![Ofertas recibidas](mockups/hu4.jpg)

### 3.4.10. Implementación de HU-4

`pages/ofertas/` y `assets/js/hu4/ofertas.js`. Las reglas se comprueban en la
función de cada acción además de mostrar u ocultar botones.

## 3.5. HU-5 — Acuerdos de entrega

### 3.5.1. Objetivo de la HU-5

Coordinar el intercambio dentro del campus y cerrar la venta con confirmación
de ambas partes.

### 3.5.2. Acuerdo generado

Aceptar una oferta crea un acuerdo con aviso, comprador, vendedor y monto,
inicialmente Por coordinar. El producto pasa a Reservado.

### 3.5.3. Coordinar punto y horario

En el detalle se elige un punto del campus y fecha futura. La contraparte aprueba
el horario. Cambiar la propuesta reinicia las aprobaciones.

### 3.5.4. Mis acuerdos

`/acuerdos` muestra únicamente acuerdos propios, estado, contraparte, monto y
coordinación. Incluye filtros y estado vacío.

### 3.5.5. Detalle del acuerdo

`/acuerdos/:id` presenta participantes, precio acordado, punto, horario,
aprobaciones y confirmaciones de entrega. Cada persona confirma su parte.
Con ambas confirmaciones se cierra el acuerdo y se marca el producto Vendido.

### 3.5.6. Modal de cancelación del acuerdo

Solicita un motivo antes de cancelar. Se conserva el historial y se libera el
aviso para volver a recibir ofertas.

### 3.5.7. Funcionalidades de gestión de acuerdos

Consultar, coordinar, reprogramar antes de iniciar la entrega, aprobar el horario,
confirmar la entrega y cancelar antes de cualquier confirmación de entrega.
Los estados finales no admiten nuevas operaciones.

### 3.5.8. Validaciones de HU-5

Participación en el acuerdo, punto permitido, fecha futura, aprobación de ambos
antes de entregar, sin confirmaciones duplicadas. Cancelar requiere motivo de
10 a 300 caracteres. Una entrega parcial no puede cancelarse desde el flujo normal.

### 3.5.9. Mockups de HU-5

![Mis acuerdos](mockups/hu5.jpg)

### 3.5.10. Implementación de HU-5

`pages/acuerdos/` y `assets/js/hu5/acuerdos.js`, con datos compartidos con HU4.
Los ejemplos incluyen dos acuerdos cerrados y uno pendiente de coordinación.

## 3.6. HU-6 — Reputación

Historia complementaria incluida en esta versión.

### 3.6.1. Objetivo de la HU-6

Permitir opiniones basadas en intercambios completados, no en usuarios arbitrarios.

### 3.6.2. Calificar a la contraparte

Desde `/calificaciones`, un acuerdo cerrado pendiente de opinión abre un modal
con una a cinco estrellas y comentario opcional.

### 3.6.3. Perfil público con reputación

El perfil y el detalle del vendedor muestran promedio calculado a partir de
calificaciones recibidas. El perfil presenta autores, comentarios y fechas.

### 3.6.4. Mis calificaciones

Pestañas Pendientes, Recibidas y Enviadas. Muestran las opiniones relacionadas
con la cuenta y estados vacíos cuando no hay registros.

### 3.6.5. Validaciones

Acuerdo cerrado, autor participante y destinatario automáticamente identificado
como contraparte. Una calificación por autor y acuerdo, estrellas enteras entre
uno y cinco, comentario de máximo 300 caracteres.

### 3.6.6. Mockups de HU-6

![Calificaciones pendientes](mockups/hu6.jpg)

### 3.6.7. Implementación de HU-6

`pages/reputacion/Calificaciones.jsx` y `assets/js/hu6/reputacion.js`.
El promedio se recalcula desde los registros persistidos, no es un número fijo.

## 3.7. HU-7 — Moderación y métricas

Historia complementaria incluida en esta versión. Acceso con la cuenta administradora.

### 3.7.1. Objetivo de la HU-7

Gestionar reportes y cuentas, conservando motivos de las decisiones y una visión
de la actividad del tablón.

### 3.7.2. Bandeja de reportes

`/administracion/reportes` reúne reportes de avisos y usuarios. Permite buscar
y filtrar por tipo y estado. Los estudiantes reportan desde el aviso o perfil.

### 3.7.3. Detalle del reporte

`/administracion/reportes/:id` muestra autor, fecha, objetivo, motivo, descripción
y resolución. Permite abrir el elemento reportado.

### 3.7.4. Gestión de usuarios

`/administracion/usuarios` permite buscar por nombre o correo, filtrar activos
y bloqueados, consultar actividad y bloquear o habilitar cuentas de estudiantes.
No permite bloquear al administrador.

### 3.7.5. Tablero de métricas

`/administracion` muestra publicaciones activas, acuerdos cerrados, monto de
ventas completadas, ofertas pendientes, reportes pendientes y cuentas bloqueadas.
Incluye distribución por estado de publicaciones y ofertas. Todas las cifras se
calculan desde datos locales; no se simulan pagos.

### 3.7.6. Modales de moderación

Retirar aviso, bloquear cuenta, desbloquear cuenta y descartar reporte requieren
confirmación con motivo. El reporte conserva resolución, administrador y fecha.

### 3.7.7. Validaciones

Rol administrador comprobado en rutas y acciones. Motivo mínimo de diez
caracteres. No se resuelve dos veces un reporte. Un estudiante no puede reportarse
ni reportar su propio aviso, ni repetir un reporte pendiente sobre el mismo objetivo.
Bloquear impide ingresar, pausa publicaciones y cierra negociaciones activas.
Retirar un aviso lo oculta del catálogo. Los acuerdos cerrados se conservan.

### 3.7.8. Mockups de HU-7

![Panel administrativo](mockups/hu7.jpg)

### 3.7.9. Implementación de HU-7

`pages/administracion/Administracion.jsx`, `assets/js/hu7/moderacion.js` y
`pages/compartido/BotonReporte.jsx`. Para producción, todos estos permisos y
persistencia deben trasladarse o repetirse en un backend autenticado.

## Comprobación de la entrega

`npm test` ejecuta 12 casos automatizados de cuenta, recuperación, favoritos,
publicaciones, negociación, entrega, reputación, reportes y bloqueo.
`npm run build` genera la compilación de producción.
Las capturas corresponden a una revisión manual de las siete áreas en navegador.
Consulta README.md para las cuentas y el recorrido de demostración.
