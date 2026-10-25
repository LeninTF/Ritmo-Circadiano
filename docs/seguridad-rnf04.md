# Checklist de seguridad RNF04

Revision del 23 oct 2026 sobre `develop` (0dcf816) y staging. Cada fila dice como se verifico. Los hallazgos de otros slices van en PRs aparte para que los revise su dueno.

## Resultado

| # | Control | Estado | Evidencia |
|---|---|---|---|
| 1 | TLS >= 1.2 en la API | OK | `openssl s_client -tls1_1` contra `ritmo-circadiano.onrender.com` → alerta `protocol version`; TLS 1.2 acepta. HTTP → 301 a HTTPS. |
| 2 | TLS >= 1.2 en la PWA | **Falla (hosting)** | `*.workers.dev` negocia TLS 1.0/1.1 y no se puede configurar. Solucion: dominio propio en Cloudflare con *Minimum TLS Version = 1.2* (paso humano, tarjeta 14). La PWA no tiene datos: la informacion viaja a la API, que si exige 1.2. |
| 3 | JWT <= 24 h, vencido → 401 | OK | `validarEntorno` rechaza `JWT_EXPIRA` > 24 h al arrancar; refresh de 24 h. Test `auth.e2e.spec.ts` "token vencido -> 401" y "firma ajena -> 401". |
| 4 | Contrasenas con Argon2 | OK | `argon2.hash()` (por defecto Argon2id) en `registro.service.ts`; login con tiempo constante (hash falso para correos inexistentes). |
| 5 | Toda ruta con token, 403 por rol | **Falla → corregido en PR** | `JwtAuthGuard` y `RolesGuard` son globales; las publicas son explicitas (`@Publica`: registro, login, refresh, areas, health). Sin embargo:<br>• I2: turnos sin `@Roles`; `/turnos/me` aceptaba `idUsuario`/`x-usuario-id` → **#50**.<br>• I2: `/indicadores/panel` usaba un guard propio que leia `req.user` → 403 incluso al jefe → **#50**.<br>• I4: cafeina y push tomaban `id_usuario` de la query/cuerpo; borrado sin dueno → **#51**. |
| 6 | Acciones sensibles en `audit_log` | OK con #46/#48/#49 | Login, turno forzado (#46), borrado de cuenta y cambios de usuario (#48), parametros (#49). Exportacion: tarjeta 16. Verificado con Postgres real. |
| 7 | Limite de peticiones | OK con #46 | Global 100/min; registro 5/min, login 10/min, refresh 20/min por IP; `trust proxy` para la IP real detras de Render. |
| 8 | Cabeceras HTTP | OK (API) / con #46 (PWA) | API: `helmet()`. PWA: `_headers` con HSTS, CSP, nosniff, Referrer-Policy y Permissions-Policy. |
| 9 | CORS restringido | OK | Solo `CORS_ORIGIN`; otro origen no recibe `Access-Control-Allow-Origin` (verificado en staging, runbook). |
| 10 | Validacion de entrada | Parcial | `ValidationPipe` global con `whitelist` + `forbidNonWhitelisted`. **I4:** `CrearIngestaCafeinaDto` es una interfaz y no se valida (anotado en #51). |
| 11 | Sin PII en logs | OK con nota | Solo hay logs de arranque y de errores de push. El error de push incluye el `endpoint` (URL de suscripcion, sin nombre ni correo); conviene quitarlo (I4). |
| 12 | Secretos fuera del repo | OK | `.env` en `.gitignore`; jobs `secretos` (gitleaks) y GitGuardian en verde; tests generan secretos con `randomBytes`. |
| 13 | Swagger expuesto | Pendiente (tarjeta 14) | `/docs` abierto en staging, aceptable para el piloto; cerrar en produccion. |
| 14 | Revocar un refresh token | Brecha ERD | No hay tabla de sesiones; propuesto en #46. Mitigacion: cambiar estado a `retirado` corta el siguiente refresh. |

## Como repetir la revision

```bash
# TLS (Git Bash trae openssl)
echo | openssl s_client -connect ritmo-circadiano.onrender.com:443 -tls1_1 -cipher 'DEFAULT@SECLEVEL=0'
# Rutas sin @Roles: revisar cada controller que reciba un id de usuario por query o cuerpo
grep -rnE "@Query\('id_?[uU]suario'|x-usuario-id|id_usuario" apps/api/src --include=*.controller.ts
# Tests de guards
npx nx test api --testPathPatterns="e2e"
```
