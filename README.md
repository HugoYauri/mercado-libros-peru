# Tablón ULima — Entrega1_v1.2

Prototipo de interfaces en React, JSX, HTML y CSS. Se toma `Entrega1_v1` como
referencia de programación: componentes directos, formularios, arreglos pequeños,
`map`, `filter` y estados locales para interacciones básicas.

## Ejecutar

```bash
npm ci
npm run dev
npm run build
npm test
```

Vite muestra la dirección local al iniciar. Para comprobar el resultado de
producción: `npm run build` y `npm run preview`.

## Revisar cada historia de usuario

| HU                    | Entrada directa                     | Ejemplos adicionales                                                                                                          |
| --------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| HU1 · Cuenta y acceso | `/hu1` o `/`                        | `/ingresar`, `/registro`, `/mi-cuenta`, `/recuperar-contrasena`, `/mensajes-acceso`                                           |
| HU2 · Publicaciones   | `/hu2` o `/mis-publicaciones`       | `/mis-publicaciones?ejemplo=vacio`, `/nuevo-aviso`, `/nuevo-aviso?id=1`, `/nuevo-aviso?ejemplo=errores`, `/fotografias-aviso` |
| HU3 · Catálogo        | `/hu3` o `/catalogo`                | `/aviso`, `/aviso?ejemplo=vendido`, `/favoritos`, `/favoritos?ejemplo=vacio`, `/vendedor`                                     |
| HU4 · Ofertas         | `/hu4` o `/ofertas`                 | `/ofertas?vista=enviadas`, `/ofertas?ejemplo=vacio`, `/ofertas/1`                                                             |
| HU5 · Acuerdos        | `/hu5` o `/acuerdos`                | `/acuerdos?ejemplo=vacio`, `/acuerdos/1`, `/acuerdos/2`, `/acuerdos/3`, `/acuerdos/1?vista=coordinar`, `/acuerdo-generado`    |
| HU6 · Calificaciones  | `/hu6` o `/calificaciones`          | `/calificaciones?ejemplo=vacio`                                                                                               |
| HU7 · Administración  | `/hu7` o `/administracion/metricas` | `/administracion/reportes`, `/administracion/reportes/1`, `/administracion/usuarios`                                          |

Cada HU se abre directamente **sin correo, cuenta ni inicio de sesión**. Los
arreglos de ejemplo están dentro del componente JSX que los muestra. No existe
un repositorio compartido de datos ni sincronización entre pantallas. Al recargar
o cambiar de pantalla, los ejemplos se reinician.

La cabecera y el pie se comparten mediante `Cabecera`, `Pie` y `Marco`. Los enlaces
visuales a otras HU se mantienen en su lugar y no ejecutan navegación, para que
la revisión sea independiente. Las rutas de la tabla permiten abrir cada HU.

## Alcance de las interacciones

- HU1: validación básica, mostrar contraseña, confirmaciones y edición local de
  una ficha. `/ingresar` acepta cualquier correo con formato
  `nombre@aloe.ulima.edu.pe` y una clave de ocho caracteres con mayúscula y número;
  abre la ficha ilustrativa de la propia HU1. No autentica ni registra cuentas.
- HU2: buscar, filtrar, cambiar estado y eliminar una fila; editar un formulario,
  ver su vista previa y agregar, quitar o elegir la foto principal. Publicar y
  guardar borrador muestran una confirmación local.
- HU3: buscar, filtrar, ordenar, marcar favoritos y preparar o retirar una oferta
  de ejemplo. Los favoritos y ofertas no se trasladan a otra pantalla o HU.
- HU4: pestañas, filtros y respuestas locales a ofertas. Aceptar una oferta no
  crea un registro en la HU5. Los mensajes del hilo son ejemplos estáticos del
  componente y no un historial vinculado a una cuenta.
- HU5: filtrar acuerdos, proponer punto y horario, aceptar una propuesta,
  confirmar entrega y cancelar el ejemplo.
- HU6: consultar pestañas y calificar un ejemplo pendiente, sin depender de HU5.
- HU7: métricas ilustrativas, filtros de reportes y acciones locales de moderación.
  Las fichas de usuarios son contenido visual; no son cuentas precargadas.

No se usan `localStorage`, `sessionStorage`, IndexedDB, cookies, servicios remotos
ni cuentas con credenciales. Las fotos seleccionadas se leen en memoria y se
pierden al salir. No se incluyen historiales persistentes de demostración.

## Estructura

```text
App.jsx                     Rutas directas de las siete HU
main.jsx                    Entrada de React
pages/cuenta/               HU1
pages/publicaciones/        HU2
pages/catalogo/              HU3
pages/ofertas/               HU4
pages/acuerdos/              HU5
pages/reputacion/            HU6
pages/administracion/        HU7
pages/compartido/            Cabecera, pie, marco y presentación común
assets/css/                 Estilos visuales existentes
assets/js/compartido/        Compatibilidad de rutas anteriores
docs/mockups/              Imágenes originales de referencia
```

Las imágenes originales y las hojas de estilo de las HU se conservan. Se añadió
`modales.css` con las mismas reglas del modal existente para compartirlas sin
que la HU4 tenga que importar el catálogo. Las referencias disponibles cubren
H1–H5; HU6 y HU7 conservan sus clases y presentación existentes.

Consulta [EJEMPLOS_HU.md](docs/EJEMPLOS_HU.md) para la revisión manual de cada HU.
