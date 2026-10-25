# Graph Report - Ritmo-Circadiano  (2026-10-25)

## Corpus Check
- 314 files · ~138,840 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 2849 nodes · 5165 edges · 154 communities (107 shown, 47 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 114 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60045611`
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
- @angular/common
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
- CrearTurnoDto
- circadiano.ts
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- diario-sync.handler.ts
- @angular/core
- operaciones-roles.e2e.spec.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- contracts/src/index.ts
- compilerOptions
- app.routes.ts
- sync-lote.dto.ts
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
- plan-hoy.component.ts
- PrismaClientBaseOptions
- test
- SaludController
- configurations
- plataforma.module.ts
- client.ts
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- modulos/aptitud/aptitud.service.ts
- diario/diario.service.ts
- PrismaClient
- class.ts
- App
- CafeinaService
- OutboxService
- UsuarioEliminadoCafeinaListener
- CafeinaComponent
- optimization
- README.md
- @nestjs/common
- TurnosService
- AuthService
- ProximoTurnoComponent
- DiarioController
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- 4. Vertical slices (dueños de código)
- domain/src/aptitud.ts
- RegistroService
- .crearAptitud
- IConnectivityProvider
- offline/offline-store.service.ts
- exportacion.service.ts
- RegistroDto
- CategoriaCronotipo
- 1. Respaldos
- LoginDto
- sync-queue.ts
- plataforma/auth/auth.service.ts
- ngsw-config.spec.ts
- lww-policy.ts
- Prisma__RutaClient
- Auditable
- auth.ts
- .generarParaTurno
- contracts/tsconfig.spec.json
- Despliegue a produccion (dom 22 nov 2026)
- CrearActualizarDiarioDto
- PrismaDiarioRepository
- SyncController
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- SyncOperacionDto
- PlanHoyComponent
- solar.ts
- AptitudComponent
- enums.ts
- RefrescarTokenDto
- aptitud.component.ts
- UsuarioEliminadoTrabajadorListener
- environment.ts
- IndicadoresComponent

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 88 edges
2. `PrismaService` - 67 edges
3. `@angular/core` - 66 edges
4. `UsuarioJwtPayload` - 41 edges
5. `@angular/common` - 36 edges
6. `OfflineStoreService` - 35 edges
7. `UsuarioActual` - 33 edges
8. `@nestjs/swagger` - 30 edges
9. `PrismaClient` - 29 edges
10. `OperacionesService` - 28 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `Resultado` --references--> `JwtAuthGuard`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `Resultado` --references--> `RolesGuard`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/modulos/plataforma/auth/roles.guard.ts

## Import Cycles
- None detected.

## Communities (154 total, 47 thin omitted)

### Community 0 - "prismaNamespace.ts"
Cohesion: 0.01
Nodes (145): AnyNull, AptitudPresalidaScalarFieldEnum, AreaScalarFieldEnum, Args, At, AtLeast, AtLoose, AtStrict (+137 more)

### Community 1 - "TurnoLaboral.ts"
Cohesion: 0.02
Nodes (107): AggregateTurnoLaboral, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, TurnoLaboral$aptitudesArgs, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs, TurnoLaboralAvgAggregateInputType (+99 more)

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
Cohesion: 0.03
Nodes (79): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalNullableFilter (+71 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.12
Nodes (29): CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, DESFASE_LIMA_H, HORA_FIN_NOCTURNO (+21 more)

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
Cohesion: 0.06
Nodes (32): AnyNull, AptitudPresalidaScalarFieldEnum, AreaScalarFieldEnum, AuditLogScalarFieldEnum, BebidaScalarFieldEnum, DbNull, Decimal, EvaluacionScalarFieldEnum (+24 more)

### Community 23 - "app.module.ts"
Cohesion: 0.08
Nodes (13): AppModule, AptitudModule, CafeinaModule, CircadianoModule, IndicadoresModule, IndicadoresService, OperacionesModule, PlataformaModule (+5 more)

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
Cohesion: 0.11
Nodes (15): OrigenPlan, PlanDelDia, PlanService, planServidor, turno, TURNO, EstadoVistaTurno, MENSAJE_POR_ESTADO (+7 more)

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

### Community 34 - "@angular/common"
Cohesion: 0.09
Nodes (23): appConfig, PreferenciaTema, Tema, authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS (+15 more)

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
Cohesion: 0.15
Nodes (10): SyncHandlerRegistry, UnknownSyncHandlerError, SyncModule, InvalidSyncBatchError, FakeHandler, SyncOrchestratorService, TrabajadorModule, SyncOperationHandler (+2 more)

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
Cohesion: 0.10
Nodes (20): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, EventoSolar, ExcesoJornadaAuditoria (+12 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "CrearTurnoDto"
Cohesion: 0.07
Nodes (3): ConfirmarTurnoDto, CrearTurnoDto, OperacionesController

### Community 56 - "circadiano.ts"
Cohesion: 0.11
Nodes (26): TipoTurnoPlan, addH(), addMin(), aIso(), aPlanDiarioDto(), calcularCorteCafeina(), ConfiguracionMotor, DELTA_CRONOTIPO_MIN (+18 more)

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.07
Nodes (10): NotificacionesController, NotificacionesModule, NotificacionesService, TurnoAsignadoNotificacionListener, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto, TurnoAsignadoEvento (+2 more)

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.14
Nodes (8): OfflineStoreService, Diario, EventoSolar, Ingesta, Outbox, OutboxStatus, Plan, Turno

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (57): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+49 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (55): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+47 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.11
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "diario-sync.handler.ts"
Cohesion: 0.22
Nodes (5): DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, DiarioRespuestaDto

### Community 65 - "@angular/core"
Cohesion: 0.20
Nodes (5): IndicadoresService, PanelIndicadoresResponse, OfflineStoreService, @angular/core, @angular/forms

### Community 66 - "operaciones-roles.e2e.spec.ts"
Cohesion: 0.13
Nodes (18): ConsultaAptitud, USUARIOS, tokens, PruebaController, SECRETO, JwtAuthGuard, ES_PUBLICA, RolesGuard (+10 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.27
Nodes (13): IngestaItem, calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis() (+5 more)

### Community 69 - "contracts/src/index.ts"
Cohesion: 0.13
Nodes (9): ActualizarTurnoDto, GESTIONAN_TURNOS, Roles(), ROLES_PERMITIDOS, ErrorApiDto, ROLES, validarJornadaRN01(), class-validator (+1 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "app.routes.ts"
Cohesion: 0.08
Nodes (19): appRoutes, autenticadoGuard(), rolGuard(), estado, ruta, AuthService, ConsentimientoComponent, ESTILOS_FORMULARIO (+11 more)

### Community 72 - "sync-lote.dto.ts"
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

### Community 84 - "plan-hoy.component.ts"
Cohesion: 0.10
Nodes (11): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, PlanComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra (+3 more)

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "plataforma.module.ts"
Cohesion: 0.18
Nodes (4): AreasController, AreasService, AuthModule, AreaDto

### Community 90 - "client.ts"
Cohesion: 0.10
Nodes (19): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, EventoSolar, ExcesoJornadaAuditoria (+11 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.14
Nodes (16): CONNECTIVITY_PROVIDER_TOKEN, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+8 more)

### Community 95 - "CircadianoController"
Cohesion: 0.05
Nodes (15): CircadianoController, ConsultarEventosSolaresDto, ConsultarFechaDto, CrearPerfilCronotipoDto, CrearUbicacionDto, GenerarPlanDto, GeoService, PerfilCronotipoDto (+7 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "modulos/aptitud/aptitud.service.ts"
Cohesion: 0.39
Nodes (3): AptitudService, ConsultarDespachoResponse, colorDivulgableAlDespachador()

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.18
Nodes (6): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "CafeinaService"
Cohesion: 0.06
Nodes (17): Entorno, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), BebidasController, CafeinaController, CafeinaService (+9 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "@nestjs/common"
Cohesion: 0.08
Nodes (18): CronotipoService, PlanesService, TurnoParaPlan, TurnoAsignadoListener, UbicacionService, UsuarioEliminadoCircadianoListener, OperacionesService, UsuarioEliminadoOperacionesListener (+10 more)

### Community 115 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (11): Estado, 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos (+3 more)

### Community 117 - "domain/src/aptitud.ts"
Cohesion: 0.31
Nodes (7): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 119 - ".crearAptitud"
Cohesion: 0.10
Nodes (3): AptitudController, CrearAptitudDto, calcularHorasSuenoEnVentana()

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie (+1 more)

### Community 122 - "exportacion.service.ts"
Cohesion: 0.05
Nodes (18): IndicadoresController, ExportacionController, aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO (+10 more)

### Community 124 - "CategoriaCronotipo"
Cohesion: 0.19
Nodes (8): Pregunta, RmeqComponent, CategoriaCronotipo, RespuestasRmeq, RangoRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

### Community 125 - "1. Respaldos"
Cohesion: 0.29
Nodes (6): 1. Respaldos, 2. Monitoreo, 3. Pendientes humanos, Backups y monitoreo del piloto, Respaldo diario, Restaurar staging tras un incidente

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 128 - "plataforma/auth/auth.service.ts"
Cohesion: 0.29
Nodes (6): RefrescoPayload, SECRETO, RegistroDto, UsuarioDto, argon2, @nestjs/config

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 132 - "Auditable"
Cohesion: 0.10
Nodes (6): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, CuentaController, UsuariosService

### Community 133 - "auth.ts"
Cohesion: 0.09
Nodes (7): ActualizarUsuarioAdminDto, UsuariosAdminController, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioAdminDto, Paginado

### Community 134 - ".generarParaTurno"
Cohesion: 0.18
Nodes (4): PlanDiario, aFecha(), aIso(), diaIso()

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "Despliegue a produccion (dom 22 nov 2026)"
Cohesion: 0.14
Nodes (16): PrismaClient, 10. Flujo Git y validación pre-PR, Arquitectura de produccion, Calendario, Despliegue a produccion (dom 22 nov 2026), Ensayo (vie 20 nov), Migraciones, Paso a paso del dia (👤) (+8 more)

### Community 137 - "CrearActualizarDiarioDto"
Cohesion: 0.18
Nodes (3): ConsultaDiarioFiltroDto, CrearActualizarDiarioDto, DiarioSyncPayload

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 144 - "SyncOperacionDto"
Cohesion: 0.20
Nodes (6): DiarioSyncHandler, SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncHandlerResult, SyncIdentity, SyncOperacionDto

### Community 146 - "solar.ts"
Cohesion: 0.20
Nodes (5): calcularPlanLocal(), calcularEventosSolares(), EventosSolares, fechaLima(), suncalc

### Community 147 - "AptitudComponent"
Cohesion: 0.07
Nodes (20): FilaAptitud, AptitudComponent, mensajeError(), EvaluacionDespacho, IAptitud, MotivoAptitud, ColorSemaforo, ResultadoAptitudPresalida (+12 more)

### Community 152 - "enums.ts"
Cohesion: 0.33
Nodes (5): CategoriaCronotipo, ColorAptitud, EstadoConfirmacion, EstadoUsuario, Rol

### Community 155 - "aptitud.component.ts"
Cohesion: 0.08
Nodes (18): ESTADOS, SemaforoAptitudComponent, AnfitrionComponent, TarjetaComponent, IdPaso, MENSAJE_POR_ESTADO, Paso, PASOS (+10 more)

### Community 161 - "environment.ts"
Cohesion: 0.24
Nodes (4): AdminParametrosComponent, NOMBRE_CATEGORIA, PREGUNTAS_RMEQ, environment

## Knowledge Gaps
- **64 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0136986301369863 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `plataforma.module.ts`, `modulos/aptitud/aptitud.service.ts`, `operaciones-roles.e2e.spec.ts`, `plataforma/auth/auth.service.ts`, `Auditable`, `contracts/src/index.ts`, `diario-sync.handler.ts`, `sync-orchestrator.service.ts`, `app.module.ts`, `.guardarSuscripcion`, `exportacion.service.ts`, `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018518518518518517 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `environment.ts`, `@angular/common`, `diario/diario.service.ts`, `cafeina.ts`, `app.routes.ts`, `domain/src/index.ts`, `plan-hoy.component.ts`, `offline/offline-store.service.ts`, `aptitud.component.ts`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._