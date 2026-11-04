---
name: actualizar-documentacion
description: Mantiene al día la documentación de Alcanza - el sitio generado con TypeDoc, el PDF de la idea, el PDF "Cómo funciona el código" y el README. Úsala después de cada avance que cambie lo que esos documentos describen.
---

# Actualizar la documentación de Alcanza

La documentación es un requisito del proyecto final. Hay cuatro piezas:

| Pieza | Fuente | Resultado |
|---|---|---|
| Sitio de documentación del código | Comentarios JSDoc en `src/` + `typedoc.json` | `docs/codigo/` (ignorado en Git) |
| PDF de la idea | `docs/documento-idea.html` | `ALCANZA_idea_presentable.pdf` |
| PDF técnico | `docs/documento-codigo.html` | `ALCANZA_documentacion_codigo.pdf` |
| README | `README.md` | — |

## Pasos

1. **Revisar qué cambió** desde el último commit (`git log`, `git diff`) y decidir qué documentos lo mencionan.
2. **Comentarios JSDoc**: todo archivo nuevo o cambiado debe tener su comentario en español.
3. **Sitio TypeDoc**: `npm run docs`. Debe terminar sin errores ni advertencias. Si aparece un tipo que no entiende, corregir el comentario, no la configuración.
4. **PDF**: editar el HTML fuente, nunca el PDF.
   - Mantener el diseño: páginas de 816 × 1056 px, pie con número de página, paleta "Fintech festival".
   - Antes de imprimir, abrir el HTML en el navegador (por ejemplo `http://localhost:5173/docs/documento-codigo.html` con `npm run dev`) y comprobar con JavaScript que en cada `.pagina` el contenido termina antes del `.pie` y que ningún `pre`, `.arbol` ni `table` se desborda a lo ancho.
   - Si una página se llena, crear una página nueva en vez de apretar el texto, y renumerar los pies.
   - Generar con Edge sin interfaz (el comando exacto está en un comentario al inicio de cada HTML).
   - Abrir el PDF resultante y revisarlo página por página.
5. **README**: instalación, comandos (`dev`, `build`, `lint`, `docs`), estructura, cómo levantar el backend y capturas.
6. Guardar todo en Git en un commit que diga qué documentos se actualizaron.

## Reglas

- Nunca borrar `ALCANZA_idea_presentable.pdf`: el usuario lo pidió expresamente. Antes de un cambio grande, guardar una copia en `docs/`.
- El Google Doc de la idea es aparte: no editarlo sin que el usuario lo pida.
- Escribir en español sencillo; el usuario debe poder defender cada línea.
