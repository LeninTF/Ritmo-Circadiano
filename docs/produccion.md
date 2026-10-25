# Despliegue a produccion (dom 22 nov 2026)

Plan para pasar de staging a produccion. **Nada de esto se ejecuta sin el visto bueno del equipo**: cada paso marcado con 👤 lo hace una persona con acceso a las cuentas.

## Calendario

| Fecha | Hito |
|---|---|
| mie 18 nov | Code freeze: solo `hotfix/*` a `main` desde aqui |
| jue 19 nov | PR `develop` → `main` (release `v1.0.0`), CI verde, revision de los 5 integrantes |
| vie 20 nov | Ensayo: restaurar el respaldo de staging en una rama de Neon y desplegar ahi (ver "Ensayo") |
| dom 22 nov | Despliegue, smoke test (`docs/smoke-test-piloto.md`) y aviso a los participantes |

## Arquitectura de produccion

Igual que staging (`docs/staging-piloto.md`), con servicios separados:

| Pieza | Staging | Produccion |
|---|---|---|
| API | Render, rama `develop` | Render, servicio nuevo, rama **`main`**, auto-deploy encendido |
| PWA | Cloudflare `ritmo-circadiano-pwa`, rama `develop` | Mismo proyecto con rama de produccion **`main`**, o proyecto nuevo con dominio propio |
| BD | Neon rama `staging` | Neon rama **`production`** (reservada) |

El "workflow desde `main`" es el auto-deploy de Render y Cloudflare sobre `main`. El CI (`ci.yml`) ya corre en cada push a `main`. No hace falta un workflow de deploy aparte, y asi no hay credenciales de Render ni de Cloudflare en GitHub.

## Secretos (👤, solo en el panel de cada servicio)

Generar valores **nuevos**: no reutilizar los de staging.

| Variable | Valor |
|---|---|
| `DATABASE_URL` | Cadena de la rama `production` de Neon con `sslmode=verify-full` |
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRA` | `8h` |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | `npx web-push generate-vapid-keys` (las suscripciones de staging no sirven en produccion) |
| `CORS_ORIGIN` | URL exacta de la PWA de produccion |
| `SWAGGER_HABILITADO` | **No definir** (cierra `/docs` y `/docs-json`) |
| `SEED_ADMIN_CORREO` / `SEED_ADMIN_CLAVE` | Solo para el primer arranque; borrar `SEED_ADMIN_CLAVE` despues |
| PWA: `API_URL`, `NODE_VERSION=24.15.0` | URL de la API de produccion |

Ademas, en la PWA: agregar la URL de la API de produccion a `connect-src` en `apps/pwa/public/_headers` (PR antes del freeze), y con dominio propio fijar *Minimum TLS Version 1.2* en Cloudflare (`docs/seguridad-rnf04.md`, control 2).

## Migraciones

- La API corre `prisma migrate deploy` y el seed (idempotente) al arrancar (`apps/api/Dockerfile`).
- Antes del despliegue: `npx prisma migrate status` contra la rama `production` (👤) y revisar que todas las migraciones sean aditivas. Si alguna borra o renombra columnas, se para y se discute.

## Paso a paso del dia (👤)

1. **Respaldo previo:** `bash scripts/backup-bd.sh` contra `production` (si ya tiene datos) y anotar la hora para el *restore* de Neon.
2. Fusionar el PR de release a `main` y crear la etiqueta `v1.0.0`.
3. Esperar el deploy de Render (logs: `migrate deploy` sin errores, `/health` = 200).
4. Esperar el deploy de Cloudflare.
5. Smoke test con una cuenta de prueba en produccion; borrarla despues con `DELETE /me`.
6. Verificar: `/docs` → 404; un origen ajeno sin cabeceras CORS; `audit_log` registra el login.
7. Activar los monitores de UptimeRobot de produccion (`docs/backups-monitoreo.md`).

## Rollback

| Que fallo | Accion |
|---|---|
| API | Render > *Deploys* > despliegue anterior > *Rollback*. La migracion nueva queda aplicada; como todas son aditivas, la version anterior sigue funcionando. |
| PWA | Cloudflare > *Deployments* > promover el anterior. El service worker toma la version anterior en la siguiente carga. |
| Datos | Neon *restore* a la hora anotada en el paso 1, en una **rama nueva**; cambiar `DATABASE_URL` en Render. Ultimo recurso: `scripts/restaurar-bd.sh` en una rama vacia. |
| Seguridad (fuga de secreto) | Rotar `JWT_SECRET` (cierra todas las sesiones) y la clave de Neon; avisar al equipo. |

## Ensayo (vie 20 nov)

1. 👤 Crear en Neon una rama temporal desde `production` y restaurar alli el ultimo respaldo de staging.
2. Apuntar un servicio de Render temporal a esa rama y a `main`.
3. Seguir los pasos 3 a 6 y medir cuanto tarda el rollback de la API.
4. Borrar la rama y el servicio temporales.
