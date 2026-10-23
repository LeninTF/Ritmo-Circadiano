# Graph Report - rc-diario  (2026-10-23)

## Corpus Check
- 240 files · ~102,289 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: (none) 11, .prisma 6, .scss 2)

## Summary
- 2383 nodes · 3915 edges · 137 communities (98 shown, 39 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `689966a4`
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
- @nestjs/common
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
- diario.controller.ts
- serve
- pwa/project.json
- api/project.json
- targets
- compilerOptions
- prune-lockfile
- registro-sueno-contrato.spec.ts
- dotenv
- options
- api-e2e/tsconfig.json
- options
- production
- browser.ts
- ngsw-config.json
- AuthService
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- operaciones.service.ts
- UsuarioActual
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- AuditInterceptor
- indicadores.component.ts
- operaciones-roles.e2e.spec.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- notificaciones.controller.ts
- compilerOptions
- app.routes.ts
- paginas-auth.spec.ts
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
- tarjeta.component.ts
- configurations
- @angular/common
- client.ts
- outbox.service.spec.ts
- ColorSemaforo
- Staging del piloto
- aptitud.ts
- sesion.service.ts
- PrismaClient
- class.ts
- App
- auth.controller.ts
- usuarios-admin.controller.ts
- plataforma.module.ts
- CafeinaComponent
- optimization
- README.md
- contracts/src/index.ts
- auth.e2e.spec.ts
- chip.component.spec.ts
- cafeina.service.ts
- .eliminar
- plataforma/auth/auth.service.ts
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- TurnosService
- Rol
- registro.component.ts
- Prisma__RutaClient
- offline/offline-store.service.ts
- exportacion.service.ts
- OutboxService
- ExportacionController
- @nestjs/swagger
- proveedores-offline.ts
- sync-queue.ts
- BebidasController
- ngsw-config.spec.ts
- lww-policy.ts
- IConnectivityProvider
- Entorno
- 4. Vertical slices (dueños de código)
- enums.ts
- api/src/main.ts
- .soloJefe

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 66 edges
2. `PrismaService` - 52 edges
3. `@angular/core` - 48 edges
4. `OfflineStoreService` - 32 edges
5. `UsuarioJwtPayload` - 29 edges
6. `PrismaClient` - 25 edges
7. `@nestjs/swagger` - 22 edges
8. `UsuarioActual` - 21 edges
9. `OutboxService` - 21 edges
10. `Roles()` - 20 edges

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

## Communities (137 total, 39 thin omitted)

### Community 0 - "prismaNamespace.ts"
Cohesion: 0.01
Nodes (138): AnyNull, AptitudPresalidaScalarFieldEnum, AreaScalarFieldEnum, Args, At, AtLeast, AtLoose, AtStrict (+130 more)

### Community 1 - "TurnoLaboral.ts"
Cohesion: 0.02
Nodes (95): AggregateTurnoLaboral, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs, TurnoLaboralAvgAggregateInputType, TurnoLaboralAvgAggregateOutputType (+87 more)

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
Nodes (69): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalNullableFilter (+61 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.13
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
Cohesion: 0.14
Nodes (13): name, commands, parallel, projectType, $schema, sourceRoot, tags, targets (+5 more)

### Community 22 - "prismaNamespaceBrowser.ts"
Cohesion: 0.07
Nodes (27): AnyNull, AptitudPresalidaScalarFieldEnum, AreaScalarFieldEnum, AuditLogScalarFieldEnum, BebidaScalarFieldEnum, DbNull, Decimal, EvaluacionScalarFieldEnum (+19 more)

### Community 23 - "@nestjs/common"
Cohesion: 0.10
Nodes (10): AppModule, CircadianoModule, IndicadoresController, IndicadoresModule, IndicadoresService, OperacionesModule, PrismaModule, RespuestaAgregada (+2 more)

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

### Community 34 - "diario.controller.ts"
Cohesion: 0.07
Nodes (11): DiarioController, DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, aRespuesta(), PrismaDiarioRepository, TrabajadorModule (+3 more)

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
Nodes (16): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, ExcesoJornadaAuditoria, IngestaCafeina (+8 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 50 - "AuthService"
Cohesion: 0.06
Nodes (6): AuthController, AuthService, LoginDto, RefrescarTokenDto, RegistroDto, RefrescarTokenDto

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "operaciones.service.ts"
Cohesion: 0.05
Nodes (11): ActualizarTurnoDto, CrearTurnoDto, GESTIONAN_TURNOS, OperacionesController, OperacionesService, Roles(), TURNO_ASIGNADO, TurnoAsignadoEvento (+3 more)

### Community 56 - "UsuarioActual"
Cohesion: 0.11
Nodes (9): CafeinaController, CafeinaModule, CafeinaService, UsuarioActual, 1. Arquitectura y SOLID, BebidaDto, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto (+1 more)

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.10
Nodes (4): NotificacionesController, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "OfflineStoreService"
Cohesion: 0.15
Nodes (8): OfflineStoreService, Diario, EventoSolar, Ingesta, Outbox, OutboxStatus, Plan, Turno

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (56): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+48 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (56): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+48 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.10
Nodes (7): ActualizarParametroDto, ParametrosController, ParametroEditable, PARAMETROS_EDITABLES, ParametrosService, ActualizarParametroDto, ParametroSistemaDto

### Community 65 - "indicadores.component.ts"
Cohesion: 0.27
Nodes (3): IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse

### Community 66 - "operaciones-roles.e2e.spec.ts"
Cohesion: 0.15
Nodes (9): tokens, JwtAuthGuard, ROLES_PERMITIDOS, RolesGuard, contexto(), @nestjs/core, @nestjs/jwt, @nestjs/testing (+1 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.33
Nodes (10): calcularHoraCorte(), residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis(), validarHora(), validarIngesta() (+2 more)

### Community 69 - "notificaciones.controller.ts"
Cohesion: 0.17
Nodes (4): NotificacionesModule, NotificacionesService, @nestjs/schedule, web-push

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "app.routes.ts"
Cohesion: 0.19
Nodes (12): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+4 more)

### Community 72 - "paginas-auth.spec.ts"
Cohesion: 0.13
Nodes (7): ConsentimientoComponent, IngresarComponent, escribir(), obtener(), RegistroComponent, crearJwtPrueba(), montar()

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
Cohesion: 0.11
Nodes (6): MicroTarjetaComponent, AptitudComponent, DiarioComponent, PlanComponent, OfflineStoreService, @angular/core

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "@angular/common"
Cohesion: 0.24
Nodes (4): AdminParametrosComponent, PlataformaComponent, environment, @angular/common

### Community 90 - "client.ts"
Cohesion: 0.11
Nodes (16): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, ExcesoJornadaAuditoria, IngestaCafeina (+8 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.14
Nodes (16): CONNECTIVITY_PROVIDER_TOKEN, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+8 more)

### Community 95 - "ColorSemaforo"
Cohesion: 0.09
Nodes (16): ESTADOS, SemaforoAptitudComponent, ColorSemaforo, ResultadoAptitudPresalida, Contexto, Dependencias, Fase 1 — Fundamentos, Fase 2 — Componentes compartidos (dueño I4) (+8 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "aptitud.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 98 - "sesion.service.ts"
Cohesion: 0.13
Nodes (13): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, estaVigente(), PayloadJwt, SesionService (+5 more)

### Community 100 - "class.ts"
Cohesion: 0.18
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "auth.controller.ts"
Cohesion: 0.47
Nodes (4): ES_PUBLICA, Publica(), SolicitudAutenticada, UsuarioJwtPayload

### Community 103 - "usuarios-admin.controller.ts"
Cohesion: 0.14
Nodes (4): UsuariosAdminController, UsuariosService, UsuarioAdminDto, Paginado

### Community 104 - "plataforma.module.ts"
Cohesion: 0.14
Nodes (5): AreasController, AreasService, AuthModule, PlataformaModule, AreaDto

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "contracts/src/index.ts"
Cohesion: 0.09
Nodes (8): UsuarioEliminadoCafeinaListener, UsuarioEliminadoOperacionesListener, CAMPOS_ADMIN, UsuarioEliminadoTrabajadorListener, PrismaService, USUARIO_ELIMINADO, UsuarioEliminadoEvento, @nestjs/event-emitter

### Community 111 - "auth.e2e.spec.ts"
Cohesion: 0.15
Nodes (5): SECRETO, PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 113 - "cafeina.service.ts"
Cohesion: 0.13
Nodes (6): IngestaItem, IngestaCafeina, Ruta, EstadoConfirmacion, TurnoLaboral, @angular/service-worker

### Community 115 - "plataforma/auth/auth.service.ts"
Cohesion: 0.13
Nodes (11): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), RefrescoPayload, SECRETO, RegistroService, CODIGOS_ERROR (+3 more)

### Community 116 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (11): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos (+3 more)

### Community 118 - "Rol"
Cohesion: 0.15
Nodes (7): ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioDto, Rol, ROLES

### Community 119 - "registro.component.ts"
Cohesion: 0.15
Nodes (8): AuthService, ESTILOS_FORMULARIO, CARGOS, MENSAJES, RANGOS_EDAD, SEXOS, RegistroDto, @angular/forms

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.18
Nodes (8): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie

### Community 122 - "exportacion.service.ts"
Cohesion: 0.10
Nodes (14): aCsv(), celda(), COLUMNAS_SQL, FilaExportacion, FORMATO, filas(), 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), CODIGOS_INDICADOR (+6 more)

### Community 125 - "@nestjs/swagger"
Cohesion: 0.25
Nodes (4): Rutas, Auditable, OpcionesAuditoria, @nestjs/swagger

### Community 126 - "proveedores-offline.ts"
Cohesion: 0.29
Nodes (8): decodificarJwt(), crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), ResultadoLoteWire, OPERACION, fake-indexeddb

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 134 - "enums.ts"
Cohesion: 0.40
Nodes (4): ColorAptitud, EstadoConfirmacion, EstadoUsuario, Rol

## Knowledge Gaps
- **64 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1517 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.014388489208633094 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `@angular/common`, `indicadores.component.ts`, `sesion.service.ts`, `app.routes.ts`, `paginas-auth.spec.ts`, `chip.component.spec.ts`, `cafeina.service.ts`, `tarjeta.component.ts`, `registro.component.ts`, `offline/offline-store.service.ts`, `proveedores-offline.ts`, `package.json`, `outbox.service.spec.ts`, `ColorSemaforo`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020833333333333332 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `operaciones-roles.e2e.spec.ts`, `diario.controller.ts`, `notificaciones.controller.ts`, `auth.controller.ts`, `api/src/main.ts`, `plataforma.module.ts`, `usuarios-admin.controller.ts`, `contracts/src/index.ts`, `auth.e2e.spec.ts`, `cafeina.service.ts`, `plataforma/auth/auth.service.ts`, `package.json`, `operaciones.service.ts`, `UsuarioActual`, `exportacion.service.ts`, `@nestjs/swagger`, `parametros.controller.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._