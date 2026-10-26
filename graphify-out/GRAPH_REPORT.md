# Graph Report - Ritmo-Circadiano  (2026-10-25)

## Corpus Check
- 322 files · ~162,512 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 2260 nodes · 4735 edges · 156 communities (114 shown, 42 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ba038f4`
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
- UsuarioEliminadoOperacionesListener
- BebidasController
- Checklist de seguridad RNF04
- ConsultaDiarioFiltroDto
- rn01.ts
- compilerOptions
- development
- api-e2e/project.json
- @angular/common
- TurnosComponent
- compilerOptions
- copy-workspace-modules
- typecheck
- pwa/tsconfig.json
- prisma-generate
- sesion.service.ts
- serve
- pwa/project.json
- api/project.json
- targets
- compilerOptions
- prune-lockfile
- registro-sueno-contrato.spec.ts
- sync-orchestrator.service.ts
- options
- api-e2e/tsconfig.json
- options
- production
- @angular/router
- ngsw-config.json
- AuthService
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- OperacionesService
- solar.ts
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- trabajador.module.ts
- @angular/core
- planes.service.ts
- 2. Usuarios
- cafeina.ts
- @nestjs/common
- compilerOptions
- aptitud.component.ts
- domain/tsconfig.lib.json
- compilerOptions
- targets
- pwa/tsconfig.app.json
- contracts/tsconfig.lib.json
- pull_request_template.md
- test
- typecheck
- circadiano.ts
- test
- app.module.ts
- configurations
- BebidaDto
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- ingesta-sync.handler.ts
- diario/diario.service.ts
- App
- OutboxService
- paginas/cafeina/cafeina.service.ts
- pwa-e2e/project.json
- optimization
- README.md
- @nestjs/common
- turnos.service.ts
- UsuarioJwtPayload
- ProximoTurnoComponent
- PRODUCT.md — CircaRuta
- indicadores.component.ts
- SPEC.md — Slice 01: Cuenta + Registro de cafeína
- DiarioController
- mi-consumo.component.ts
- domain/src/aptitud.ts
- sync-orchestrator.service.spec.ts
- offline/offline-store.service.ts
- .eliminar
- contracts/src/index.ts
- trabajador.module.ts
- 1. Respaldos
- sync-queue.ts
- ngsw-config.spec.ts
- lww-policy.ts
- CafeinaService
- AptitudComponent
- UsuariosAdminController
- diario-sync.handler.ts
- contracts/tsconfig.spec.json
- Despliegue a produccion (dom 22 nov 2026)
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- CategoriaCronotipo
- exportacion.service.ts
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- proveedores-offline.ts
- PlanHoyComponent
- 4. Vertical slices (dueños de código)
- CrearTurnoDto
- Smoke test del piloto (v0.9.0-piloto)
- 6. Historias de usuario y criterios de aceptación
- mi-consumo.component.spec.ts
- pwa-e2e/tsconfig.json
- plataforma/auth/auth.service.ts
- plataforma.module.ts
- generalizarCuasiIdentificador
- CafeinaService
- app.module.ts
- @playwright/test
- Body
- apps_api_src_generated_prisma_client
- Controller
- IConnectivityProvider
- domain/src/index.ts
- paginas-auth.spec.ts
- auth.ts
- Post
- Component

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 91 edges
2. `@angular/core` - 70 edges
3. `PrismaService` - 67 edges
4. `UsuarioJwtPayload` - 43 edges
5. `OfflineStoreService` - 40 edges
6. `@angular/common` - 38 edges
7. `UsuarioActual` - 34 edges
8. `Roles()` - 32 edges
9. `@nestjs/swagger` - 32 edges
10. `OperacionesService` - 28 edges

## Surprising Connections (you probably didn't know these)
- `7. Offline (RNF03)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts
- `2–4. Matriz de requerimientos y diagnóstico` --references--> `assertKAnonymity()`  [INFERRED]
  contexto/auditoria-2026-10-25.md → libs/domain/src/k-anonymity.ts
- `Resultado` --references--> `validarEntorno()`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/config/entorno.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (156 total, 42 thin omitted)

### Community 0 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.09
Nodes (10): IndicadoresController, AdherenciaRow, CafeinaRow, DescansoRow, IndicadoresPanelData, IndicadoresService, UniqueUserRow, 6. Privacidad y seguridad (obligatorio · Ley N.° 29733) (+2 more)

### Community 1 - "Auditoría de release — 2026-10-25"
Cohesion: 0.22
Nodes (8): 1. Módulos y dueños, 2–4. Matriz de requerimientos y diagnóstico, 3. Verificación técnica, 5–6. Operaciones Notion aplicadas, Auditoría de release — 2026-10-25, Deuda técnica transversal, Pendientes manuales, Resumen ejecutivo

### Community 2 - "rmeq.ts"
Cohesion: 0.54
Nodes (5): Pregunta, RespuestasRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

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
Nodes (19): CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, HORA_FIN_NOCTURNO, HORA_INICIO_NOCTURNO, OPORTUNIDAD_SUENO_MIN_H (+11 more)

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

### Community 23 - "rn01.ts"
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

### Community 27 - "@angular/common"
Cohesion: 0.13
Nodes (12): AdminParametrosComponent, AptitudService, fechaLocal(), AHORA, NOMBRE_CATEGORIA, PREGUNTAS_RMEQ, environment, ConsultarDespachoRequest (+4 more)

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

### Community 34 - "sesion.service.ts"
Cohesion: 0.10
Nodes (16): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, ConsentimientoComponent, escribir(), obtener() (+8 more)

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
Cohesion: 0.25
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 42 - "sync-orchestrator.service.ts"
Cohesion: 0.13
Nodes (12): SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncEstadoOperacion, syncLoteDesdeWire(), SyncLoteResultadoWireDto, SyncLoteWireDto, syncOperacionDesdeWire(), SyncOperacionDto (+4 more)

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
Cohesion: 0.16
Nodes (14): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+6 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "OperacionesService"
Cohesion: 0.07
Nodes (4): ConfirmarTurnoDto, CrearTurnoDto, OperacionesController, OperacionesService

### Community 56 - "solar.ts"
Cohesion: 0.11
Nodes (13): ConfiguracionMotor, ParametrosTurno, CFG, SOLAR_ICA, TURNO_DIURNO, TURNO_NOCTURNO, DESFASE_LIMA_H, VERSION_ALGORITMO_PLAN (+5 more)

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.08
Nodes (7): NotificacionesController, NotificacionesService, TurnoAsignadoNotificacionListener, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto, web-push

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.13
Nodes (7): OfflineStoreService, Diario, EventoSolar, Ingesta, OutboxStatus, Plan, Turno

### Community 60 - "devDependencies"
Cohesion: 0.03
Nodes (58): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+50 more)

