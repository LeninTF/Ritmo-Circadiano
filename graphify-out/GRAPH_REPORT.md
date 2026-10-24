# Graph Report - Ritmo-Circadiano  (2026-10-24)

## Corpus Check
- 260 files · ~104,510 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 3)

## Summary
- 2398 nodes · 4031 edges · 142 communities (100 shown, 42 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e368f3dc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prismaNamespace.ts
- TurnoLaboral.ts
- ExcesoJornadaAuditoria.ts
- Ruta.ts
- ParametroSistema.ts
- dependencies
- compilerOptions
- nx.json
- commonInputTypes.ts
- scripts
- @nx/jest
- eslint.config.mjs
- engines
- constantes.ts
- domain/project.json
- compilerOptions
- compilerOptions
- contracts/project.json
- ExcesoJornadaAuditoriaDelegate
- ParametroSistemaDelegate
- RutaDelegate
- TurnoLaboralDelegate
- prismaNamespaceBrowser.ts
- app.module.ts
- compilerOptions
- development
- api-e2e/project.json
- seed.ts
- TurnosComponent
- compilerOptions
- copy-workspace-modules
- typecheck
- pwa/tsconfig.json
- prisma-generate
- proveedores-offline.ts
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
- browser.ts
- ngsw-config.json
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- OperacionesService
- OutboxService
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- trabajador.module.ts
- indicadores.component.ts
- operaciones-roles.e2e.spec.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- contracts/src/index.ts
- compilerOptions
- app.routes.ts
- sync.controller.ts
- domain/tsconfig.lib.json
- compilerOptions
- targets
- Prisma__ExcesoJornadaAuditoriaClient
- pwa/tsconfig.app.json
- contracts/tsconfig.lib.json
- pull_request_template.md
- test
- Prisma__ParametroSistemaClient
- typecheck
- Spec: Sistema de diseño compartido (tokens del Figma)
- @angular/core
- PrismaClientBaseOptions
- test
- salud.controller.ts
- configurations
- @angular/common
- client.ts
- outbox.service.spec.ts
- UsuariosAdminController
- Staging del piloto
- aptitud.ts
- diario/diario.service.ts
- PrismaClient
- class.ts
- App
- cafeina.service.ts
- Rol
- paginas-auth.spec.ts
- CafeinaComponent
- optimization
- README.md
- PrismaService
- rn01.ts
- AuthService
- generalizarCuasiIdentificador
- .eliminar
- entorno.ts
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- CrearTurnoDto
- .obtenerPanel
- registro.component.ts
- Prisma__RutaClient
- offline/offline-store.service.ts
- exportacion.service.ts
- RegistroDto
- ExportacionController
- plataforma.module.ts
- LoginDto
- sync-queue.ts
- UsuarioDto
- ngsw-config.spec.ts
- lww-policy.ts
- PlanificadorPrueba
- api/src/main.ts
- RefrescarTokenDto
- contracts/tsconfig.spec.json
- exportacion.ts
- IndicadoresController
- PlataformaComponent
- assertKAnonymity
- dotenv

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 73 edges
2. `PrismaService` - 52 edges
3. `@angular/core` - 51 edges
4. `OfflineStoreService` - 32 edges
5. `UsuarioJwtPayload` - 32 edges
6. `UsuarioActual` - 24 edges
7. `@nestjs/swagger` - 24 edges
8. `Roles()` - 23 edges
9. `OutboxService` - 23 edges
10. `@angular/common` - 21 edges

## Surprising Connections (you probably didn't know these)
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `4. Vertical slices (dueños de código)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts
- `7. Offline (RNF03)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts

## Import Cycles
- None detected.

## Communities (142 total, 42 thin omitted)

### Community 0 - "prismaNamespace.ts"
Cohesion: 0.02
Nodes (127): AnyNull, AreaScalarFieldEnum, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload (+119 more)

### Community 1 - "TurnoLaboral.ts"
Cohesion: 0.02
Nodes (96): AggregateTurnoLaboral, DateTimeFieldUpdateOperationsInput, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs, TurnoLaboralAvgAggregateInputType (+88 more)

### Community 2 - "ExcesoJornadaAuditoria.ts"
Cohesion: 0.02
Nodes (80): AggregateExcesoJornadaAuditoria, ExcesoJornadaAuditoria$turnoArgs, ExcesoJornadaAuditoriaAggregateArgs, ExcesoJornadaAuditoriaAvgAggregateInputType, ExcesoJornadaAuditoriaAvgAggregateOutputType, ExcesoJornadaAuditoriaAvgOrderByAggregateInput, ExcesoJornadaAuditoriaCountAggregateInputType, ExcesoJornadaAuditoriaCountAggregateOutputType (+72 more)

### Community 3 - "Ruta.ts"
Cohesion: 0.03
Nodes (76): AggregateRuta, GetRutaAggregateType, GetRutaGroupByPayload, Ruta$turnosArgs, RutaAggregateArgs, RutaAvgAggregateInputType, RutaAvgAggregateOutputType, RutaAvgOrderByAggregateInput (+68 more)

### Community 4 - "ParametroSistema.ts"
Cohesion: 0.04
Nodes (53): AggregateParametroSistema, GetParametroSistemaAggregateType, GetParametroSistemaGroupByPayload, ParametroSistemaAggregateArgs, ParametroSistemaCountAggregateInputType, ParametroSistemaCountAggregateOutputType, ParametroSistemaCountArgs, ParametroSistemaCountOrderByAggregateInput (+45 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+24 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 7 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "commonInputTypes.ts"
Cohesion: 0.04
Nodes (55): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+47 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.16
Nodes (20): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, HORA_FIN_NOCTURNO, HORA_INICIO_NOCTURNO (+12 more)

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

### Community 22 - "prismaNamespaceBrowser.ts"
Cohesion: 0.10
Nodes (20): AnyNull, AreaScalarFieldEnum, BebidaScalarFieldEnum, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, IngestaCafeinaScalarFieldEnum, JsonNull (+12 more)

### Community 23 - "app.module.ts"
Cohesion: 0.10
Nodes (11): CafeinaModule, CircadianoModule, IndicadoresModule, NotificacionesModule, OperacionesModule, PlataformaModule, SyncModule, TrabajadorModule (+3 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "seed.ts"
Cohesion: 0.48
Nodes (5): PrismaClient, main(), AREAS, sembrarIdentidad(), @prisma/adapter-pg

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

### Community 34 - "proveedores-offline.ts"
Cohesion: 0.16
Nodes (12): decodificarJwt(), estaVigente(), PayloadJwt, SesionService, TokensGuardados, crearJwtPrueba(), crearSesionOffline(), crearTransporteSync() (+4 more)

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
Cohesion: 0.18
Nodes (10): SyncHandlerRegistry, UnknownSyncHandlerError, FakeHandler, DiarioSyncHandler, SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncHandlerResult, SyncIdentity (+2 more)

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

### Community 48 - "browser.ts"
Cohesion: 0.12
Nodes (14): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, Ruta (+6 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "OperacionesService"
Cohesion: 0.08
Nodes (4): ConfirmarTurnoDto, OperacionesController, OperacionesService, detectarTurnoNocturno()

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.08
Nodes (6): NotificacionesController, NotificacionesService, TurnoAsignadoNotificacionListener, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.15
Nodes (6): OfflineStoreService, Diario, EventoSolar, Ingesta, Plan, Turno

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (56): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+48 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (55): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+47 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.11
Nodes (5): ActualizarParametroDto, ParametrosController, ParametrosService, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "trabajador.module.ts"
Cohesion: 0.07
Nodes (10): DiarioController, DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, aRespuesta(), PrismaDiarioRepository, ConsultaDiarioFiltroDto (+2 more)

### Community 65 - "indicadores.component.ts"
Cohesion: 0.16
Nodes (7): IngestaItem, IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse, @angular/forms, @angular/service-worker, rxjs

### Community 66 - "operaciones-roles.e2e.spec.ts"
Cohesion: 0.14
Nodes (14): IndicadoresService, tokens, JwtAuthGuard, ES_PUBLICA, ROLES_PERMITIDOS, RolesGuard, contexto(), SolicitudAutenticada (+6 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.26
Nodes (14): calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis(), validarHora() (+6 more)

### Community 69 - "contracts/src/index.ts"
Cohesion: 0.12
Nodes (13): ActualizarTurnoDto, GESTIONAN_TURNOS, UsuarioActual, UsuarioJwtPayload, BebidaDto, ResidualCafeinaRespuestaDto, ConfirmacionTurnoPayload, EstadoConfirmacionContrato (+5 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "app.routes.ts"
Cohesion: 0.28
Nodes (8): autenticadoGuard(), rolGuard(), estado, ruta, ESTILOS_FORMULARIO, consentimientoGuard(), FlujoRegistroService, @angular/router

### Community 72 - "sync.controller.ts"
Cohesion: 0.09
Nodes (14): SyncController, InvalidSyncBatchError, SyncOrchestratorService, SyncEstadoOperacion, syncLoteDesdeWire(), SyncLoteDto, SyncLoteResultadoDto, SyncLoteResultadoWireDto (+6 more)

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

### Community 83 - "Spec: Sistema de diseño compartido (tokens del Figma)"
Cohesion: 0.29
Nodes (6): Alcance, Criterios de éxito, Límites, Objetivo, Preguntas abiertas, Spec: Sistema de diseño compartido (tokens del Figma)

### Community 84 - "@angular/core"
Cohesion: 0.10
Nodes (7): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, AptitudComponent, PlanComponent, OfflineStoreService, @angular/core

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.15
Nodes (8): AuthController, PruebaController, SECRETO, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "@angular/common"
Cohesion: 0.12
Nodes (12): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, AuthService, AdminParametrosComponent, environment (+4 more)

### Community 90 - "client.ts"
Cohesion: 0.15
Nodes (11): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, Ruta (+3 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.14
Nodes (17): CONNECTIVITY_PROVIDER_TOKEN, IConnectivityProvider, CLOCK_TOKEN, IClock, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+9 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "aptitud.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.17
Nodes (7): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 101 - "App"
Cohesion: 0.15
Nodes (6): App, appConfig, PreferenciaTema, appRoutes, Tema, @angular/platform-browser

### Community 102 - "cafeina.service.ts"
Cohesion: 0.10
Nodes (6): BebidasController, CafeinaController, CafeinaService, 1. Arquitectura y SOLID, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto

### Community 103 - "Rol"
Cohesion: 0.20
Nodes (7): ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioAdminDto, Rol, ROLES

### Community 104 - "paginas-auth.spec.ts"
Cohesion: 0.15
Nodes (5): ConsentimientoComponent, IngresarComponent, escribir(), obtener(), RegistroComponent

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "PrismaService"
Cohesion: 0.07
Nodes (16): UsuarioEliminadoCafeinaListener, UsuarioEliminadoOperacionesListener, RefrescoPayload, SECRETO, ParametroEditable, PARAMETROS_EDITABLES, CAMPOS_ADMIN, UsuariosService (+8 more)

### Community 111 - "rn01.ts"
Cohesion: 0.38
Nodes (5): ValidacionDescansoResultado, ValidacionJornadaInput, ValidacionJornadaResultado, validarDescansoMinimo(), validarJornadaRN01()

### Community 115 - "entorno.ts"
Cohesion: 0.19
Nodes (6): Entorno, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), class-transformer

### Community 116 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (11): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos (+3 more)

### Community 117 - "CrearTurnoDto"
Cohesion: 0.05
Nodes (19): CrearTurnoDto, ESTADOS, SemaforoAptitudComponent, TurnosService, 9. Convenciones de nomenclatura, ColorSemaforo, ResultadoAptitudPresalida, Contexto (+11 more)

### Community 119 - "registro.component.ts"
Cohesion: 0.20
Nodes (6): CARGOS, MENSAJES, RANGOS_EDAD, SEXOS, AnfitrionComponent, TarjetaComponent

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie (+1 more)

### Community 122 - "exportacion.service.ts"
Cohesion: 0.24
Nodes (6): aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO

### Community 125 - "plataforma.module.ts"
Cohesion: 0.11
Nodes (8): AreasController, AreasService, AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, AuthModule, Roles()

### Community 127 - "sync-queue.ts"
Cohesion: 0.16
Nodes (11): Ruta, filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse (+3 more)

### Community 128 - "UsuarioDto"
Cohesion: 0.17
Nodes (3): RegistroService, RegistroDto, UsuarioDto

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 132 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/platform-express

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "exportacion.ts"
Cohesion: 0.33
Nodes (5): CODIGOS_INDICADOR, ColumnaExportacion, COLUMNAS_EXPORTACION, FaseEvaluacion, FASES_EVALUACION

## Knowledge Gaps
- **65 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1494 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015625 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `offline/offline-store.service.ts`, `proveedores-offline.ts`, `indicadores.component.ts`, `diario/diario.service.ts`, `App`, `app.routes.ts`, `paginas-auth.spec.ts`, `CrearTurnoDto`, `registro.component.ts`, `@angular/common`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020618556701030927 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `operaciones-roles.e2e.spec.ts` to `trabajador.module.ts`, `api/src/main.ts`, `contracts/src/index.ts`, `sync-orchestrator.service.ts`, `PrismaService`, `package.json`, `salud.controller.ts`, `app.module.ts`, `exportacion.service.ts`, `plataforma.module.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._