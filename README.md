# Tablón ULima · avance HU1–HU3

Aplicación React sin backend. Mantiene el aspecto y el recorrido de los mockups: cuenta y acceso (HU1), publicaciones (HU2) y catálogo (HU3).

## Organización

```text
index.html                 Entrada de Vite; abre la landing de React
main.jsx / App.jsx         Inicio de React y rutas
pages/
  cuenta/                  Las 8 pantallas de HU1 en JSX
  publicaciones/           Avisos y gestión de fotografías de HU2
  catalogo/                Búsqueda, detalle, favoritos y perfil de HU3
assets/css/
  tokens.css               Colores y tipografía
  base.css                 Tailwind y estilos generales
  componentes.css          Estilos compartidos de las pantallas
assets/js/
  compartido/              Datos locales, sesión y mensajes comunes
  hu1/ hu2/ hu3/          Interacción de cada pantalla
datos/iniciales.js         Avisos y usuario de ejemplo
```

Cada pantalla de HU1 conserva un JSX parecido a su HTML original: `header`, `main`, formularios y `footer` permanecen en el mismo archivo. Su interacción se encuentra en el archivo correspondiente de `assets/js/hu1/`.

## Ejecutar

1. Instala Node.js.
2. Ejecuta `npm install` en esta carpeta.
3. Ejecuta `npm run dev` y abre la dirección que muestra Vite.

`npm run build` crea la versión estática en `dist/`. La aplicación usa rutas que terminan en `.html` para conservar los enlaces de las pantallas originales; en un alojamiento estático, configura las rutas desconocidas para servir `index.html`.

## Datos de demostración

- Avisos y favoritos: `localStorage`.
- Fotografías: IndexedDB.
- Sesión: `sessionStorage`.
- Registro y recuperación: simulados en el navegador; no ingreses contraseñas reales.

La negociación de ofertas, acuerdos, calificaciones y administración queda fuera del avance HU1–HU3.