### Community 61 - "package.json"
Cohesion: 0.03
Nodes (57): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+49 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.12
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "trabajador.module.ts"
Cohesion: 0.14
Nodes (7): DIARIO_REPOSITORY, IDiarioRepository, FakeDiarioRepository, aRespuesta(), PrismaDiarioRepository, CrearActualizarDiarioDto, DiarioRespuestaDto

### Community 65 - "@angular/core"
Cohesion: 0.13
Nodes (10): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra, tipoDeHora() (+2 more)

### Community 66 - "planes.service.ts"
Cohesion: 0.10
Nodes (10): CafeinaService, CronotipoService, TurnoParaPlan, UbicacionService, ParametroEditable, PARAMETROS_EDITABLES, ParametrosService, PrismaService (+2 more)

### Community 67 - "2. Usuarios"
Cohesion: 0.67
Nodes (3): 2. Usuarios, Usuario principal: conductor (rol `trabajador`), Usuarios secundarios

### Community 68 - "cafeina.ts"
Cohesion: 0.17
Nodes (22): 4. Vertical slices (dueños de código), CafeinaActiva, calcularCafeinaActiva(), calcularHoraCorte(), ConsumoDia, residual(), resolverSemivida(), resumirConsumoPorDia() (+14 more)

### Community 69 - "@nestjs/common"
Cohesion: 0.11
Nodes (11): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, PruebaController, Roles(), ROLES_PERMITIDOS, SolicitudAutenticada (+3 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "aptitud.component.ts"
Cohesion: 0.06
Nodes (19): AuthService, ESTILOS_FORMULARIO, CARGOS, MENSAJES, RANGOS_EDAD, RegistroComponent, SEXOS, ESTADOS (+11 more)

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

### Community 82 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 83 - "circadiano.ts"
Cohesion: 0.22
Nodes (17): calcularPlanLocal(), addH(), addMin(), aIso(), aPlanDiarioDto(), calcularCorteCafeina(), DELTA_CRONOTIPO_MIN, derivarRecordatorios() (+9 more)

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "app.module.ts"
Cohesion: 0.20
Nodes (5): PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus, @nestjs/throttler

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "BebidaDto"
Cohesion: 0.12
Nodes (7): CafeinaComponent, Icono, ICONOS, BEBIDAS, errorRegistro(), RegistroCafeina, BebidaDto

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.14
Nodes (16): CONNECTIVITY_PROVIDER_TOKEN, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+8 more)

