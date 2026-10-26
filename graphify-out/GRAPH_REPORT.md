# Graph Report - Ritmo-Circadiano  (2026-10-25)

## Corpus Check
- 332 files · ~197,470 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 4)

## Summary
- 3017 nodes · 5519 edges · 165 communities (119 shown, 46 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 127 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f3fe70d8`
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
- auth.controller.ts
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- OperacionesController
- circadiano.spec.ts
- .guardarSuscripcion
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- trabajador.module.ts
- @angular/core
- modulos/cafeina/cafeina.service.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- contracts/src/index.ts
- compilerOptions
- aptitud.component.ts
- Auditable
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
- circadiano.ts
- browser.ts
- PrismaClientBaseOptions
- test
- salud.controller.ts
- configurations
- MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)
- client.ts
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- SyncOrchestratorService
- diario/diario.service.ts
- PrismaClient
- class.ts
- App
- CafeinaController
- OutboxService
- paginas/cafeina/cafeina.service.ts
- pwa-e2e/project.json
- optimization
- README.md
- @nestjs/common
- TurnosService
- UsuarioJwtPayload
- ProximoTurnoComponent
- PRODUCT.md — CircaRuta
- indicadores.component.ts
- SPEC.md — Slice 01: Cuenta + Registro de cafeína
- DiarioController
- UsuarioEliminadoCafeinaListener
- .crearAptitud
- sync.controller.ts
- offline/offline-store.service.ts
- plataforma.module.ts
- RegistroDto
- SyncController
- 1. Respaldos
- 6. Restricciones
- sync-queue.ts
- notificaciones.service.ts
- ngsw-config.spec.ts
- lww-policy.ts
- AuthService
- ColorSemaforo
- UsuariosAdminController
- domain/src/aptitud.ts
- contracts/tsconfig.spec.json
- Despliegue a produccion (dom 22 nov 2026)
- 4. Vertical slices (dueños de código)
- cronotipo.service.ts
- exportacion.service.ts
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- outbox.service.ts
- PlanHoyComponent
- planes.service.ts
- AptitudComponent
- operaciones.service.ts
- AdminParametrosComponent
- Smoke test del piloto (v0.9.0-piloto)
- DespachoAptitudComponent
- enums.ts
- UsuarioEliminadoTrabajadorListener
- diario.component.ts
- pwa-e2e/tsconfig.json
- Entorno
- IndicadoresComponent
- 6. Historias de usuario y criterios de aceptación
- modulos/indicadores/indicadores.service.ts
- @playwright/test
- seed.ts
- dotenv
- paginas-auth.spec.ts
- Checklist de seguridad RNF04

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 91 edges
2. `@angular/core` - 70 edges
3. `PrismaService` - 68 edges
4. `UsuarioJwtPayload` - 42 edges
5. `OfflineStoreService` - 40 edges
6. `@angular/common` - 38 edges
7. `UsuarioActual` - 34 edges
8. `Roles()` - 32 edges
9. `@nestjs/swagger` - 32 edges
10. `PrismaClient` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Resultado` --references--> `validarEntorno()`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/config/entorno.ts
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `3. Convenciones` --references--> `JwtAuthGuard`  [INFERRED]
  SPEC.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (165 total, 46 thin omitted)

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
Cohesion: 0.14
Nodes (25): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+17 more)

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
Cohesion: 0.09
Nodes (12): AppModule, AptitudModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, SyncModule, TrabajadorModule (+4 more)

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
Cohesion: 0.08
Nodes (24): AptitudService, fechaLocal(), AHORA, NOMBRE_CATEGORIA, PREGUNTAS_RMEQ, OrigenPlan, planServidor, turno (+16 more)

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
Nodes (13): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, AuthService, estaVigente(), PayloadJwt (+5 more)

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
Cohesion: 0.14
Nodes (14): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+6 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 50 - "auth.controller.ts"
Cohesion: 0.11
Nodes (6): AuthController, LoginDto, RefrescarTokenDto, Publica(), LoginDto, RefrescarTokenDto

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 56 - "circadiano.spec.ts"
Cohesion: 0.10
Nodes (14): calcularPlanLocal(), ConfiguracionMotor, ParametrosTurno, CFG, SOLAR_ICA, TURNO_DIURNO, TURNO_NOCTURNO, DESFASE_LIMA_H (+6 more)

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.11
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
Nodes (54): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+46 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 64 - "trabajador.module.ts"
Cohesion: 0.11
Nodes (8): DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, aRespuesta(), ConsultaDiarioFiltroDto, CrearActualizarDiarioDto, DiarioRespuestaDto

