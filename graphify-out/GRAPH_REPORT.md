# Graph Report - Ritmo-Circadiano  (2026-10-26)

## Corpus Check
- 328 files · ~164,700 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 2284 nodes · 4793 edges · 158 communities (112 shown, 46 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7733b2d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- modulos/indicadores/indicadores.service.ts
- Auditoría de release — 2026-10-25
- rmeq.ts
- RegistroService
- api/src/main.ts
- dependencies
- compilerOptions
- nx.json
- 6. Historias de usuario y criterios de aceptación
- scripts
- @nx/jest
- eslint.config.mjs
- engines
- constantes.ts
- domain/project.json
- compilerOptions
- compilerOptions
- contracts/project.json
- @angular/core
- CafeinaService
- Checklist de seguridad RNF04
- notificaciones.service.ts
- operaciones.service.ts
- compilerOptions
- development
- api-e2e/project.json
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- TurnosComponent
- compilerOptions
- copy-workspace-modules
- typecheck
- pwa/tsconfig.json
- prisma-generate
- @angular/core
- serve
- pwa/project.json
- api/project.json
- targets
- compilerOptions
- prune-lockfile
- registro-sueno-contrato.spec.ts
- sync-lote.dto.ts
- options
- api-e2e/tsconfig.json
- options
- production
- @angular/router
- ngsw-config.json
- AuthController
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- CrearTurnoDto
- circadiano.spec.ts
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- trabajador.module.ts
- plan-hoy.component.ts
- @nestjs/common
- 2. Usuarios
- cafeina.ts
- Auditable
- compilerOptions
- aptitud.component.ts
- UsuariosService
- domain/tsconfig.lib.json
- compilerOptions
- targets
- ConsultarEventosSolaresDto
- pwa/tsconfig.app.json
- contracts/tsconfig.lib.json
- pull_request_template.md
- test
- solar.ts
- typecheck
- circadiano.ts
- CrearIngestaCafeinaBodyDto
- modulos/aptitud/aptitud.service.ts
- test
- salud.controller.ts
- configurations
- paginas/cafeina/cafeina.service.ts
- ConsultarResumenCafeinaDto
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- sync.module.ts
- diario/diario.service.ts
- CrearUbicacionDto
- RefrescarTokenDto
- App
- CrearPerfilCronotipoDto
- OutboxService
- UsuariosAdminController
- .registrarIngesta
- pwa-e2e/project.json
- optimization
- README.md
- PrismaService
- TurnosService
- UsuarioJwtPayload
- ProximoTurnoComponent
- MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)
- indicadores.component.ts
- SPEC.md — Slice 01: Cuenta + Registro de cafeína
- DiarioController
- .crearAptitud
- ingesta-sync.handler.ts
- offline/offline-store.service.ts
- PRODUCT.md — CircaRuta
- contracts/src/index.ts
- trabajador.module.ts
- 1. Respaldos
- sync-queue.ts
- ngsw-config.spec.ts
- lww-policy.ts
- AuthService
- Plan: Sistema de diseño del Figma en la PWA
- ActualizarUsuarioAdminDto
- contracts/tsconfig.spec.json
- Despliegue a produccion (dom 22 nov 2026)
- CafeinaController
- plan.ts
- exportacion.service.ts
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- PlanHoyComponent
- PlanDiarioDto
- Smoke test del piloto (v0.9.0-piloto)
- entorno.ts
- pwa-e2e/tsconfig.json
- entorno.ts
- AreaDto
- RegistroDto
- app.module.ts
- @playwright/test
- dotenv
- LoginDto
- IConnectivityProvider
- proximo-turno.models.ts
- RefrescarTokenDto
- 6. Restricciones
- IndicadoresComponent

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 92 edges
2. `@angular/core` - 75 edges
3. `PrismaService` - 67 edges
4. `UsuarioJwtPayload` - 42 edges
5. `OfflineStoreService` - 40 edges
6. `@angular/common` - 40 edges
7. `Roles()` - 34 edges
8. `UsuarioActual` - 33 edges
9. `@nestjs/swagger` - 32 edges
10. `@angular/router` - 29 edges