### Community 95 - "CircadianoController"
Cohesion: 0.06
Nodes (10): CircadianoController, ConsultarEventosSolaresDto, ConsultarFechaDto, CrearPerfilCronotipoDto, CrearUbicacionDto, GeoService, PerfilCronotipoDto, CrearUbicacionDto (+2 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "ingesta-sync.handler.ts"
Cohesion: 0.27
Nodes (4): SyncHandlerRegistry, UnknownSyncHandlerError, FakeHandler, SyncOperationHandler

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.17
Nodes (7): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 105 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.16
Nodes (15): aFechaReciente(), aItemLocal(), esperarConTope(), fechaLima(), FORMATO_HORA, IngestaLocal, IngestaLocalConFecha, MiConsumo (+7 more)

### Community 107 - "pwa-e2e/project.json"
Cohesion: 0.14
Nodes (14): executor, options, implicitDependencies, name, command, projectType, $schema, sourceRoot (+6 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "@nestjs/common"
Cohesion: 0.13
Nodes (7): UsuarioEliminadoCafeinaListener, UsuarioEliminadoCircadianoListener, CAMPOS_ADMIN, UsuarioEliminadoTrabajadorListener, USUARIO_ELIMINADO, UsuarioEliminadoEvento, @nestjs/event-emitter

### Community 111 - "turnos.service.ts"
Cohesion: 0.17
Nodes (9): Ruta, Turno, TurnosService, ActualizarTurnoDto, CrearTurnoDto, EliminarTurnoRespuestaDto, ImportarTurnosRespuestaDto, RutaDto (+1 more)

### Community 112 - "UsuarioJwtPayload"
Cohesion: 0.16
Nodes (15): MockDelegado, ConsultaAptitud, USUARIOS, tokens, SECRETO, JwtAuthGuard, ES_PUBLICA, RolesGuard (+7 more)

### Community 114 - "PRODUCT.md — CircaRuta"
Cohesion: 0.17
Nodes (12): 1. Principios, 2. Referencias y qué tomamos de cada una, 3.1 Tema claro (igual a §14, con dos correcciones de contraste), 3.2 Modo nocturno de bajo brillo **Δ §14**, 3. Color, 4. Tipografía, 5. Espaciado, forma y tamaño táctil, 6. Patrones clave (+4 more)

### Community 116 - "SPEC.md — Slice 01: Cuenta + Registro de cafeína"
Cohesion: 0.18
Nodes (11): 0. Cómo usar este documento, 10. Pruebas, 11. Estado y Definición de terminado, 1. Objetivo, 2. Alcance, 3. Convenciones, 4. Catálogos, 5. Modelo de datos (+3 more)

### Community 118 - "mi-consumo.component.ts"
Cohesion: 0.18
Nodes (6): ConsumoItem, horaLima(), mensajeCafeinaActiva(), INICIAL_DIA, MiConsumoComponent, NOMBRE_DIA

### Community 119 - "domain/src/aptitud.ts"
Cohesion: 0.10
Nodes (5): AptitudController, AptitudService, CrearAptitudDto, calcularHorasSuenoEnVentana(), ConsultarDespachoResponse

### Community 120 - "sync-orchestrator.service.spec.ts"
Cohesion: 0.17
Nodes (8): IngestaSyncHandler, InvalidSyncBatchError, SyncOrchestratorService, SyncHandlerResult, SyncIdentity, SyncLoteDto, SyncLoteResultadoDto, class-transformer

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.33
Nodes (4): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, dexie

### Community 122 - ".eliminar"
Cohesion: 0.17
Nodes (12): 1. Propósito, 3. Contexto de uso, 4. Tareas clave (por orden de importancia), 5. Voz y tono, 7. Gestión del proyecto, 8. Evidencia y supuestos, 9. Cómo saber si funciona `[POR CONFIRMAR metas]`, Evidence on Hand (+4 more)

### Community 123 - "contracts/src/index.ts"
Cohesion: 0.15
Nodes (8): GenerarPlanDto, ActualizarTurnoDto, GESTIONAN_TURNOS, GenerarPlanDto, TURNO_ASIGNADO, TurnoAsignadoEvento, class-validator, @nestjs/swagger

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

### Community 132 - "AptitudComponent"
Cohesion: 0.07
Nodes (20): FilaAptitud, AptitudComponent, mensajeError(), EvaluacionDespacho, IAptitud, MotivoAptitud, ColorSemaforo, ResultadoAptitudPresalida (+12 more)

### Community 133 - "UsuariosAdminController"
Cohesion: 0.14
Nodes (3): UsuariosAdminController, UsuarioAdminDto, Paginado

### Community 134 - "diario-sync.handler.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "Despliegue a produccion (dom 22 nov 2026)"
Cohesion: 0.24
Nodes (10): 10. Flujo Git y validación pre-PR, Arquitectura de produccion, Calendario, Despliegue a produccion (dom 22 nov 2026), Ensayo (vie 20 nov), Migraciones, Paso a paso del dia (👤), Rollback (+2 more)

### Community 137 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.05
Nodes (20): CafeinaController, ConsultarResumenCafeinaDto, CrearIngestaCafeinaBodyDto, Estado, 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify (+12 more)

### Community 138 - "CategoriaCronotipo"
Cohesion: 0.15
Nodes (8): RmeqComponent, CategoriaCronotipo, RecordatorioDelPlan, TipoRecordatorioPlan, TipoTurnoPlan, VentanaTemporalDto, ResultadoPlan, RangoRmeq

### Community 139 - "exportacion.service.ts"
Cohesion: 0.08
Nodes (14): ExportacionController, aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO, filas() (+6 more)

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 144 - "proveedores-offline.ts"
Cohesion: 0.18
Nodes (10): MockSessionProvider, SesionPrueba, crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), OPERACION, ISessionProvider (+2 more)

### Community 146 - "4. Vertical slices (dueños de código)"
Cohesion: 0.20
Nodes (6): aFecha(), aIso(), diaIso(), PlanesService, TurnoAsignadoListener, PlanDiarioDto

### Community 150 - "Smoke test del piloto (v0.9.0-piloto)"
Cohesion: 0.22
Nodes (8): 0. Previo, 1. Instalacion, 2. Recorrido (RF01 → RF11), 3. Offline (RNF03), 4. Notificaciones (RF10), 5. Seguridad minima, Resultado y release, Smoke test del piloto (v0.9.0-piloto)

### Community 157 - "mi-consumo.component.spec.ts"
Cohesion: 0.40
Nodes (5): resumenLocal(), AHORA, conConsumo(), EN_COLA, ENVIADO

### Community 158 - "pwa-e2e/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 159 - "plataforma/auth/auth.service.ts"
Cohesion: 0.17
Nodes (12): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), RefrescoPayload, SECRETO, RegistroDto, UsuarioDto (+4 more)

