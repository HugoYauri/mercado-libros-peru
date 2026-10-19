# MercadoLibros V2 · Tablón ULima

Avance de frontend en React y Vite con HU1 a HU7: cuenta, publicaciones, catálogo,
ofertas, acuerdos, reputación y moderación. La carpeta original no se modifica.

## Ejecutar en la misma terminal de VS Code

Abre la carpeta `mercadolibros-V2` en VS Code. En su terminal integrada:

```powershell
npm install
npm run dev
```

Si ya tienes las dependencias, solo ejecuta `npm run dev`.
Abre `http://localhost:5173/`. Si otro proyecto ocupa ese puerto, detén su servidor
con Ctrl+C en su propia terminal antes de iniciar esta versión.

## Cuentas de prueba

| Persona | Correo                          | Contraseña | Rol            |
| ------- | ------------------------------- | ---------- | -------------- |
| Rosa    | rosa.quispe@aloe.ulima.edu.pe   | Rosa2026!  | Estudiante     |
| Diego   | diego.salazar@aloe.ulima.edu.pe | Diego2026! | Estudiante     |
| Andrea  | admin@aloe.ulima.edu.pe         | Admin2026! | Administración |

También se conserva la cuenta de ejemplo `demo@aloe.ulima.edu.pe`, clave
`Demo2026!`, propietaria de una publicación del proyecto original.

Son credenciales ficticias para esta demostración local. No uses contraseñas ni
datos personales reales. La autenticación comprueba la contraseña guardada, pero
no es un sistema de seguridad de producción: los datos y claves de demostración
están en el navegador. La recuperación genera un enlace temporal local y NO
envía correos. No hay backend, pagos ni sincronización entre dispositivos.

## Qué probar

1. Ingresa como Rosa: revisa sus publicaciones y la oferta recibida de Diego.
2. En Ofertas, abre Álgebra lineal y responde con una contraoferta o acéptala.
3. Cierra sesión e ingresa como Diego para continuar la misma negociación.
4. Al aceptar, se reserva el producto y aparece un acuerdo en ambas cuentas.
5. Propón punto y fecha futura; la otra persona debe aprobar el horario.
6. Confirma la entrega desde ambas cuentas: el acuerdo cierra y el aviso se vende.
7. En Calificaciones, valora a la contraparte. Hay acuerdos cerrados de ejemplo
   para probar sin realizar primero todos los pasos.
8. Reporta un aviso ajeno desde su detalle o un usuario desde su perfil.
9. Ingresa como administrador para revisar reportes, retirar avisos, bloquear o
   habilitar cuentas y consultar métricas. Los estudiantes no pueden entrar.
10. Para ver los estados vacíos, filtra por un estado sin datos o registra una
    nueva cuenta de prueba. En el catálogo busca un texto que no exista.

Los datos se generan una sola vez: no se duplican ni se reinician al recargar.
Usa siempre el mismo navegador y dirección: localhost y 127.0.0.1 mantienen
almacenamientos diferentes. Puedes alternar cuentas cerrando sesión; cada pestaña
mantiene su sesión y comparte los datos locales del mismo origen.

## Organización

```text
App.jsx                       Rutas limpias de React
main.jsx                      Inicio y carga de datos de demostración
pages/
  cuenta/                     HU1
  publicaciones/              HU2
  catalogo/                   HU3
  ofertas/                    HU4
  acuerdos/                   HU5
  reputacion/                 HU6
  administracion/             HU7
  compartido/                 Marco, diálogos, tarjetas y reportes
assets/
  css/                        Estilos y diseño adaptable
  js/
    compartido/               Sesión y almacenamiento
    hu1/, hu2/, hu3/           Estructura heredada y reglas de publicaciones
    hu4/, hu5/, hu6/, hu7/     Reglas de negociación, entrega y moderación
datos/                        Usuarios y registros de ejemplo
public/imagenes/              Portada ilustrativa
docs/HISTORIAS_FUNCIONALES.md  Objetivos, pantallas, validaciones e implementación
docs/mockups/                 Capturas de las siete historias
tests/                        Pruebas automatizadas de reglas y permisos
```

Se conservan los módulos antiguos de HU1–HU3 como referencia del proyecto recibido.
Las pantallas actuales usan React; la autenticación vigente está en
`assets/js/compartido/sesion.js`, no en los antiguos controladores de formularios.

Las URLs no llevan .html: `/catalogo`, `/ofertas`, `/acuerdos`,
`/calificaciones`, `/administracion`. Los enlaces antiguos se convierten.
El archivo técnico `index.html` es necesario para Vite y no aparece en la dirección.
Un despliegue futuro necesita redirigir rutas desconocidas a esa entrada de React.

## Persistencia y límites

Avisos, usuarios, favoritos por cuenta, ofertas, acuerdos, reportes y calificaciones
se guardan en localStorage. Fotos en IndexedDB; sesión y recuperación en sessionStorage.
La eliminación de avisos es lógica para conservar el historial. La moderación
cierra ofertas y cancela acuerdos activos relacionados; no borra entregas cerradas.
Desbloquear una cuenta no vuelve a publicar automáticamente sus avisos pausados.

Las métricas de ventas cuentan acuerdos cerrados y su monto acordado; un aviso
antiguo marcado vendido sin acuerdo no incrementa esas métricas.

## Verificaciones y formato

```powershell
npm test
npm run build
npm run format
```

Las pruebas se ejecutan con datos en memoria, sin modificar los del navegador.
El código fuente tiene sangría de dos espacios, atributos separados y bloques
legibles. No edites `dist/`: sus archivos se comprimen automáticamente al compilar.
El ZIP incluye fuentes y documentación; no necesita incluir node_modules ni dist.
