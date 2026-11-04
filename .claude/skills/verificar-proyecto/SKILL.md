---
name: verificar-proyecto
description: Revisa que Alcanza funcione antes de dar un cambio por terminado o de hacer commit - lint, compilación, documentación, prueba en el navegador y, si hay backend, la colección de Postman con Newman.
---

# Verificar Alcanza

Correr todo en este orden y reportar el resultado real de cada paso (si algo falla, mostrar el error; no decir que pasó).

## Frontend (`C:\Users\Alex\Documents\alcanza`)

1. **Lint**: `npm run lint` → debe salir sin errores ni advertencias.
2. **Compilación**: `npm run build` → debe terminar con `✓ built`.
3. **Documentación**: `npm run docs` → sin errores ni advertencias.
4. **Navegador** (servidor de desarrollo en marcha):
   - Recorrer las páginas afectadas por el cambio y revisar la consola: no debe haber errores nuevos.
   - Probar en modo claro y oscuro, y a 375 px de ancho (sin scroll horizontal).
   - Si el cambio usa datos remotos, revisar los estados de carga, error y vacío.
   - Ojo: el panel del navegador integrado congela las animaciones cuando no tiene foco. Una captura borrosa o un contador en 0 no es un error: leer el DOM con JavaScript antes de concluir.
5. Si aparece "Invalid hook call" justo después de agregar una librería: reiniciar el servidor de Vite (es su caché).

## Backend (`~/alcanza-api` en WSL), si ya existe

1. Contenedores arriba: `./vendor/bin/sail ps` (debe estar `laravel.test` y `mysql`).
2. Salud: `curl -s -o /dev/null -w "%{http_code}" http://localhost/up` → `200`.
3. Migraciones al día: `./vendor/bin/sail artisan migrate:status`.
4. Colección de Postman con Newman (imagen `postman/newman:alpine`, ya descargada):

```bash
docker run --rm -v ~/alcanza-api/postman:/etc/newman postman/newman:alpine \
  run alcanza-api.postman_collection.json \
  -e alcanza-api-local.postman_environment.json \
  --env-var host=http://host.docker.internal
```

## Al final

Resumir en una tabla: paso, resultado y, si falló, la causa. Solo después proponer el commit (con el mensaje en español).