### Community 160 - "plataforma.module.ts"
Cohesion: 0.12
Nodes (6): AreasController, AreasService, AuthModule, CuentaController, UsuariosService, AreaDto

### Community 166 - "app.module.ts"
Cohesion: 0.12
Nodes (10): AptitudModule, CafeinaModule, CircadianoModule, IndicadoresModule, NotificacionesModule, OperacionesModule, PlataformaModule, SyncModule (+2 more)

### Community 171 - "apps_api_src_generated_prisma_client"
Cohesion: 0.27
Nodes (5): AREAS, sembrarIdentidad(), dotenv, prisma, @prisma/adapter-pg

### Community 174 - "domain/src/index.ts"
Cohesion: 0.13
Nodes (13): OrigenPlan, planServidor, turno, TURNO, EstadoVistaTurno, MENSAJE_POR_ESTADO, ProximoTurnoService, ConfirmacionTurnoPayload (+5 more)

### Community 177 - "auth.ts"
Cohesion: 0.12
Nodes (8): RefrescarTokenDto, ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, LoginDto, RefrescarTokenDto, ROLES

### Community 179 - "Post"
Cohesion: 0.40
Nodes (5): 6. Restricciones, Accesibilidad, Calendario, Privacidad, Técnicas

## Knowledge Gaps
- **66 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1068 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/router` to `BebidaDto`, `@angular/core`, `sesion.service.ts`, `diario/diario.service.ts`, `aptitud.component.ts`, `paginas/cafeina/cafeina.service.ts`, `domain/src/index.ts`, `turnos.service.ts`, `proveedores-offline.ts`, `indicadores.component.ts`, `package.json`, `mi-consumo.component.ts`, `offline/offline-store.service.ts`, `@angular/common`, `mi-consumo.component.spec.ts`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `modulos/indicadores/indicadores.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08831908831908832 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `modulos/indicadores/indicadores.service.ts`, `plataforma.module.ts`, `planes.service.ts`, `trabajador.module.ts`, `api/src/main.ts`, `app.module.ts`, `exportacion.service.ts`, `@nestjs/common`, `UsuarioJwtPayload`, `CrearTurnoDto`, `app.module.ts`, `domain/src/aptitud.ts`, `sync-orchestrator.service.spec.ts`, `.guardarSuscripcion`, `contracts/src/index.ts`, `package.json`, `plataforma/auth/auth.service.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Why does `UsuarioJwtPayload` connect `@nestjs/common` to `plataforma/auth/auth.service.ts`, `sesion.service.ts`, `CafeinaService`, `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)`, `sync-orchestrator.service.ts`, `UsuarioJwtPayload`, `auth.ts`, `AuthService`, `OperacionesService`, `DiarioController`, `domain/src/aptitud.ts`, `.guardarSuscripcion`, `contracts/src/index.ts`, `CircadianoController`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._