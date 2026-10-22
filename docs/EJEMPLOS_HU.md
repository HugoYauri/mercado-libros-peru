# Revisión independiente de las HU

Iniciar con `npm ci` y `npm run dev`. Abrir las rutas en la dirección indicada por
Vite. No se necesitan cuentas ni credenciales. Los datos se reinician al recargar.

## HU1 — Cuenta y acceso

1. Abrir `/`, buscar «Cálculo» y revisar las tarjetas ilustrativas.
2. En `/ingresar`, probar un correo de otro dominio: aparece un error. Probar
   `prueba@aloe.ulima.edu.pe` con `Ejemplo123`: abre `/mi-cuenta`.
3. En `/registro`, completar los campos y probar confirmaciones de clave
   diferentes y luego iguales; revisar el modal de confirmación.
4. En `/mi-cuenta`, editar nombres y guardar; revisar el texto actualizado.
5. En `/recuperar-contrasena`, recorrer los pasos y verificar las contraseñas.
6. Abrir `/mensajes-acceso`, `/acceso-denegado` y `/no-encontrado`.

## HU2 — Publicaciones

1. Abrir `/mis-publicaciones` directamente. Buscar «Cálculo» y filtrar Pausados.
2. En Acciones, cambiar el estado; luego abrir Eliminar y escribir ELIMINAR.
3. Revisar `/mis-publicaciones?ejemplo=vacio` y `/nuevo-aviso?ejemplo=errores`.
4. En `/nuevo-aviso`, completar los campos, elegir una foto JPG/PNG y publicar.
   Revisar también Guardar borrador sin completar el formulario.
5. Abrir `/nuevo-aviso?id=1` y modificar el precio para revisar la vista previa.
6. En `/fotografias-aviso`, agregar y quitar fotos; elegir la portada. Probar un
   archivo de otro formato o mayor de 5 MB y comprobar el mensaje de error.

## HU3 — Catálogo

1. Abrir `/catalogo`, buscar «Cálculo», cambiar categoría, condición y precio;
   ordenar por menor precio y limpiar los filtros.
2. Abrir `/aviso`, seleccionar miniaturas, marcar favorito y enviar una oferta.
   Retirarla y comprobar que vuelve a mostrarse Hacer oferta.
3. Revisar `/aviso?ejemplo=vendido`, que no permite ofertar.
4. En `/favoritos`, quitar las tarjetas hasta ver el estado vacío. Recargar y
   comprobar que vuelven los ejemplos. Cambiar pestañas en `/vendedor`.
5. Abrir Reportar aviso, completar motivo y detalle y enviar el ejemplo.

## HU4 — Ofertas

1. Abrir `/ofertas`, alternar recibidas/enviadas y filtrar estados.
2. Aceptar, rechazar o contraofertar mediante los modales. Revisar la fila.
3. Abrir `/ofertas/1` directamente, contraofertar y luego aceptar.
4. Revisar `/ofertas?ejemplo=vacio`. Ninguna acción crea datos en acuerdos.

## HU5 — Acuerdos

1. Abrir `/acuerdos`, filtrar En curso y Cerrados, y buscar por título.
2. Abrir `/acuerdos/1?vista=coordinar`, seleccionar punto, fecha futura y hora,
   enviar la propuesta y revisar el detalle.
3. Aceptar el punto y horario; confirmar entrega en el modal.
4. En `/acuerdos/2`, cancelar y seleccionar un motivo.
5. Revisar `/acuerdos/4` (entregado), `/acuerdos/5` (cancelado),
   `/acuerdo-generado` y `/acuerdos?ejemplo=vacio`.

## HU6 — Calificaciones

1. Abrir `/calificaciones` directamente y calificar el ejemplo pendiente.
2. Revisar que pasa a Enviadas y desaparece de Pendientes.
3. Revisar Recibidas y `/calificaciones?ejemplo=vacio`.

## HU7 — Administración

1. Abrir `/administracion/metricas` y revisar las cifras ilustrativas.
2. En `/administracion/reportes`, buscar y filtrar estado y tipo.
3. Abrir `/administracion/reportes/1`, elegir una acción y escribir un motivo.
   La resolución solo afecta a esa vista.
4. En `/administracion/usuarios`, buscar una ficha, bloquear y desbloquear.
   Estas fichas no tienen contraseña ni permiten iniciar sesión.

## Comprobaciones comunes

- Abrir cada entrada en una pestaña nueva sin pasar por HU1.
- Confirmar que las acciones no modifican otra HU y que recargar restaura datos.
- Verificar cabecera, pie, enlaces internos, cierre con botón y Escape de modales.
- Ejecutar `npm test` y `npm run build`.
- Comparar las imágenes originales y los estilos existentes antes y después.
