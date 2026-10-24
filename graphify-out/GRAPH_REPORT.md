# Graph Report - Ritmo-Circadiano  (2026-10-24)

## Corpus Check
- 265 files · ~106,845 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 2429 nodes · 4111 edges · 146 communities (102 shown, 44 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b27855a8`
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
- domain/src/index.ts
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
- AuthController
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
- DiarioRespuestaDto
- indicadores.component.ts
- operaciones-roles.e2e.spec.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- @nestjs/swagger
- compilerOptions
- @angular/common
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
- AuthTokens
- client.ts
- outbox.service.spec.ts
- outbox.service.ts
- Staging del piloto
- aptitud.ts
- diario/diario.service.ts
- PrismaClient
- class.ts
- App
- cafeina.service.ts
- Rol
- IngresarComponent
- CafeinaComponent
- optimization
- README.md
- contracts/src/index.ts
- notificaciones.service.ts
- AuthService
- ProximoTurnoComponent
- DiarioController
- entorno.ts
- auth.interceptor.ts
- ColorSemaforo
- modulos/indicadores/indicadores.service.ts
- tarjeta.component.spec.ts
- sync-orchestrator.service.spec.ts
- offline/offline-store.service.ts
- exportacion.service.ts
- RegistroDto
- CrearActualizarDiarioDto
- plataforma.module.ts
- LoginDto
- sync-queue.ts
- UsuarioDto
- ngsw-config.spec.ts
- lww-policy.ts
- SyncOrchestratorService
- TurnosService
- Plan: Sistema de diseño del Figma en la PWA
- contracts/tsconfig.spec.json
- Entorno
- PrismaDiarioRepository
- PlataformaComponent
- SyncController
- dotenv
- UsuarioEliminadoTrabajadorListener
- RegistroComponent
- AdminParametrosComponent
- PlanComponent

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 73 edges
2. `@angular/core` - 55 edges
3. `PrismaService` - 52 edges
4. `OfflineStoreService` - 32 edges
5. `UsuarioJwtPayload` - 32 edges
6. `@angular/common` - 25 edges
7. `UsuarioActual` - 24 edges
8. `@nestjs/swagger` - 24 edges
9. `Roles()` - 23 edges
10. `OutboxService` - 23 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `4. Vertical slices (dueños de código)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts

## Import Cycles
- None detected.

## Communities (146 total, 44 thin omitted)

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
Cohesion: 0.14
Nodes (23): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, HORA_FIN_NOCTURNO, HORA_INICIO_NOCTURNO (+15 more)

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
Cohesion: 0.12
Nodes (9): AppModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, PrismaModule, helmet, @nestjs/platform-express (+1 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "domain/src/index.ts"
Cohesion: 0.16
Nodes (10): TURNO, EstadoVistaTurno, MENSAJE_POR_ESTADO, ProximoTurnoService, ConfirmacionTurnoPayload, EstadoConfirmacionContrato, Ruta, EstadoConfirmacion (+2 more)

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
Nodes (11): autenticadoGuard(), rolGuard(), estado, ruta, decodificarJwt(), estaVigente(), PayloadJwt, SesionService (+3 more)

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

### Community 42 - "sync-orchestrator.service.ts"
Cohesion: 0.19
Nodes (8): SyncModule, DiarioSyncHandler, TrabajadorModule, SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncHandlerResult, SyncIdentity, SyncOperacionDto

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
Cohesion: 0.06
Nodes (7): ConfirmarTurnoDto, CrearTurnoDto, OperacionesController, OperacionesService, detectarTurnoNocturno(), validarDescansoMinimo(), validarJornadaRN01()

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.08
Nodes (5): NotificacionesController, TurnoAsignadoNotificacionListener, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.15
Nodes (7): OfflineStoreService, Diario, EventoSolar, Ingesta, Outbox, Plan, Turno

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

### Community 64 - "DiarioRespuestaDto"
Cohesion: 0.21
Nodes (5): DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, DiarioRespuestaDto

### Community 65 - "indicadores.component.ts"
Cohesion: 0.18
Nodes (6): IngestaItem, IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse, @angular/forms, @angular/service-worker

### Community 66 - "operaciones-roles.e2e.spec.ts"
Cohesion: 0.14
Nodes (18): tokens, PruebaController, SECRETO, RefrescoPayload, SECRETO, JwtAuthGuard, ES_PUBLICA, RolesGuard (+10 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.24
Nodes (14): calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis(), validarHora() (+6 more)

### Community 69 - "@nestjs/swagger"
Cohesion: 0.18
Nodes (6): ActualizarTurnoDto, GESTIONAN_TURNOS, RefrescarTokenDto, RefrescarTokenDto, class-validator, @nestjs/swagger

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "@angular/common"
Cohesion: 0.14
Nodes (14): ConsentimientoComponent, ESTILOS_FORMULARIO, consentimientoGuard(), FlujoRegistroService, escribir(), obtener(), CARGOS, MENSAJES (+6 more)

### Community 72 - "sync.controller.ts"
Cohesion: 0.16
Nodes (9): SyncEstadoOperacion, syncLoteDesdeWire(), SyncLoteResultadoWireDto, SyncLoteWireDto, syncOperacionDesdeWire(), SyncOperacionWireDto, syncResultadoAFormaWire(), SyncResultadoOperacionDto (+1 more)

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
Cohesion: 0.12
Nodes (6): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, AptitudComponent, OfflineStoreService, @angular/core

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.18
Nodes (5): PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus, @nestjs/throttler

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "AuthTokens"
Cohesion: 0.16
Nodes (4): AuthService, AreaDto, AuthTokens, LoginDto

### Community 90 - "client.ts"
Cohesion: 0.13
Nodes (16): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, PrismaClient (+8 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.11
Nodes (12): CONNECTIVITY_PROVIDER_TOKEN, IConnectivityProvider, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy (+4 more)

### Community 95 - "outbox.service.ts"
Cohesion: 0.28
Nodes (12): EnqueueOutboxInput, crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), OPERACION, SYNC_TRANSPORT_TOKEN, SyncTransportRequest (+4 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "aptitud.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.18
Nodes (6): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO

### Community 99 - "PrismaClient"
Cohesion: 0.06
Nodes (15): PrismaClient, Prisma__RutaClient, 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA") (+7 more)

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "cafeina.service.ts"
Cohesion: 0.08
Nodes (10): BebidasController, CafeinaController, CafeinaModule, CafeinaService, UsuarioEliminadoCafeinaListener, 1. Arquitectura y SOLID, BebidaDto, CrearIngestaCafeinaDto (+2 more)

### Community 103 - "Rol"
Cohesion: 0.11
Nodes (8): ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioAdminDto, Paginado, Rol, ROLES

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "contracts/src/index.ts"
Cohesion: 0.09
Nodes (12): UsuarioEliminadoOperacionesListener, AreasController, AreasService, ParametroEditable, PARAMETROS_EDITABLES, CAMPOS_ADMIN, PrismaService, ErrorApiDto (+4 more)

### Community 111 - "notificaciones.service.ts"
Cohesion: 0.20
Nodes (5): NotificacionesModule, NotificacionesService, TurnoAsignadoEvento, @nestjs/config, web-push

### Community 115 - "entorno.ts"
Cohesion: 0.43
Nodes (5): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), class-transformer

### Community 116 - "auth.interceptor.ts"
Cohesion: 0.19
Nodes (10): appConfig, PreferenciaTema, appRoutes, Tema, authInterceptor(), conToken(), esDeLaApi(), esPublica() (+2 more)

### Community 117 - "ColorSemaforo"
Cohesion: 0.14
Nodes (10): ESTADOS, SemaforoAptitudComponent, 9. Convenciones de nomenclatura, ColorSemaforo, ResultadoAptitudPresalida, Fase 2 — Componentes compartidos (dueño I4), Fase 1 — Fundamentos, Fase 2 — Componentes compartidos (+2 more)

### Community 118 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.11
Nodes (5): IndicadoresController, IndicadoresService, 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), RespuestaAgregada, assertKAnonymity()

### Community 120 - "sync-orchestrator.service.spec.ts"
Cohesion: 0.30
Nodes (4): SyncHandlerRegistry, UnknownSyncHandlerError, FakeHandler, SyncOperationHandler

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie (+1 more)

### Community 122 - "exportacion.service.ts"
Cohesion: 0.08
Nodes (14): ExportacionController, aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO, filas() (+6 more)

### Community 124 - "CrearActualizarDiarioDto"
Cohesion: 0.18
Nodes (3): ConsultaDiarioFiltroDto, CrearActualizarDiarioDto, DiarioSyncPayload

### Community 125 - "plataforma.module.ts"
Cohesion: 0.08
Nodes (10): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, AuthModule, Roles(), ROLES_PERMITIDOS, CuentaController (+2 more)

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 128 - "UsuarioDto"
Cohesion: 0.26
Nodes (4): RegistroService, RegistroDto, UsuarioDto, argon2

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 131 - "SyncOrchestratorService"
Cohesion: 0.27
Nodes (4): InvalidSyncBatchError, SyncOrchestratorService, SyncLoteDto, SyncLoteResultadoDto

### Community 133 - "Plan: Sistema de diseño del Figma en la PWA"
Cohesion: 0.25
Nodes (7): Contexto, Dependencias, Fase 1 — Fundamentos, Fase 3 — Pantallas (en paralelo tras Checkpoint 2), Plan: Sistema de diseño del Figma en la PWA, Preguntas abiertas, Riesgos

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

## Knowledge Gaps
- **65 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1504 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015625 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `indicadores.component.ts`, `proveedores-offline.ts`, `diario/diario.service.ts`, `@angular/common`, `auth.interceptor.ts`, `ColorSemaforo`, `tarjeta.component.spec.ts`, `offline/offline-store.service.ts`, `domain/src/index.ts`, `package.json`, `outbox.service.spec.ts`, `outbox.service.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020618556701030927 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `operaciones-roles.e2e.spec.ts` to `UsuarioDto`, `DiarioRespuestaDto`, `@nestjs/swagger`, `cafeina.service.ts`, `sync-orchestrator.service.ts`, `contracts/src/index.ts`, `notificaciones.service.ts`, `package.json`, `modulos/indicadores/indicadores.service.ts`, `app.module.ts`, `salud.controller.ts`, `exportacion.service.ts`, `plataforma.module.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._