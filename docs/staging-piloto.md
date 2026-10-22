# Staging del piloto

Pasos para publicar la PWA y la API del Gestor Circadiano en un entorno de prueba antes del piloto (lun 26 oct). Las cuentas y las claves las crea una persona del equipo: **no se guardan en el repo**.

## Resumen

| Pieza | Servicio sugerido | Despliegue |
|---|---|---|
| PWA (estatica) | Cloudflare Pages o Netlify | Automatico desde `develop` |
| API (contenedor) | Render o Railway | Automatico desde `develop` con `render.yaml` |
| Base de datos | Neon o Supabase (PostgreSQL 16) | `prisma migrate deploy` al arrancar la API |

La API usa `apps/api/Dockerfile`. Al arrancar corre `prisma migrate deploy` y `prisma db seed` (ambos idempotentes) y luego inicia el servidor. El seed crea las 6 areas, el umbral de cafeina, las rutas y las bebidas base.

## Pasos que requieren una persona (cuentas)

1. **Base de datos.** Crear un proyecto en Neon o Supabase con PostgreSQL 16 y copiar la cadena de conexion (con `sslmode=require`).
2. **API.** En Render: *New > Blueprint*, elegir este repo y la rama `develop` (lee `render.yaml`). Cuando lo pida, escribir:
   - `DATABASE_URL`: la cadena del paso 1.
   - `CORS_ORIGIN`: la URL exacta de la PWA del paso 3 (sin `/` final). Puede dejarse vacia hasta tenerla y editarla despues.
   - `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`: generarlas una vez con `npx web-push generate-vapid-keys`.
   - `JWT_SECRET` lo genera Render solo.
3. **PWA.** En Cloudflare Pages (o Netlify), conectar el repo y la rama `develop`:
   - Comando de build: `sed -i "s#apiUrl: ''#apiUrl: '$API_URL'#" apps/pwa/src/environments/environment.production.ts && npm ci && npx nx build pwa --configuration=production`
   - Directorio de salida: `dist/apps/pwa/browser`
   - Variable `API_URL`: la URL publica de la API del paso 2, sin `/` final.
   - Variable `NODE_VERSION`: `24.15.0`
4. Volver a la API y completar `CORS_ORIGIN` con la URL de la PWA. Redesplegar.
5. **Cuenta de administrador (opcional).** Para crear el usuario `A01`, definir `SEED_ADMIN_CORREO` y `SEED_ADMIN_CLAVE` en Render y redesplegar. Quitar la clave despues de la primera creacion. Sin esa variable no se crea administrador.

## Verificacion (despues del despliegue)

- `GET <API_URL>/health` responde 200.
- `GET <API_URL>/areas` devuelve 6 areas.
- Desde la PWA: `/consentimiento` > `/registro` > se muestra el codigo `P01` > `/ingresar` funciona.
- `GET <API_URL>/docs` muestra Swagger.
- Un origen distinto a `CORS_ORIGIN` no recibe la cabecera `Access-Control-Allow-Origin`.

Verificado ya en desarrollo (Postgres 16 local, API compilada): migraciones, seed repetido sin duplicar, registro, login, `/me`, refresco, 409 por correo repetido y CORS.

## Rollback

- API: en Render, *Deploys* > elegir el despliegue anterior > *Rollback*.
- PWA: en Cloudflare Pages o Netlify, *Deployments* > promover el despliegue anterior.
- Base de datos: las migraciones solo agregan; no se revierten automaticamente. Antes de una migracion destructiva, tomar un snapshot en Neon o Supabase.

## Pendiente conocido

- Los pasos manuales de Android e iOS (instalar la PWA, notificaciones) son de la tarjeta de *smoke test*.
- La imagen conserva `node_modules` completo para poder migrar y sembrar al arrancar; se puede adelgazar mas adelante.
- El `Dockerfile` no se pudo construir en el entorno de desarrollo (sin demonio de Docker): se verifico la compilacion y el arranque con los mismos comandos, pero la primera construccion real ocurrira en Render.
