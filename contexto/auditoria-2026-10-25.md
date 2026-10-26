# Auditoría de release — 2026-10-25

Modo: **APLICAR**. Rama `develop` @ `717bfd2`, árbol limpio. El integrante autorizó comentar en Notion, mover a `Hecho` sin verificación en staging y usar `Bloqueado` para los Fallo. Esto es una excepción puntual a CLAUDE.md §11.

## Resumen ejecutivo

- 14 de 16 RF cumplen su criterio de aceptación. **RF10 = Fallo** (I4). **RF15 = Falta** (I5).
- **Nuevo hallazgo:** la suite `api-e2e` (I2) no compila desde 794facb: importa un guard que se eliminó. CI no ejecuta e2e (`.github/workflows/ci.yml:39`), por eso pasó desapercibido.
- Unit tests 597/597 en verde. pwa-e2e (Playwright) 2/2 en verde, incluido el caso offline. Build de API y PWA OK. `prisma validate` OK. Las 12 migraciones se aplican sobre una BD limpia.
- Notion: 30 tarjetas movidas a `Hecho`, 2 a `Bloqueado` y 6 comentarios de auditoría. 0 errores.

## 1. Módulos y dueños

`git shortlog` no sirve para identificar al dueño: los PR se fusionan con squash y el autor que queda suele ser quien fusiona. Por ejemplo, los commits `feat(i4)` e422919…772ced7 tienen como autor a I1. Por eso el dueño sale de **CLAUDE.md §4 y de la etiqueta de slice del commit**. Con el mapa corregido (I4/I5), la etiqueta coincide con el autor en los commits no fusionados por I1: d430ec9/3ec643d → I5, 2428b9b → I3, 0a90539 → I2. Un autor de commit (d27ca66, `i4`) no aparece en el mapa; se asignó por su etiqueta.

| Módulo | Carpetas | Dueño |
|---|---|---|
| Plataforma | `modulos/plataforma`, `paginas/{plataforma,admin-parametros}`, `auth/` | I1 |
| Operaciones | `modulos/{operaciones,indicadores}`, `paginas/{turnos,indicadores}`, `apps/api-e2e` | I2 |
| Circadiano | `modulos/circadiano`, `paginas/{plan,circadiano}`, `libs/domain/src/{solar,circadiano,rmeq}.ts` | I3 |
| Cafeína/Push/Shell | `modulos/{cafeina,notificaciones}`, `paginas/cafeina`, `app.*`, `apps/pwa-e2e` | I4 |
| Trabajador/Offline | `modulos/{trabajador,aptitud,sync}`, `paginas/{diario,aptitud,despacho}`, `core/offline` | I5 |

## 2–4. Matriz de requerimientos y diagnóstico

