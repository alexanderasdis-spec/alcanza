---
name: crear-recurso-laravel
description: Crea un recurso CRUD completo en el backend de Alcanza (Laravel 13 + Sail en WSL, base data_alcanza) con la arquitectura vista en clase - migración, modelo, repositorio con interfaz, servicio, Form Requests, controlador, ruta y prueba en Postman. Úsala para perfiles, metas, abonos o cualquier tabla nueva.
---

# Crear un recurso de Laravel en Alcanza

## Entorno

- Proyecto: `~/alcanza-api` dentro de WSL (`Ubuntu-24.04`, usuario `alex`). Base de datos MySQL 8.4 `data_alcanza`.
- Todo comando de PHP o artisan se ejecuta con Sail: `./vendor/bin/sail artisan ...`. No hace falta PHP en Windows.
- Desde PowerShell, los comandos con comillas o `$( )` se rompen al pasar por `wsl -- bash -c "..."`. Escribir los pasos en un script `.sh` (en el scratchpad) y ejecutarlo con `wsl -d Ubuntu-24.04 -- bash /mnt/c/.../script.sh`.
- `~/mi-api` es el proyecto de clase del usuario: sirve solo como **referencia de estilo**. No modificarlo.

## Arquitectura obligatoria (la misma de clase)

```
routes/api.php  →  Controlador  →  Servicio  →  Repositorio (interfaz)  →  Modelo  →  MySQL
                       ↑
              Form Requests (Store / Update)
```

Para un recurso `Meta` (tabla `metas`):

1. **Migración** – `sail artisan make:migration create_metas_table`. Columnas en español, claves foráneas con `foreignId(...)->constrained()->cascadeOnDelete()`, `timestamps()`.
2. **Modelo** – `app/Models/Meta.php` con `protected $table` y `protected $fillable`. Relaciones (`hasMany`, `belongsTo`) y `casts` para decimales y fechas.
3. **Interfaz del repositorio** – `app/Repositories/Contracts/MetaRepositoryInterface.php` con `all()`, `create(array $datos)`, `update(Meta $meta, array $datos)`, `delete(Meta $meta)` y lo que el recurso necesite.
4. **Repositorio** – `app/Repositories/MetaRepository.php` que implementa la interfaz usando Eloquent.
5. **Enlace** – en `app/Providers/AppServiceProvider.php`, dentro de `register()`: `$this->app->bind(MetaRepositoryInterface::class, MetaRepository::class);`
6. **Servicio** – `app/Services/MetaService.php` con métodos en español (`listar`, `crear`, `actualizar`, `eliminar`) y la lógica de negocio (por ejemplo, marcar la meta como `cumplida` cuando los abonos llegan al precio).
7. **Form Requests** – `MetaStoreRequest` (campos `required`) y `MetaUpdateRequest` (`sometimes|required`, y `Rule::unique(...)->ignore(...)` si aplica). `authorize()` devuelve `true`.
8. **Controlador** – `app/Http/Controllers/MetasController.php` recibe el servicio por el constructor y responde siempre JSON: `200` al listar/mostrar/actualizar, `201` al crear, `204` al eliminar.
9. **Ruta** – `Route::apiResource('metas', MetasController::class);` en `routes/api.php`. Rutas anidadas, como `POST /api/metas/{meta}/abonos`, con su propio controlador.
10. **Migrar** – `./vendor/bin/sail artisan migrate`.
11. **Postman** – agregar las peticiones a `postman/alcanza-api.postman_collection.json` (variables `{{host}}` y `{{base_url}}`, encabezado `Accept: application/json`, y un `pm.test` que verifique el código de respuesta de cada una).

## Tablas de Alcanza (documento de la idea, sección 10)

| Tabla | Columnas |
|---|---|
| `perfiles` | `nombre`, `ahorro_mensual` |
| `metas` | `perfil_id`, `producto_id`, `nombre_producto`, `imagen`, `precio`, `moneda`, `descuento`, `fecha_estimada`, `estado` (`en_progreso` / `cumplida`) |
| `abonos` | `meta_id`, `monto`, `fecha` |

## Reglas

- Comentarios y nombres en español, con PHPDoc en servicios y repositorios (requisito de documentación).
- Las excepciones de `api/*` se responden como JSON (ya configurado en `bootstrap/app.php`).
- Al terminar, el agente `tester-api` (o la skill `verificar-proyecto`) corre la colección con Newman.
- Proponer el plan al usuario antes de crear archivos.