### Community 65 - "@angular/core"
Cohesion: 0.11
Nodes (10): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra, tipoDeHora() (+2 more)

### Community 66 - "modulos/cafeina/cafeina.service.ts"
Cohesion: 0.10
Nodes (8): BebidasController, CafeinaModule, CafeinaService, IngestaSyncHandler, ParametroEditable, PARAMETROS_EDITABLES, ParametrosService, ZONA_HORARIA_EMPRESA

### Community 68 - "cafeina.ts"
Cohesion: 0.22
Nodes (18): CafeinaActiva, calcularCafeinaActiva(), calcularHoraCorte(), ConsumoDia, residual(), resolverSemivida(), resumirConsumoPorDia(), SemividaCafeina (+10 more)

### Community 69 - "contracts/src/index.ts"
Cohesion: 0.11
Nodes (12): GenerarPlanDto, PruebaController, Roles(), ROLES_PERMITIDOS, UsuarioActual, ActualizarParametroDto, UsuarioJwtPayload, ActualizarParametroDto (+4 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "aptitud.component.ts"
Cohesion: 0.11
Nodes (19): ESTILOS_FORMULARIO, CARGOS, MENSAJES, RANGOS_EDAD, SEXOS, ESTADOS, SemaforoAptitudComponent, AnfitrionComponent (+11 more)

### Community 72 - "Auditable"
Cohesion: 0.10
Nodes (6): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, ExportacionController, ExportacionService

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
Cohesion: 0.14
Nodes (24): RecordatorioDelPlan, TipoRecordatorioPlan, TipoTurnoPlan, VentanaTemporalDto, addH(), addMin(), aIso(), aPlanDiarioDto() (+16 more)

### Community 84 - "browser.ts"
Cohesion: 0.10
Nodes (20): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, EventoSolar, ExcesoJornadaAuditoria (+12 more)

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.15
Nodes (4): PrismaHealthIndicator, SaludController, @nestjs/terminus, @nestjs/throttler

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (12): 1. Principios, 2. Referencias y qué tomamos de cada una, 3.1 Tema claro (igual a §14, con dos correcciones de contraste), 3.2 Modo nocturno de bajo brillo **Δ §14**, 3. Color, 4. Tipografía, 5. Espaciado, forma y tamaño táctil, 6. Patrones clave (+4 more)

### Community 90 - "client.ts"
Cohesion: 0.10
Nodes (19): AptitudPresalida, Area, AuditLog, Bebida, $Enums, Evaluacion, EventoSolar, ExcesoJornadaAuditoria (+11 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.10
Nodes (13): CONNECTIVITY_PROVIDER_TOKEN, IConnectivityProvider, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy (+5 more)

### Community 95 - "CircadianoController"
Cohesion: 0.06
Nodes (10): CircadianoController, ConsultarEventosSolaresDto, ConsultarFechaDto, CrearPerfilCronotipoDto, CrearUbicacionDto, GeoService, PerfilCronotipoDto, CrearUbicacionDto (+2 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "SyncOrchestratorService"
Cohesion: 0.27
Nodes (4): InvalidSyncBatchError, SyncOrchestratorService, SyncLoteDto, SyncLoteResultadoDto

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.29
Nodes (6): aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "CafeinaController"
Cohesion: 0.08
Nodes (7): CafeinaController, ConsultarResumenCafeinaDto, CrearIngestaCafeinaBodyDto, 1. Arquitectura y SOLID, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto, ResidualCafeinaRespuestaDto

### Community 105 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.06
Nodes (37): CafeinaComponent, Icono, ICONOS, BEBIDAS, aFechaReciente(), aItemLocal(), CafeinaService, ConsumoItem (+29 more)

### Community 107 - "pwa-e2e/project.json"
Cohesion: 0.14
Nodes (14): executor, options, implicitDependencies, name, command, projectType, $schema, sourceRoot (+6 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "@nestjs/common"
Cohesion: 0.11
Nodes (11): UsuarioEliminadoCircadianoListener, UsuarioEliminadoOperacionesListener, SECRETO, CAMPOS_ADMIN, PrismaDiarioRepository, PrismaService, TURNO_ASIGNADO, USUARIO_ELIMINADO (+3 more)

### Community 112 - "UsuarioJwtPayload"
Cohesion: 0.14
Nodes (16): ConsultaAptitud, USUARIOS, tokens, SECRETO, JwtAuthGuard, ES_PUBLICA, RolesGuard, contexto() (+8 more)

### Community 114 - "PRODUCT.md — CircaRuta"
Cohesion: 0.13
Nodes (15): 1. Propósito, 2. Usuarios, 3. Contexto de uso, 4. Tareas clave (por orden de importancia), 5. Voz y tono, 7. Gestión del proyecto, 8. Evidencia y supuestos, 9. Cómo saber si funciona `[POR CONFIRMAR metas]` (+7 more)

### Community 116 - "SPEC.md — Slice 01: Cuenta + Registro de cafeína"
Cohesion: 0.18
Nodes (8): 10. Pruebas, 11. Estado y Definición de terminado, 1. Objetivo, 2. Alcance, 3. Convenciones, 8. Pantallas y rutas (Angular), 9. Errores, SPEC.md — Slice 01: Cuenta + Registro de cafeína

### Community 119 - ".crearAptitud"
Cohesion: 0.10
Nodes (3): AptitudController, CrearAptitudDto, ConsultarDespachoResponse

### Community 120 - "sync.controller.ts"
Cohesion: 0.16
Nodes (10): SyncHandlerRegistry, UnknownSyncHandlerError, FakeHandler, DiarioSyncHandler, SYNC_DOMAIN_IDEMPOTENCY, SyncDomainIdempotency, SyncHandlerResult, SyncIdentity (+2 more)

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.18
Nodes (8): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie

### Community 122 - "plataforma.module.ts"
Cohesion: 0.09
Nodes (6): AreasController, AreasService, AuthModule, CuentaController, UsuariosService, AreaDto

### Community 123 - "RegistroDto"
Cohesion: 0.12
Nodes (4): RegistroDto, RegistroService, RegistroDto, argon2

### Community 125 - "1. Respaldos"
Cohesion: 0.29
Nodes (6): 1. Respaldos, 2. Monitoreo, 3. Pendientes humanos, Backups y monitoreo del piloto, Respaldo diario, Restaurar staging tras un incidente

### Community 126 - "6. Restricciones"
Cohesion: 0.40
Nodes (5): 6. Restricciones, Accesibilidad, Calendario, Privacidad, Técnicas

### Community 127 - "sync-queue.ts"
Cohesion: 0.29
Nodes (8): filtrarColaPorUsuario(), MAX_QUEUE_RETRIES, QueueOperation, ReconcileQueueResult, reconciliarColaSincronizacion(), RejectedOperation, ServerBatchResponse, ServerOperationResult

### Community 128 - "notificaciones.service.ts"
Cohesion: 0.12
Nodes (7): NotificacionesModule, NotificacionesService, TurnoAsignadoNotificacionListener, TurnoAsignadoEvento, @nestjs/config, @nestjs/schedule, web-push

### Community 129 - "ngsw-config.spec.ts"
Cohesion: 0.25
Nodes (4): CompiledNgswJson, config, DataGroup, NgswConfig

### Community 130 - "lww-policy.ts"
Cohesion: 0.39
Nodes (6): LwwComparisonInput, LwwResolutionAction, LwwResolutionResult, parseTimestamp(), resolverConflictoLww(), sonPayloadsEquivalentes()

### Community 131 - "AuthService"
Cohesion: 0.18
Nodes (7): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), AuthService, RefrescoPayload, AuthTokens

### Community 132 - "ColorSemaforo"
Cohesion: 0.10
Nodes (18): FilaAptitud, EvaluacionDespacho, IAptitud, MotivoAptitud, ColorSemaforo, ResultadoAptitudPresalida, Contexto, Dependencias (+10 more)

### Community 133 - "UsuariosAdminController"
Cohesion: 0.09
Nodes (10): ActualizarUsuarioAdminDto, UsuariosAdminController, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioAdminDto, UsuarioDto, Paginado (+2 more)

### Community 134 - "domain/src/aptitud.ts"
Cohesion: 0.21
Nodes (11): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base (+3 more)

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 136 - "Despliegue a produccion (dom 22 nov 2026)"
Cohesion: 0.24
Nodes (10): 10. Flujo Git y validación pre-PR, Arquitectura de produccion, Calendario, Despliegue a produccion (dom 22 nov 2026), Ensayo (vie 20 nov), Migraciones, Paso a paso del dia (👤), Rollback (+2 more)

### Community 137 - "4. Vertical slices (dueños de código)"
Cohesion: 0.22
Nodes (5): 4. Vertical slices (dueños de código), Prueba de restauracion (una vez por semana), 0. Cómo usar este documento, 4. Catálogos, 5. Modelo de datos

### Community 138 - "cronotipo.service.ts"
Cohesion: 0.21
Nodes (6): Pregunta, RmeqComponent, RespuestasRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

### Community 139 - "exportacion.service.ts"
Cohesion: 0.14
Nodes (12): aCsv(), celda(), COLUMNAS_SQL, FilaExportacion, FORMATO, filas(), CODIGOS_INDICADOR, ColumnaExportacion (+4 more)

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 144 - "outbox.service.ts"
Cohesion: 0.26
Nodes (13): decodificarJwt(), EnqueueOutboxInput, crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), OPERACION, SYNC_TRANSPORT_TOKEN (+5 more)

### Community 146 - "planes.service.ts"
Cohesion: 0.12
Nodes (10): PlanDiario, CronotipoService, aFecha(), aIso(), diaIso(), PlanesService, TurnoParaPlan, TurnoAsignadoListener (+2 more)

### Community 148 - "operaciones.service.ts"
Cohesion: 0.08
Nodes (7): AptitudService, calcularHorasSuenoEnVentana(), ActualizarTurnoDto, ConfirmarTurnoDto, CrearTurnoDto, GESTIONAN_TURNOS, OperacionesService

### Community 150 - "Smoke test del piloto (v0.9.0-piloto)"
Cohesion: 0.22
Nodes (8): 0. Previo, 1. Instalacion, 2. Recorrido (RF01 → RF11), 3. Offline (RNF03), 4. Notificaciones (RF10), 5. Seguridad minima, Resultado y release, Smoke test del piloto (v0.9.0-piloto)

### Community 152 - "enums.ts"
Cohesion: 0.33
Nodes (5): CategoriaCronotipo, ColorAptitud, EstadoConfirmacion, EstadoUsuario, Rol

### Community 158 - "pwa-e2e/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 163 - "6. Historias de usuario y criterios de aceptación"
Cohesion: 0.33
Nodes (6): 6. Historias de usuario y criterios de aceptación, HU-01 · Crear cuenta (I1, existente), HU-02 · Iniciar y cerrar sesión (I1, existente), HU-03 · Registrar consumo (`/cafeina/nuevo`), HU-04 · Ver mi consumo (`/cafeina`, pestaña Cafeína), HU-05 · Eliminar un registro

### Community 166 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.05
Nodes (23): Prisma__RutaClient, IndicadoresController, AdherenciaRow, CafeinaRow, DescansoRow, IndicadoresPanelData, IndicadoresService, UniqueUserRow (+15 more)

### Community 170 - "seed.ts"
Cohesion: 0.47
Nodes (4): PrismaClient, AREAS, sembrarIdentidad(), @prisma/adapter-pg

### Community 175 - "paginas-auth.spec.ts"
Cohesion: 0.15
Nodes (5): ConsentimientoComponent, IngresarComponent, escribir(), obtener(), RegistroComponent

## Knowledge Gaps
- **65 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1802 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0136986301369863 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `notificaciones.service.ts`, `trabajador.module.ts`, `modulos/cafeina/cafeina.service.ts`, `AuthService`, `contracts/src/index.ts`, `modulos/indicadores/indicadores.service.ts`, `Auditable`, `exportacion.service.ts`, `UsuarioJwtPayload`, `planes.service.ts`, `auth.controller.ts`, `operaciones.service.ts`, `salud.controller.ts`, `app.module.ts`, `sync.controller.ts`, `plataforma.module.ts`, `RegistroDto`, `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.018518518518518517 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `aptitud.component.ts` to `@angular/core`, `sesion.service.ts`, `diario/diario.service.ts`, `paginas/cafeina/cafeina.service.ts`, `diario.component.ts`, `paginas-auth.spec.ts`, `@angular/router`, `outbox.service.ts`, `indicadores.component.ts`, `offline/offline-store.service.ts`, `domain/src/index.ts`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._