| RF | Criterio (resumen) | Estado | Dueño | Evidencia |
|---|---|---|---|---|
| RF01 | Registro solo con consentimiento | Hecho | I1 | `apps/api/src/modulos/plataforma/auth/registro.service.ts:25`; 07fb446 |
| RF02 | Rol incorrecto → 403 | Hecho | I1 | `apps/api/src/app.module.ts:41-43`; 3083da0 |
| RF03 | rMEQ 4–25 + RN07 | Hecho | I3 | `libs/domain/src/rmeq.ts`; 2428b9b |
| RF04 | Registrar/importar rol semanal | Hecho | I2 | `operaciones.controller.ts:78,126`; 0a90539 (unit OK; el e2e está roto, ver deuda #1) |
| RF05 | Notificar y confirmar/corregir turno | Hecho (parte I5) | I5 | `operaciones.controller.ts:100`, `turno-asignado-notificacion.listener.ts:14`. La entrega push depende de RF10 |
| RF06 | Solar ≤ 2 min; sede manual sin permiso | Hecho | I3 | `solar.spec.ts:56`, `paginas/plan/geo.service.ts:16` |
| RF07 | Plan RN05/06/08 en ≤ 200 ms | Hecho | I3 | `libs/domain/src/circadiano.spec.ts:183-188` |
| RF08 | Registrar cafeína, también offline | Hecho | I4 | `apps/pwa-e2e/src/flujo-cafeina.spec.ts:30,58` (Playwright 2/2) |
| RF09 | Residual RN04 + alerta RN02 | Hecho | I4 | `cafeina.service.ts:190` |
| RF10 | Notificación a la hora programada | **Fallo** | I4 | `notificaciones.service.ts:95-118` + PWA sin push |
| RF11 | Un registro por fecha | Hecho | I5 | `prisma/schema/i5-trabajador.prisma:29` |
| RF12 | Semáforo RN09 con consentimiento | Hecho | I5 | `aptitud.service.ts:55,90` |
| RF13 | Panel agregado k ≥ 5 | Hecho | I2 | `indicadores.service.ts` (`assertKAnonymity`) |
| RF14 | Advertencia y confirmación ante RN01 | Hecho | I2 | `paginas/turnos/turnos.component.ts:205` |
| RF15 | Historial 7/14/30 días | **Falta** | I5 | No hay ruta `/historial` en `apps/api` ni en `apps/pwa` |
| RF16 | CSV seudonimizado sin PII | Hecho | I1 | `exportacion.service.spec.ts:29` (CP-16) |

**RF10:**
- Los recordatorios están codificados a las 08/11/14/17 h **UTC** (`notificaciones.service.ts:109-118`) y no usan `derivarRecordatorios(plan)`.
- El servicio escucha `circadiano.plan.generado` (`:95`), pero ningún módulo emite ese evento.
- La PWA no tiene suscripción push ni handlers en el Service Worker.

## 3. Verificación técnica

| Proyecto | typecheck | lint | test | build | e2e |
|---|---|---|---|---|---|
| api | OK | OK (8 warnings) | 240/240 | OK | — |
| pwa | OK | OK (30 warnings) | 199/199 | OK (presupuesto SCSS) | — |
| domain | OK | OK | 156/156 | n/a | — |
| contracts | OK | OK | 2/2 | n/a | — |
| pwa-e2e | OK tras `npm ci` | OK | — | — | **2/2 OK** (40 s, Pixel 7) |
| api-e2e | — | OK (2 warnings) | — | — | **FALLA**: TS2307 en `apps/api-e2e/src/turno.e2e-spec.ts:7`, 0 tests |
| prisma | `validate` OK; `migrate deploy` 12/12 + seed OK | | | | |

Pasos de entorno ejecutados:
1. `npm ci`.
2. Creado `.env` desde `.env.example`, con `JWT_SECRET` aleatorio. Está en gitignore y no se versiona.
3. `POSTGRES_PORT=5433`: en el 5432 de este equipo hay dos procesos escuchando (contenedor y un PostgreSQL local). Es la vía que documenta `.env.example`.
4. `docker compose up -d`, `prisma migrate deploy`, `prisma db seed`, `playwright install chromium`.

## Deuda técnica transversal

| # | Tema | Evidencia | Dueño |
|---|---|---|---|
| 1 | api-e2e no compila: importa `api/common/guards/roles.guard`, eliminado en 794facb. Además, CI no ejecuta e2e | `apps/api-e2e/src/turno.e2e-spec.ts:7`; `.github/workflows/ci.yml:39` | I2 (añadir e2e a CI: I1) |
| 2 | RF10: recordatorios fijos en UTC, no derivados del plan; evento no emitido | `notificaciones.service.ts:95-118` | I4 (emisión del evento: I3) |
| 3 | Dos rutas de sincronización de ingestas (`/cafeina/sync/lote` además de la genérica `/sync/lote`) | `cafeina.controller.ts:85` | I4 |
| 4 | Dosis literal de 100 mg en el cálculo de la hora de corte (OCP) | `cafeina.service.ts:192` | I4 |
| 5 | Aviso de turno también cuando el trabajador corrige (`shortcut` documentado) | `turno-asignado-notificacion.listener.ts:13` | I5 |
| 6 | Offline e2e: solo cubre cafeína (falta modo avión con cola de 20 y diario) | `apps/pwa-e2e/src/` | I5 |
| 7 | SCSS de `proximo-turno` 6.15 kB frente a un presupuesto de 4 kB | `pwa:build:production` | I5 |
| 8 | 40 warnings `no-explicit-any` / non-null en el slice de turnos | `operaciones.service.ts`, `paginas/turnos/*.ts` | I2 |
| 9 | RNF01: no hay Lighthouse CI ni k6 | `.github/workflows/` | I3 |
| 10 | La UI de RF09 no muestra la "alternativa sin cafeína" | `paginas/cafeina/cafeina.service.ts:126-127` | I4 |

## 5–6. Operaciones Notion aplicadas

Propiedad `Estado Kanban` (select). Mapeo: Hecho → `Hecho`; Fallo → `Bloqueado` (por indicación del integrante, porque no existe PR); Falta → `Por Hacer`. Los comentarios previos se leyeron antes de escribir: ninguna tarjeta tenía comentarios `[Auditoría 2026-10-25]`. No hizo falta crear tarjetas `[GAP]`.

| Acción | Tarjeta | Antes → Después | Resultado |
|---|---|---|---|
| mover | 3fb895159b6981f19816c9aa60b72514 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981c9a326d2c58eedb115 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69814a8837f43efce0779e | En Proceso → Hecho | OK |
| mover | 3fb895159b698165bb31e5638cd73f96 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69813fbd7ce7704d104292 | En Proceso → Hecho | OK |
| mover | 3fb895159b6981889a8df7abd9099f32 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69810fbe55cd5d93803622 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981b1aebbf69c2af21106 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981568d78f4f5b0ee83aa | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981ab9925d5937dfdc38d | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981058eecdf38a4f63248 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69811a8265fc3ddd1a73b0 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981a58b20cc7557bb66f3 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981bb9159cd7fd1c4394c | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981eb8a2ffc17357ce799 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981f18ffffdf8a216fe72 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69813eb1fde1f9ed86714e | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981669cfddd419dc26159 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b6981dfab7aede3b0f0fa52 | En Revisión PR → Hecho | OK |
| mover | 3fb895159b69819992e8e67ca95fe0e7 | Por Hacer → Hecho | OK |
| mover | 3fb895159b698162b6c8f58cef8f723d | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981b29b2bd49146a32077 | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981cba7dcd7e11ea11a64 | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981c0bb4ec0c669a8bd3d | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981929300e98cbecfe066 | Por Hacer → Hecho | OK |
| mover | 3fb895159b69814fa810e72e812928d1 | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981848a77c380ff5c9127 | Por Hacer → Hecho | OK |
| mover | 3fb895159b69819b9d29e6b3a986d7f4 | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981b6b750eb656fc62252 | Por Hacer → Hecho | OK |
| mover | 3fb895159b6981ceb083de7e8213aaac | Por Hacer → Hecho | OK |
| mover + detalle + comentar | 3fb895159b6981e1b8a9d2fd0eefcdfc (RF10) | Por Hacer → Bloqueado | OK |
| mover + detalle + comentar | 3fb895159b6981bea6aecbd96782331a (I2 e2e) | Hecho → Bloqueado | OK |
| comentar | 3fb895159b6981d28952e7c574315d99 (push SW) | Por Hacer → Por Hacer | OK |
| comentar | 3fb895159b6981c4a743d38490d6936f (RF15 API) | Por Hacer → Por Hacer | OK |
| comentar | 3fb895159b698169a459c5cda5afa0f6 (RF15 UI) | Por Hacer → Por Hacer | OK |
| comentar | 3fb895159b698186a5bccd26bc8b5db2 (RNF01) | Por Hacer → Por Hacer | OK |

Conteo verificado después de escribir: I1 15 Hecho / 2 En Revisión PR · I2 13 Hecho / 1 Bloqueado · I3 14 Hecho / 4 Por Hacer · I4 11 Hecho / 1 Bloqueado / 5 Por Hacer · I5 12 Hecho / 3 Por Hacer.

## Pendientes manuales

1. **Sin mover por falta de evidencia:** RF09 UI (`3fb895159b69810c8bb3cc6cfd86b956`, falta la alternativa sin cafeína), despliegue a producción (`…a2b24ce0ef6e4336b1`, previsto para el 22 nov) y smoke test del piloto (`…fdaa73d6c67a6157cd`, la etiqueta no se verificó).
2. **Tarjetas I3 en `Por Hacer` sin diagnóstico:** ajustes post-piloto, corrección de errores, y cobertura + changelog. No verificado.
3. **Fila sin título** `401895159b69801892f3d4111a00f6da`: revisar o archivar a mano.
4. **Backlog:** las 31 filas siguen con `Estado = Por Hacer` (no se tocaron, §11).
5. **Staging:** las 30 tarjetas pasaron a `Hecho` sin verificación en staging, por autorización del integrante.
6. **Entorno local modificado:** `.env` nuevo y el contenedor `db` publicado en el puerto 5433. Para volver al 5432, borrar `POSTGRES_PORT` del `.env` y ejecutar `docker compose up -d`.
