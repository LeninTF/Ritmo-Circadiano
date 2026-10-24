# Graph Report - Ritmo-Circadiano  (2026-10-24)

## Corpus Check
- 274 files · ~109,302 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 2473 nodes · 4239 edges · 148 communities (99 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5be74e20`
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
- Roles
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
- SaludController
- configurations
- AreaDto
- client.ts
- outbox.service.spec.ts
- outbox.service.ts
- Staging del piloto
- aptitud.service.ts
- diario/diario.service.ts
- PrismaClient
- class.ts
- App
- cafeina.service.ts
- Rol
- cafeina.service.ts
- CafeinaComponent
- optimization
- README.md
- contracts/src/index.ts
- notificaciones.service.ts
- AuthService
- ProximoTurnoComponent
- DiarioController
- entorno.ts
- app.routes.ts
- domain/src/aptitud.ts
- modulos/indicadores/indicadores.service.ts
- .crearAptitud
- OperacionesController
- offline/offline-store.service.ts
- exportacion.service.ts
- RegistroDto
- diario-sync.handler.ts
- UsuariosService
- LoginDto
- sync-queue.ts
- AuthService
- ngsw-config.spec.ts
- lww-policy.ts
- CrearAptitudDto
- ExportacionController
- CrearTurnoDto
- OperacionesService
- contracts/tsconfig.spec.json
- seed.ts
- ConfirmarTurnoDto
- PlataformaComponent
- SyncController
- dotenv
- AuditInterceptor
- exportacion.ts
- .soloJefe
- assertKAnonymity

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 78 edges
2. `PrismaService` - 55 edges
3. `@angular/core` - 55 edges
4. `UsuarioJwtPayload` - 34 edges
5. `OfflineStoreService` - 32 edges
6. `Roles()` - 26 edges
7. `UsuarioActual` - 26 edges
8. `@angular/common` - 25 edges
9. `@nestjs/swagger` - 25 edges
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

## Communities (148 total, 49 thin omitted)

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
Cohesion: 0.12
Nodes (26): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+18 more)

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
Nodes (11): AppModule, CircadianoModule, OperacionesModule, PlataformaModule, PrismaModule, PrismaHealthIndicator, SaludModule, helmet (+3 more)

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
Cohesion: 0.13
Nodes (15): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, decodificarJwt(), estaVigente(), PayloadJwt (+7 more)

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
Cohesion: 0.11
Nodes (15): SyncHandlerRegistry, UnknownSyncHandlerError, SyncModule, InvalidSyncBatchError, FakeHandler, SyncOrchestratorService, TrabajadorModule, SYNC_DOMAIN_IDEMPOTENCY (+7 more)

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

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.09
Nodes (4): NotificacionesController, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

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
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "trabajador.module.ts"
Cohesion: 0.12
Nodes (9): DIARIO_REPOSITORY, IDiarioRepository, FakeDiarioRepository, aRespuesta(), PrismaDiarioRepository, ConsultaDiarioFiltroDto, CrearActualizarDiarioDto, DiarioRespuestaDto (+1 more)

### Community 65 - "indicadores.component.ts"
Cohesion: 0.27
Nodes (3): IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse

### Community 66 - "operaciones-roles.e2e.spec.ts"
Cohesion: 0.14
Nodes (18): tokens, SECRETO, RefrescoPayload, SECRETO, JwtAuthGuard, ES_PUBLICA, RegistroService, RolesGuard (+10 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.23
Nodes (15): IngestaItem, calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis() (+7 more)

### Community 69 - "contracts/src/index.ts"
Cohesion: 0.13
Nodes (10): ActualizarTurnoDto, GESTIONAN_TURNOS, Rutas, Auditable, OpcionesAuditoria, ROLES_PERMITIDOS, ErrorApiDto, TurnoAsignadoEvento (+2 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "@angular/common"
Cohesion: 0.09
Nodes (13): ConsentimientoComponent, ESTILOS_FORMULARIO, FlujoRegistroService, IngresarComponent, escribir(), obtener(), CARGOS, MENSAJES (+5 more)

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

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 90 - "client.ts"
Cohesion: 0.15
Nodes (11): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, Ruta (+3 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.11
Nodes (12): CONNECTIVITY_PROVIDER_TOKEN, IConnectivityProvider, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy (+4 more)

### Community 95 - "outbox.service.ts"
Cohesion: 0.28
Nodes (12): EnqueueOutboxInput, crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), OPERACION, SYNC_TRANSPORT_TOKEN, SyncTransportRequest (+4 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "aptitud.service.ts"
Cohesion: 0.26
Nodes (4): AptitudModule, AptitudService, ConsultarDespachoResponse, colorDivulgableAlDespachador()

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.17
Nodes (7): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, @angular/forms

### Community 99 - "PrismaClient"
Cohesion: 0.04
Nodes (17): PrismaClient, Prisma__RutaClient, TurnosService, 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify (+9 more)

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "cafeina.service.ts"
Cohesion: 0.15
Nodes (5): CafeinaController, UsuarioActual, 1. Arquitectura y SOLID, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto

### Community 103 - "Rol"
Cohesion: 0.14
Nodes (8): RefrescarTokenDto, ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, RefrescarTokenDto, Rol, ROLES

### Community 104 - "cafeina.service.ts"
Cohesion: 0.16
Nodes (5): BebidasController, CafeinaModule, CafeinaService, BebidaDto, ResidualCafeinaRespuestaDto

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "contracts/src/index.ts"
Cohesion: 0.07
Nodes (14): UsuarioEliminadoCafeinaListener, UsuarioEliminadoOperacionesListener, AreasService, AuthModule, ParametroEditable, PARAMETROS_EDITABLES, ParametrosService, CAMPOS_ADMIN (+6 more)

### Community 111 - "notificaciones.service.ts"
Cohesion: 0.17
Nodes (6): NotificacionesModule, NotificacionesService, TurnoAsignadoNotificacionListener, @nestjs/config, @nestjs/schedule, web-push

### Community 115 - "entorno.ts"
Cohesion: 0.19
Nodes (6): Entorno, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), class-transformer

### Community 116 - "app.routes.ts"
Cohesion: 0.16
Nodes (12): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+4 more)

### Community 117 - "domain/src/aptitud.ts"
Cohesion: 0.07
Nodes (27): ESTADOS, SemaforoAptitudComponent, ConsultarDespachoRequest, CrearAptitudResponse, EvaluacionDespacho, IAptitud, ColorSemaforo, AptitudPresalidaInvalidaError (+19 more)

### Community 118 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.17
Nodes (4): IndicadoresController, IndicadoresModule, IndicadoresService, RespuestaAgregada

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie (+1 more)

### Community 122 - "exportacion.service.ts"
Cohesion: 0.20
Nodes (8): aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO, filas(), generalizarCuasiIdentificador()

### Community 125 - "UsuariosService"
Cohesion: 0.08
Nodes (5): CuentaController, UsuariosAdminController, UsuariosService, UsuarioAdminDto, Paginado

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 128 - "AuthService"
Cohesion: 0.24
Nodes (3): AuthService, RegistroDto, UsuarioDto

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 131 - "CrearAptitudDto"
Cohesion: 0.20
Nodes (3): CrearAptitudDto, calcularHorasSuenoEnVentana(), CrearAptitudRequest

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "seed.ts"
Cohesion: 0.48
Nodes (5): PrismaClient, main(), AREAS, sembrarIdentidad(), @prisma/adapter-pg

### Community 143 - "exportacion.ts"
Cohesion: 0.33
Nodes (5): CODIGOS_INDICADOR, ColumnaExportacion, COLUMNAS_EXPORTACION, FaseEvaluacion, FASES_EVALUACION

## Knowledge Gaps
- **65 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1521 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015625 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `indicadores.component.ts`, `proveedores-offline.ts`, `diario/diario.service.ts`, `cafeina.ts`, `@angular/common`, `app.routes.ts`, `domain/src/aptitud.ts`, `offline/offline-store.service.ts`, `domain/src/index.ts`, `package.json`, `outbox.service.spec.ts`, `outbox.service.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020618556701030927 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `operaciones-roles.e2e.spec.ts` to `trabajador.module.ts`, `aptitud.service.ts`, `contracts/src/index.ts`, `cafeina.service.ts`, `sync-orchestrator.service.ts`, `contracts/src/index.ts`, `notificaciones.service.ts`, `modulos/indicadores/indicadores.service.ts`, `app.module.ts`, `exportacion.service.ts`, `diario-sync.handler.ts`, `package.json`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._