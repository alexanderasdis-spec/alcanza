---
name: crear-componente
description: Crea componentes, páginas, hooks o servicios del frontend de Alcanza (React + Vite + Tailwind) siguiendo las reglas del proyecto. Úsala cada vez que haya que agregar o modificar una pieza de la interfaz en src/.
---

# Crear un componente de Alcanza

Alcanza es el proyecto final de React de Harold. Todo lo que se escriba debe poder explicarse en la sustentación.

## Antes de escribir

1. Proponer al usuario qué se va a crear (nombre, carpeta, props) y esperar su visto bueno. Responder siempre en español.
2. Leer `ALCANZA_idea_presentable.pdf` si hay dudas de diseño o del orden de las secciones: es la fuente de verdad.
3. Buscar si ya existe algo reutilizable en `src/components/animaciones/`, `src/hooks/` y `src/utils/` antes de crear algo nuevo.

## Dónde va cada cosa

| Pieza | Carpeta |
|---|---|
| Página de una ruta | `src/pages/` (y registrar la ruta en `src/App.jsx`) |
| Componente reutilizable | `src/components/` o una subcarpeta por tema (`antojos/`, `bienvenida/`…) |
| Hook personalizado | `src/hooks/useAlgo.js` |
| Llamada a una API o al almacenamiento | `src/services/` (las páginas nunca llaman a Axios ni a `localStorage` directamente) |
| Cálculo o formato sin estado | `src/utils/` como función pura |
| Estado global | `context/xContext.js` + `context/XProvider.jsx` + `hooks/useX.js` (tres archivos, por la regla `only-export-components` de oxlint) |

## Reglas de código

- **JSDoc en español en todo**: descripción, `@param` (incluidas las props como `props.nombre`), `@returns` y un `@example` cuando ayude. Comentarios en línea solo donde la razón no sea obvia.
- **Nombres en español** para variables, funciones y componentes (`alCambiar`, `precioFinal`, `TarjetaAntojo`).
- **Estilo "Fintech festival"**: usar la paleta de `src/index.css` (`violeta`, `menta`, `rosa`, `amarillo`, `fondo`, `fondo-oscuro`), `font-titulo` (Poppins) para títulos y números grandes, tarjetas `rounded-3xl`, degradado `from-violeta to-rosa` en botones principales. Regla 80 % limpio, 20 % fiesta.
- **Modo oscuro**: toda clase de color lleva su variante `dark:`; en oscuro los acentos van casi neón.
- **Animaciones**: reutilizar `Aparecer`, `TarjetaInteractiva`, `Magnetico`, `ContadorAnimado`, `BarraProgreso` y `EtiquetaDescuento`. Los resortes y curvas salen siempre de `src/utils/animaciones.js`; no inventar valores sueltos.
- **Precios**: mostrarlos con `formatear()` de `useMoneda` (convierte a la moneda elegida). Los cálculos de "¿cuándo lo alcanzo?" van con `useAlcance`.
- **Datos remotos**: `useFetch(funcionDelServicio)`. Si la función depende de algo, envolverla en `useCallback`. Manejar los tres estados: cargando (esqueleto), error (`EstadoMensaje` con "Reintentar") y vacío.
- **Accesibilidad**: `aria-label` en botones de solo ícono, `aria-pressed`/`aria-checked` en filtros, `aria-invalid` y `aria-describedby` en formularios, `alt` en imágenes.
- **Responsive**: una columna en celular, cuadrícula en computador; probar a 375 px de ancho sin scroll horizontal.
- No integrar APIs externas ni el backend si el usuario no lo pidió.

## Al terminar

Usar la skill `verificar-proyecto` (lint, compilación y prueba en el navegador) y después `actualizar-documentacion` si cambió algo que esté descrito en los PDF.