## Surprising Connections (you probably didn't know these)
- `7. Offline (RNF03)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts
- `10. Flujo Git y validación pre-PR` --references--> `main()`  [INFERRED]
  CLAUDE.md → prisma/seed.ts
- `Resultado` --references--> `validarEntorno()`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/config/entorno.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (158 total, 46 thin omitted)

### Community 0 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.10
Nodes (8): IndicadoresController, AdherenciaRow, CafeinaRow, DescansoRow, IndicadoresPanelData, IndicadoresService, UniqueUserRow, RespuestaAgregada

### Community 1 - "Auditoría de release — 2026-10-25"
Cohesion: 0.17
Nodes (10): 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), 1. Módulos y dueños, 2–4. Matriz de requerimientos y diagnóstico, 3. Verificación técnica, 5–6. Operaciones Notion aplicadas, Auditoría de release — 2026-10-25, Deuda técnica transversal, Pendientes manuales (+2 more)

### Community 2 - "rmeq.ts"
Cohesion: 0.23
Nodes (6): Pregunta, RmeqComponent, RespuestasRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

### Community 4 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/platform-express

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+24 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 7 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "6. Historias de usuario y criterios de aceptación"
Cohesion: 0.33
Nodes (6): 6. Historias de usuario y criterios de aceptación, HU-01 · Crear cuenta (I1, existente), HU-02 · Iniciar y cerrar sesión (I1, existente), HU-03 · Registrar consumo (`/cafeina/nuevo`), HU-04 · Ver mi consumo (`/cafeina`, pestaña Cafeína), HU-05 · Eliminar un registro

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.18
Nodes (21): CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO, HORA_INICIO_NOCTURNO (+13 more)

### Community 14 - "domain/project.json"
Cohesion: 0.11
Nodes (18): name, commands, jestConfig, parallel, projectType, $schema, sourceRoot, tags (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 16 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 17 - "contracts/project.json"
Cohesion: 0.09
Nodes (22): executor, options, name, command, commands, jestConfig, parallel, projectType (+14 more)

### Community 18 - "@angular/core"
Cohesion: 0.12
Nodes (9): GuiaInstalacionIosComponent, AnfitrionComponent, PushService, ResultadoSuscripcion, RUTA_POR_TIPO, AVISO_PUSH, PlanComponent, @angular/core (+1 more)

### Community 22 - "notificaciones.service.ts"
Cohesion: 0.14
Nodes (6): NotificacionesModule, NotificacionesService, TurnoAsignadoNotificacionListener, PlanGeneradoEvento, @nestjs/schedule, web-push

### Community 23 - "operaciones.service.ts"
Cohesion: 0.33
Nodes (7): detectarTurnoNocturno(), horaLima(), ValidacionDescansoResultado, ValidacionJornadaInput, ValidacionJornadaResultado, validarDescansoMinimo(), validarJornadaRN01()

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.14
Nodes (13): Estado, 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack (+5 more)

### Community 29 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 30 - "copy-workspace-modules"
Cohesion: 0.25
Nodes (8): cache, dependsOn, executor, options, outputs, buildTarget, options, copy-workspace-modules

### Community 31 - "typecheck"
Cohesion: 0.25
Nodes (8): commands, parallel, typecheck, cache, dependsOn, executor, inputs, options

### Community 32 - "pwa/tsconfig.json"
Cohesion: 0.12
Nodes (16): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compilerOptions, emitDecoratorMetadata, isolatedModules (+8 more)

### Community 33 - "prisma-generate"
Cohesion: 0.29
Nodes (7): command, cache, executor, inputs, options, outputs, prisma-generate

### Community 34 - "@angular/core"
Cohesion: 0.07
Nodes (23): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, AuthService, decodificarJwt(), estaVigente() (+15 more)

### Community 35 - "serve"
Cohesion: 0.29
Nodes (7): runBuildTargetDependencies, continuous, defaultConfiguration, dependsOn, executor, options, serve

### Community 36 - "pwa/project.json"
Cohesion: 0.29
Nodes (6): name, prefix, projectType, $schema, sourceRoot, tags

### Community 37 - "api/project.json"
Cohesion: 0.33
Nodes (5): name, projectType, $schema, sourceRoot, tags

### Community 38 - "targets"
Cohesion: 0.33
Nodes (6): dependsOn, dependsOn, executor, targets, build, prune

### Community 39 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 40 - "prune-lockfile"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 41 - "registro-sueno-contrato.spec.ts"
Cohesion: 0.29
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 42 - "sync-lote.dto.ts"
Cohesion: 0.16
Nodes (9): SyncEstadoOperacion, syncLoteDesdeWire(), SyncLoteResultadoWireDto, SyncLoteWireDto, syncOperacionDesdeWire(), SyncOperacionWireDto, syncResultadoAFormaWire(), SyncResultadoOperacionDto (+1 more)

### Community 44 - "options"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 45 - "api-e2e/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 46 - "options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 47 - "production"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 48 - "@angular/router"
Cohesion: 0.10
Nodes (17): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+9 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "CrearTurnoDto"
Cohesion: 0.06
Nodes (7): ActualizarTurnoDto, ConfirmarTurnoDto, CrearTurnoDto, OperacionesController, EstadoVistaTurno, ConfirmacionTurnoPayload, EstadoConfirmacionContrato

### Community 56 - "circadiano.spec.ts"
Cohesion: 0.17
Nodes (8): ConfiguracionMotor, ParametrosTurno, CFG, SOLAR_ICA, TURNO_DIURNO, TURNO_NOCTURNO, VERSION_ALGORITMO_PLAN, fast-check

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.10
Nodes (4): NotificacionesController, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.14
Nodes (7): OfflineStoreService, Diario, EventoSolar, Ingesta, Outbox, Plan, Turno

### Community 60 - "devDependencies"
Cohesion: 0.03
Nodes (58): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+50 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (55): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+47 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.11
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "trabajador.module.ts"
Cohesion: 0.10
Nodes (9): DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, aRespuesta(), PrismaDiarioRepository, ConsultaDiarioFiltroDto, CrearActualizarDiarioDto (+1 more)

### Community 65 - "plan-hoy.component.ts"
Cohesion: 0.11
Nodes (10): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra, tipoDeHora() (+2 more)

### Community 66 - "@nestjs/common"
Cohesion: 0.10
Nodes (12): MockDelegado, CronotipoService, TurnoParaPlan, TurnoAsignadoListener, UbicacionService, UsuarioEliminadoCircadianoListener, OperacionesService, ParametrosService (+4 more)

### Community 67 - "2. Usuarios"
Cohesion: 0.67
Nodes (3): 2. Usuarios, Usuario principal: conductor (rol `trabajador`), Usuarios secundarios

### Community 68 - "cafeina.ts"
Cohesion: 0.16
Nodes (23): 4. Vertical slices (dueños de código), CafeinaActiva, calcularCafeinaActiva(), calcularHoraCorte(), ConsumoDia, IngestaCafeina, residual(), resolverSemivida() (+15 more)

### Community 69 - "Auditable"
Cohesion: 0.22
Nodes (4): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "aptitud.component.ts"
Cohesion: 0.07
Nodes (22): ESTILOS_FORMULARIO, CARGOS, MENSAJES, RANGOS_EDAD, SEXOS, ESTADOS, SemaforoAptitudComponent, AnfitrionComponent (+14 more)

### Community 73 - "domain/tsconfig.lib.json"
Cohesion: 0.22
Nodes (8): compilerOptions, declaration, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 74 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 75 - "targets"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 77 - "pwa/tsconfig.app.json"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 78 - "contracts/tsconfig.lib.json"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, extends, include, ./tsconfig.json

### Community 79 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist de Verificación y Calidad, Descripción, Notas Adicionales / Evidencias, Tipo de Cambio

### Community 80 - "test"
Cohesion: 0.29
Nodes (7): jestConfig, passWithNoTests, test, dependsOn, executor, options, outputs

### Community 81 - "solar.ts"
Cohesion: 0.24
Nodes (6): calcularPlanLocal(), DESFASE_LIMA_H, calcularEventosSolares(), EventosSolares, fechaLima(), suncalc

### Community 82 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 83 - "circadiano.ts"
Cohesion: 0.18
Nodes (19): CategoriaCronotipo, TipoTurnoPlan, addH(), addMin(), aIso(), aPlanDiarioDto(), calcularCorteCafeina(), DELTA_CRONOTIPO_MIN (+11 more)

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.22
Nodes (4): PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.06
Nodes (33): CafeinaComponent, Icono, ICONOS, BEBIDAS, aFechaReciente(), aItemLocal(), CafeinaService, ConsumoItem (+25 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.12
Nodes (18): CONNECTIVITY_PROVIDER_TOKEN, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+10 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "sync.module.ts"
Cohesion: 0.17
Nodes (8): SyncHandlerRegistry, UnknownSyncHandlerError, InvalidSyncBatchError, FakeHandler, SyncOrchestratorService, SyncOperationHandler, SyncLoteDto, SyncLoteResultadoDto

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.17
Nodes (7): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 105 - ".registrarIngesta"
Cohesion: 0.31
Nodes (4): 1. Arquitectura y SOLID, ConsumoDiaDto, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto

### Community 107 - "pwa-e2e/project.json"
Cohesion: 0.14
Nodes (14): executor, options, implicitDependencies, name, command, projectType, $schema, sourceRoot (+6 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "PrismaService"
Cohesion: 0.13
Nodes (5): UsuarioEliminadoCafeinaListener, UsuarioEliminadoOperacionesListener, CAMPOS_ADMIN, USUARIO_ELIMINADO, UsuarioEliminadoEvento

### Community 111 - "TurnosService"
Cohesion: 0.21
Nodes (7): TurnosService, ActualizarTurnoDto, CrearTurnoDto, EliminarTurnoRespuestaDto, ImportarTurnosRespuestaDto, RutaDto, TurnoDto

### Community 112 - "UsuarioJwtPayload"
Cohesion: 0.11
Nodes (22): ConsultaAptitud, USUARIOS, GESTIONAN_TURNOS, tokens, PruebaController, SECRETO, JwtAuthGuard, ES_PUBLICA (+14 more)

### Community 114 - "MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (12): 1. Principios, 2. Referencias y qué tomamos de cada una, 3.1 Tema claro (igual a §14, con dos correcciones de contraste), 3.2 Modo nocturno de bajo brillo **Δ §14**, 3. Color, 4. Tipografía, 5. Espaciado, forma y tamaño táctil, 6. Patrones clave (+4 more)

### Community 116 - "SPEC.md — Slice 01: Cuenta + Registro de cafeína"
Cohesion: 0.18
Nodes (11): 0. Cómo usar este documento, 10. Pruebas, 11. Estado y Definición de terminado, 1. Objetivo, 2. Alcance, 3. Convenciones, 4. Catálogos, 5. Modelo de datos (+3 more)

### Community 119 - ".crearAptitud"
Cohesion: 0.10
Nodes (3): AptitudController, CrearAptitudDto, calcularHorasSuenoEnVentana()

### Community 120 - "ingesta-sync.handler.ts"
Cohesion: 0.22
Nodes (7): IngestaSyncHandler, DiarioSyncHandler, SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncHandlerResult, SyncIdentity, SyncOperacionDto

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.22
Nodes (6): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, dexie, fake-indexeddb

### Community 122 - "PRODUCT.md — CircaRuta"
Cohesion: 0.17
Nodes (12): 1. Propósito, 3. Contexto de uso, 4. Tareas clave (por orden de importancia), 5. Voz y tono, 7. Gestión del proyecto, 8. Evidencia y supuestos, 9. Cómo saber si funciona `[POR CONFIRMAR metas]`, Evidence on Hand (+4 more)

### Community 123 - "contracts/src/index.ts"
Cohesion: 0.20
Nodes (5): GenerarPlanDto, GenerarPlanDto, class-transformer, class-validator, @nestjs/swagger

### Community 124 - "trabajador.module.ts"
Cohesion: 0.13
Nodes (4): SyncController, SyncModule, TrabajadorModule, UsuarioEliminadoTrabajadorListener

### Community 125 - "1. Respaldos"
Cohesion: 0.25
Nodes (7): 1. Respaldos, 2. Monitoreo, 3. Pendientes humanos, Backups y monitoreo del piloto, Prueba de restauracion (una vez por semana), Respaldo diario, Restaurar staging tras un incidente

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 132 - "Plan: Sistema de diseño del Figma en la PWA"
Cohesion: 0.06
Nodes (29): FilaAptitud, AptitudComponent, mensajeError(), ConsultarDespachoRequest, EvaluacionDespacho, IAptitud, MotivoAptitud, ColorSemaforo (+21 more)

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "Despliegue a produccion (dom 22 nov 2026)"
Cohesion: 0.27
Nodes (9): Arquitectura de produccion, Calendario, Despliegue a produccion (dom 22 nov 2026), Ensayo (vie 20 nov), Migraciones, Paso a paso del dia (👤), Rollback, Secretos (👤, solo en el panel de cada servicio) (+1 more)

### Community 137 - "CafeinaController"
Cohesion: 0.16
Nodes (3): CafeinaController, 9. Convenciones de nomenclatura, ResidualCafeinaRespuestaDto

### Community 138 - "plan.ts"
Cohesion: 0.16
Nodes (9): GeoService, CrearUbicacionDto, EVENTO_PLAN_GENERADO, EventoSolarDto, RecordatorioDelPlan, SedeEmpresa, TipoRecordatorioPlan, UbicacionDto (+1 more)

### Community 139 - "exportacion.service.ts"
Cohesion: 0.07
Nodes (16): AreasService, AuthModule, ExportacionController, aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion (+8 more)

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 146 - "PlanDiarioDto"
Cohesion: 0.28
Nodes (5): aFecha(), aIso(), diaIso(), PlanesService, PlanDiarioDto

### Community 150 - "Smoke test del piloto (v0.9.0-piloto)"
Cohesion: 0.22
Nodes (8): 0. Previo, 1. Instalacion, 2. Recorrido (RF01 → RF11), 3. Offline (RNF03), 4. Notificaciones (RF10), 5. Seguridad minima, Resultado y release, Smoke test del piloto (v0.9.0-piloto)

### Community 155 - "entorno.ts"
Cohesion: 0.21
Nodes (5): Entorno, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno()

### Community 158 - "pwa-e2e/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 159 - "entorno.ts"
Cohesion: 0.19
Nodes (10): RefrescoPayload, SECRETO, ParametroEditable, PARAMETROS_EDITABLES, UsuarioDto, CODIGOS_ERROR, ErrorApiDto, argon2 (+2 more)

### Community 166 - "app.module.ts"
Cohesion: 0.12
Nodes (9): AptitudModule, BebidasController, CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, PrismaModule (+1 more)

### Community 171 - "dotenv"
Cohesion: 0.28
Nodes (5): AREAS, sembrarIdentidad(), dotenv, prisma, @prisma/adapter-pg

### Community 174 - "proximo-turno.models.ts"
Cohesion: 0.11
Nodes (16): AdminParametrosComponent, NOMBRE_CATEGORIA, PREGUNTAS_RMEQ, OrigenPlan, planServidor, turno, TURNO, MENSAJE_POR_ESTADO (+8 more)

### Community 177 - "RefrescarTokenDto"
Cohesion: 0.20
Nodes (5): ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, ROLES

### Community 179 - "6. Restricciones"
Cohesion: 0.40
Nodes (5): 6. Restricciones, Accesibilidad, Calendario, Privacidad, Técnicas

## Knowledge Gaps
- **66 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1080 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `paginas/cafeina/cafeina.service.ts`, `plan-hoy.component.ts`, `@angular/core`, `diario/diario.service.ts`, `aptitud.component.ts`, `proximo-turno.models.ts`, `TurnosService`, `@angular/router`, `indicadores.component.ts`, `offline/offline-store.service.ts`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `modulos/indicadores/indicadores.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `entorno.ts` to `modulos/indicadores/indicadores.service.ts`, `sync.module.ts`, `@nestjs/common`, `trabajador.module.ts`, `api/src/main.ts`, `cafeina.ts`, `app.module.ts`, `Auditable`, `exportacion.service.ts`, `PrismaService`, `UsuarioJwtPayload`, `modulos/aptitud/aptitud.service.ts`, `notificaciones.service.ts`, `salud.controller.ts`, `ingesta-sync.handler.ts`, `contracts/src/index.ts`, `trabajador.module.ts`, `package.json`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Why does `Roles()` connect `UsuarioJwtPayload` to `modulos/indicadores/indicadores.service.ts`, `app.module.ts`, `UsuariosAdminController`, `CafeinaController`, `exportacion.service.ts`, `modulos/aptitud/aptitud.service.ts`, `CrearTurnoDto`, `.crearAptitud`, `DiarioController`, `.guardarSuscripcion`, `contracts/src/index.ts`, `trabajador.module.ts`, `parametros.controller.ts`, `CircadianoController`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._