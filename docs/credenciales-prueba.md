# Cuentas de prueba por rol (solo local y staging)

El seed (`npx prisma migrate dev` o `npx prisma db seed`) crea una cuenta por rol
cuando `.env` tiene las claves. **Las claves nunca se versionan**: se definen en
`.env` (local) o en las variables del servicio de staging.

| Código | Rol | Correo | Clave |
|---|---|---|---|
| A01 | `administrador` | `admin@circadiano.local` (o `SEED_ADMIN_CORREO`) | `SEED_ADMIN_CLAVE` |
| J01 | `jefe_operaciones` | `jefe@circadiano.local` | `SEED_DEMO_CLAVE` |
| D01 | `despachador` | `despachador@circadiano.local` | `SEED_DEMO_CLAVE` |
| T01–T05 | `trabajador` | `trabajador1@circadiano.local` … `trabajador5@circadiano.local` | `SEED_DEMO_CLAVE` |

- Los códigos no usan el prefijo `P` para no mover la numeración de los participantes reales (P01–P17).
- Son 5 trabajadores para alcanzar k = 5 (RN10) al probar el panel y la exportación.
- Todos tienen consentimiento (RN11).
- **Nunca definir `SEED_DEMO_CLAVE` en producción.** La imagen Docker usa `NODE_ENV=production` también en staging, así que la variable es la única llave. Mínimo 12 caracteres.

## Staging (Render)

1. En el servicio de la API, *Environment* > agregar `SEED_DEMO_CLAVE` con una clave generada (ver abajo) y, si no existe aún el administrador, `SEED_ADMIN_CLAVE`.
2. Guardar y redesplegar: el contenedor ejecuta `prisma db seed` al arrancar y crea las cuentas.
3. Compartir la clave con el equipo por un canal privado, no en el repo ni en la PR.
4. Tras la producción, borrar las cuentas `J01`, `D01`, `T01`–`T05` y quitar la variable.
- El seed es idempotente: no duplica ni cambia la clave de una cuenta existente. Para cambiarla, borra el usuario y vuelve a sembrar.

Generar una clave: `node -e "console.log('Demo-'+require('crypto').randomBytes(9).toString('base64url'))"`

## Permisos esperados (verificados contra la API)

`✓` = pasa el guard de rol (puede responder 200, o 400/404/409 por datos o parámetros) · `403` = rol sin acceso · sin token = 401.

| Ruta | trabajador | jefe_operaciones | despachador | administrador |
|---|---|---|---|---|
| `GET /me`, `DELETE /me`, `GET /operaciones/rutas`, `GET /operaciones/turnos/me` | ✓ | ✓ | ✓ | ✓ |
| `GET/POST/PATCH/DELETE /operaciones/turnos[/:id]`, `POST /operaciones/turnos/importar` | 403 | ✓ | ✓ | ✓ |
| `PATCH /operaciones/turnos/:id/confirmacion` | ✓ | 403 | 403 | 403 |
| `/bebidas`, `/cafeina/*`, `/push/*`, `/notificaciones/*`, `/diario`, `/sync/lote`, `/historial/me`, `/planes`, `/ubicacion`, `/eventos-solares`, `/cronotipo` | ✓ | 403 | 403 | 403 |
| `POST /aptitud/:idTurno` | ✓ | 403 | 403 | 403 |
| `GET /aptitud/despacho` (solo color y si `compartido`) | 403 | 403 | ✓ | 403 |
| `GET /indicadores/panel` (k ≥ 5) | 403 | ✓ | 403 | 403 |
| `/admin/usuarios`, `/admin/parametros`, `GET /admin/export/indicadores.csv` (k ≥ 5) | 403 | 403 | 403 | ✓ |
