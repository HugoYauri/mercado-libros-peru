# Historias funcionales del prototipo

Esta rama contiene siete HU independientes en React. La referencia de estructura
y complejidad es `Entrega1_v1`: marcado directo e interacciones sencillas.
Las imágenes originales permanecen en `docs/mockups/`.

| Historia | Componentes principales                                         | Interacciones locales                                                        |
| -------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| HU1      | Landing, IniciarSesion, Registro, RecuperarContrasena, MiCuenta | Búsqueda ilustrativa, validación HTML, mostrar clave, modales, edición local |
| HU2      | MisPublicaciones, NuevoAviso, FotografiasAviso                  | Filtros, menú, cambio de estado, eliminación, formulario, fotos en memoria   |
| HU3      | Catalogo, DetalleAviso, Favoritos, PerfilVendedor               | Filtros, orden, selección de foto, favoritos y oferta ilustrativa            |
| HU4      | Ofertas, DetalleOferta, ModalOferta                             | Pestañas, filtros, aceptar, rechazar, retirar y contraofertar                |
| HU5      | MisAcuerdos, DetalleAcuerdo, CoordinarEntrega, AcuerdoGenerado  | Filtros, propuesta de encuentro, aceptación, confirmación y cancelación      |
| HU6      | Calificaciones, ModalCalificacion                               | Pendientes, recibidas, enviadas y calificación local                         |
| HU7      | Administracion, Metricas, Reportes, DetalleReporte, Usuarios    | Navegación interna, filtros y moderación ilustrativa                         |

Cada componente que necesita contenido contiene su propio arreglo pequeño. Los
componentes de presentación reciben props, sin consultar datos de otras HU.
Cabecera y pie se comparten; los diálogos usan un componente común. No hay
contextos, eventos globales, servicios de negocio ni efectos de sincronización.

Los formularios comprueban campos requeridos y formatos con validación HTML.
Las acciones muestran confirmaciones o modifican únicamente el estado local de
la pantalla. No hay autenticación real ni registros persistentes. El acceso a
publicaciones, ofertas, acuerdos, calificaciones y administración es directo.

Las cifras, nombres y mensajes visibles son contenido de los mockups, no cuentas
con credenciales ni un historial compartido. Recargar restaura los ejemplos.
El recorrido de pruebas manuales está en [EJEMPLOS_HU.md](EJEMPLOS_HU.md).
