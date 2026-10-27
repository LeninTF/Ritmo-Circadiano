# Graph Report - wt74  (2026-10-27)

## Corpus Check
- 342 files · ~168,891 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: (none) 11, .prisma 6, .scss 5)

## Summary
- 2343 nodes · 4995 edges · 156 communities (115 shown, 41 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 117 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f1648ef`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- modulos/indicadores/indicadores.service.ts
- @angular/core
- rmeq.ts
- UsuarioDto
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
- plan.component.ts
- Checklist de seguridad RNF04
- CafeinaService
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
- sesion.service.ts
- serve
- pwa/project.json
- api/project.json
- targets
- compilerOptions
- prune-lockfile
- registro-sueno-contrato.spec.ts
- historial.component.ts
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
- Roles
- outbox.service.ts
- NotificacionesController
- overrides
- OfflineStoreService
- devDependencies
- package.json
- Constraints
- parametros.controller.ts
- CrearActualizarDiarioDto
- plan-hoy.component.ts
- @nestjs/common
- 2. Usuarios
- cafeina.ts
- plataforma.module.ts
- compilerOptions
- aptitud.component.ts
- mi-consumo.component.ts
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
- .getMe
- ColorSemaforo
- test
- salud.controller.ts
- configurations
- cafeina.component.ts
- paginas/cafeina/cafeina.service.ts
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- sync-orchestrator.service.ts
- diario/diario.service.ts
- Plan: Sistema de diseño del Figma en la PWA
- ExportacionController
- App
- operaciones.controller.ts
- OutboxService
- CrearTurnoDto
- IngestaCafeinaRespuestaDto
- pwa-e2e/project.json
- optimization
- README.md
- contracts/src/index.ts
- TurnosService
- aptitud-cp12.e2e.spec.ts
- ProximoTurnoComponent
- MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)
- indicadores.component.ts
- SPEC.md — Slice 01: Cuenta + Registro de cafeína
- DiarioController
- CafeinaService
- .crearAptitud
- trabajador.module.ts
- offline/offline-store.service.ts
- PRODUCT.md — CircaRuta
- @nestjs/swagger
- mi-consumo.component.spec.ts
- 1. Respaldos
- PlanService
- sync-queue.ts
- AdminParametrosComponent
- ngsw-config.spec.ts
- lww-policy.ts
- AuthService
- domain/src/aptitud.ts
- DespachoAptitudComponent
- contracts/tsconfig.spec.json
- CafeinaController
- plan.ts
- exportacion.service.ts
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- PlanHoyComponent
- PlanDiarioDto
- Smoke test del piloto (v0.9.0-piloto)
- Entorno
- pwa-e2e/tsconfig.json
- UsuarioJwtPayload
- areas.controller.ts
- RegistroDto
- app.module.ts
- @playwright/test
- dotenv
- domain/src/index.ts
- auth.ts
- 6. Restricciones

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 96 edges
2. `@angular/core` - 79 edges
3. `PrismaService` - 68 edges
4. `UsuarioJwtPayload` - 44 edges
5. `@angular/common` - 43 edges
6. `OfflineStoreService` - 40 edges
7. `Roles()` - 36 edges
8. `UsuarioActual` - 35 edges
9. `@nestjs/swagger` - 34 edges
10. `CafeinaService` - 31 edges

## Surprising Connections (you probably didn't know these)
- `7. Offline (RNF03)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts
- `Fase 2 — Componentes compartidos (dueño I4)` --references--> `ColorSemaforo`  [INFERRED]
  tasks/plan.md → libs/contracts/src/semaforo.ts
- `Fase 2 — Componentes compartidos` --references--> `ColorSemaforo`  [INFERRED]
  tasks/todo.md → libs/contracts/src/semaforo.ts
- `Resultado` --references--> `validarEntorno()`  [INFERRED]
  docs/seguridad-rnf04.md → apps/api/src/config/entorno.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (156 total, 41 thin omitted)

### Community 0 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.10
Nodes (8): IndicadoresController, AdherenciaRow, CafeinaRow, DescansoRow, IndicadoresPanelData, IndicadoresService, UniqueUserRow, RespuestaAgregada

### Community 1 - "@angular/core"
Cohesion: 0.16
Nodes (15): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, fechaLocal(), AHORA, NOMBRE_CATEGORIA (+7 more)

### Community 2 - "rmeq.ts"
Cohesion: 0.15
Nodes (7): CrearPerfilCronotipoDto, Pregunta, RmeqComponent, RespuestasRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

### Community 4 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/platform-express

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+25 more)

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
Cohesion: 0.13
Nodes (28): CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, DESFASE_LIMA_H, HORA_FIN_NOCTURNO (+20 more)

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

### Community 18 - "plan.component.ts"
Cohesion: 0.11
Nodes (8): GuiaInstalacionIosComponent, AnfitrionComponent, PushService, ResultadoSuscripcion, RUTA_POR_TIPO, AVISO_PUSH, PlanComponent, @angular/service-worker

### Community 22 - "CafeinaService"
Cohesion: 0.11
Nodes (11): CafeinaService, HistorialService, NotificacionesService, DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, DiarioRespuestaDto (+3 more)

### Community 23 - "operaciones.service.ts"
Cohesion: 0.11
Nodes (7): TurnoAsignadoListener, ActualizarTurnoDto, OperacionesService, TurnoAsignadoNotificacionListener, TURNO_ASIGNADO, TurnoAsignadoEvento, validarJornadaRN01()

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
Cohesion: 0.05
Nodes (35): Estado, 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack (+27 more)

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
Cohesion: 0.08
Nodes (12): ConsentimientoComponent, IngresarComponent, escribir(), obtener(), RegistroComponent, estaVigente(), PayloadJwt, SesionService (+4 more)

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

### Community 42 - "historial.component.ts"
Cohesion: 0.13
Nodes (8): HistorialComponent, dia, fechaCivil(), HistorialGraficoComponent, HistorialService, PeriodoHistorial, HistorialDiaDto, chart.js

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
Cohesion: 0.12
Nodes (13): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+5 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 56 - "outbox.service.ts"
Cohesion: 0.26
Nodes (13): decodificarJwt(), EnqueueOutboxInput, crearSesionOffline(), crearTransporteSync(), ESTADO_POR_RESULTADO, proveerOffline(), OPERACION, SYNC_TRANSPORT_TOKEN (+5 more)

### Community 57 - "NotificacionesController"
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
Cohesion: 0.03
Nodes (57): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+49 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.10
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "CrearActualizarDiarioDto"
Cohesion: 0.13
Nodes (4): aRespuesta(), PrismaDiarioRepository, ConsultaDiarioFiltroDto, CrearActualizarDiarioDto

### Community 65 - "plan-hoy.component.ts"
Cohesion: 0.13
Nodes (9): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra, tipoDeHora() (+1 more)

### Community 66 - "@nestjs/common"
Cohesion: 0.10
Nodes (16): CronotipoService, PlanesService, TurnoParaPlan, UbicacionService, RefrescoPayload, SECRETO, ParametroEditable, PARAMETROS_EDITABLES (+8 more)

### Community 67 - "2. Usuarios"
Cohesion: 0.67
Nodes (3): 2. Usuarios, Usuario principal: conductor (rol `trabajador`), Usuarios secundarios

### Community 68 - "cafeina.ts"
Cohesion: 0.18
Nodes (20): 4. Vertical slices (dueños de código), CafeinaActiva, calcularCafeinaActiva(), calcularHoraCorte(), ConsumoDia, residual(), resolverSemivida(), resumirConsumoPorDia() (+12 more)

### Community 69 - "plataforma.module.ts"
Cohesion: 0.09
Nodes (8): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, ROLES_PERMITIDOS, CuentaController, UsuariosAdminController, UsuariosService

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "aptitud.component.ts"
Cohesion: 0.09
Nodes (17): AuthService, ESTILOS_FORMULARIO, CARGOS, MENSAJES, RANGOS_EDAD, SEXOS, ESTADOS, SemaforoAptitudComponent (+9 more)

### Community 72 - "mi-consumo.component.ts"
Cohesion: 0.18
Nodes (6): ConsumoItem, horaLima(), mensajeCafeinaActiva(), INICIAL_DIA, MiConsumoComponent, NOMBRE_DIA

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
Cohesion: 0.38
Nodes (3): calcularEventosSolares(), EventosSolares, fechaLima()

### Community 82 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 83 - "circadiano.ts"
Cohesion: 0.10
Nodes (30): calcularPlanLocal(), 9. Convenciones de nomenclatura, CategoriaCronotipo, TipoTurnoPlan, addH(), addMin(), aIso(), aPlanDiarioDto() (+22 more)

### Community 85 - "ColorSemaforo"
Cohesion: 0.21
Nodes (8): FilaAptitud, AptitudService, ConsultarDespachoRequest, CrearAptitudRequest, CrearAptitudResponse, EvaluacionDespacho, IAptitud, ColorSemaforo

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.14
Nodes (4): PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "cafeina.component.ts"
Cohesion: 0.15
Nodes (7): CafeinaComponent, Icono, ICONOS, BEBIDAS, errorRegistro(), RegistroCafeina, BebidaDto

### Community 90 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.21
Nodes (11): aFechaReciente(), esperarConTope(), FORMATO_HORA, IngestaLocal, IngestaLocalConFecha, MiConsumo, AHORA, CAFE (+3 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.10
Nodes (13): CONNECTIVITY_PROVIDER_TOKEN, IConnectivityProvider, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy (+5 more)

### Community 95 - "CircadianoController"
Cohesion: 0.19
Nodes (3): CircadianoController, PerfilCronotipoDto, EventoSolarDto

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "sync-orchestrator.service.ts"
Cohesion: 0.06
Nodes (24): SyncController, SyncHandlerRegistry, UnknownSyncHandlerError, InvalidSyncBatchError, FakeHandler, SyncOrchestratorService, DiarioSyncHandler, SYNC_DOMAIN_IDEMPOTENCY (+16 more)

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.29
Nodes (6): aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 99 - "Plan: Sistema de diseño del Figma en la PWA"
Cohesion: 0.13
Nodes (12): Contexto, Dependencias, Fase 1 — Fundamentos, Fase 2 — Componentes compartidos (dueño I4), Fase 3 — Pantallas (en paralelo tras Checkpoint 2), Plan: Sistema de diseño del Figma en la PWA, Preguntas abiertas, Riesgos (+4 more)

### Community 105 - "IngestaCafeinaRespuestaDto"
Cohesion: 0.39
Nodes (5): 1. Arquitectura y SOLID, CafeinaActivaDto, ConsumoDiaDto, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto

### Community 107 - "pwa-e2e/project.json"
Cohesion: 0.14
Nodes (14): executor, options, implicitDependencies, name, command, projectType, $schema, sourceRoot (+6 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "contracts/src/index.ts"
Cohesion: 0.10
Nodes (8): UsuarioEliminadoCafeinaListener, UsuarioEliminadoCircadianoListener, UsuarioEliminadoOperacionesListener, CAMPOS_ADMIN, UsuarioEliminadoTrabajadorListener, USUARIO_ELIMINADO, UsuarioEliminadoEvento, @nestjs/event-emitter

### Community 111 - "TurnosService"
Cohesion: 0.18
Nodes (7): TurnosService, ActualizarTurnoDto, CrearTurnoDto, EliminarTurnoRespuestaDto, ImportarTurnosRespuestaDto, RutaDto, TurnoDto

### Community 112 - "aptitud-cp12.e2e.spec.ts"
Cohesion: 0.16
Nodes (14): MockDelegado, ConsultaAptitud, USUARIOS, tokens, SECRETO, JwtAuthGuard, RolesGuard, contexto() (+6 more)

### Community 114 - "MASTER — Gestor Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (12): 1. Principios, 2. Referencias y qué tomamos de cada una, 3.1 Tema claro (igual a §14, con dos correcciones de contraste), 3.2 Modo nocturno de bajo brillo **Δ §14**, 3. Color, 4. Tipografía, 5. Espaciado, forma y tamaño táctil, 6. Patrones clave (+4 more)

### Community 116 - "SPEC.md — Slice 01: Cuenta + Registro de cafeína"
Cohesion: 0.18
Nodes (11): 0. Cómo usar este documento, 10. Pruebas, 11. Estado y Definición de terminado, 1. Objetivo, 2. Alcance, 3. Convenciones, 4. Catálogos, 5. Modelo de datos (+3 more)

### Community 118 - "CafeinaService"
Cohesion: 0.28
Nodes (4): aItemLocal(), CafeinaService, fechaLima(), ordenarRecientes()

### Community 119 - ".crearAptitud"
Cohesion: 0.13
Nodes (3): AptitudController, AptitudService, ConsultarDespachoResponse

### Community 120 - "trabajador.module.ts"
Cohesion: 0.14
Nodes (6): BebidasController, CafeinaModule, IngestaSyncHandler, NotificacionesModule, PlataformaModule, TrabajadorModule

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.18
Nodes (8): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie

### Community 122 - "PRODUCT.md — CircaRuta"
Cohesion: 0.17
Nodes (12): 1. Propósito, 3. Contexto de uso, 4. Tareas clave (por orden de importancia), 5. Voz y tono, 7. Gestión del proyecto, 8. Evidencia y supuestos, 9. Cómo saber si funciona `[POR CONFIRMAR metas]`, Evidence on Hand (+4 more)

### Community 123 - "@nestjs/swagger"
Cohesion: 0.20
Nodes (4): ResidualCafeinaRespuestaDto, class-transformer, class-validator, @nestjs/swagger

### Community 124 - "mi-consumo.component.spec.ts"
Cohesion: 0.40
Nodes (5): resumenLocal(), AHORA, conConsumo(), EN_COLA, ENVIADO

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

### Community 132 - "domain/src/aptitud.ts"
Cohesion: 0.07
Nodes (14): CrearAptitudDto, calcularHorasSuenoEnVentana(), AptitudComponent, mensajeError(), MotivoAptitud, AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador() (+6 more)

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 137 - "CafeinaController"
Cohesion: 0.08
Nodes (3): CafeinaController, ConsultarResumenCafeinaDto, CrearIngestaCafeinaBodyDto

### Community 138 - "plan.ts"
Cohesion: 0.10
Nodes (10): CrearUbicacionDto, GenerarPlanDto, GeoService, CrearUbicacionDto, GenerarPlanDto, RecordatorioDelPlan, SedeEmpresa, TipoRecordatorioPlan (+2 more)

### Community 139 - "exportacion.service.ts"
Cohesion: 0.13
Nodes (13): aCsv(), celda(), COLUMNAS_SQL, ExportacionService, FilaExportacion, FORMATO, filas(), CODIGOS_INDICADOR (+5 more)

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 146 - "PlanDiarioDto"
Cohesion: 0.23
Nodes (5): aFecha(), aIso(), diaIso(), PlanDiarioDto, IngestaCafeina

### Community 150 - "Smoke test del piloto (v0.9.0-piloto)"
Cohesion: 0.22
Nodes (8): 0. Previo, 1. Instalacion, 2. Recorrido (RF01 → RF11), 3. Offline (RNF03), 4. Notificaciones (RF10), 5. Seguridad minima, Resultado y release, Smoke test del piloto (v0.9.0-piloto)

### Community 158 - "pwa-e2e/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 159 - "UsuarioJwtPayload"
Cohesion: 0.18
Nodes (8): PruebaController, AuthModule, ES_PUBLICA, SolicitudAutenticada, UsuarioActual, UsuarioJwtPayload, CODIGOS_ERROR, ErrorApiDto

### Community 160 - "areas.controller.ts"
Cohesion: 0.19
Nodes (4): AreasController, AreasService, Publica(), AreaDto

### Community 166 - "app.module.ts"
Cohesion: 0.11
Nodes (12): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), AptitudModule, CircadianoModule, HistorialModule, IndicadoresModule (+4 more)

### Community 174 - "domain/src/index.ts"
Cohesion: 0.13
Nodes (13): OrigenPlan, planServidor, turno, TURNO, EstadoVistaTurno, MENSAJE_POR_ESTADO, ProximoTurnoService, ConfirmacionTurnoPayload (+5 more)

### Community 177 - "auth.ts"
Cohesion: 0.06
Nodes (11): LoginDto, RefrescarTokenDto, ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, LoginDto, RefrescarTokenDto (+3 more)

### Community 179 - "6. Restricciones"
Cohesion: 0.40
Nodes (5): 6. Restricciones, Accesibilidad, Calendario, Privacidad, Técnicas

## Knowledge Gaps
- **66 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1101 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `cafeina.component.ts`, `plan-hoy.component.ts`, `sesion.service.ts`, `diario/diario.service.ts`, `aptitud.component.ts`, `mi-consumo.component.ts`, `historial.component.ts`, `domain/src/index.ts`, `@angular/router`, `plan.component.ts`, `indicadores.component.ts`, `outbox.service.ts`, `offline/offline-store.service.ts`, `paginas/cafeina/cafeina.service.ts`, `mi-consumo.component.spec.ts`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `modulos/indicadores/indicadores.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `modulos/indicadores/indicadores.service.ts`, `areas.controller.ts`, `sync-orchestrator.service.ts`, `CrearActualizarDiarioDto`, `api/src/main.ts`, `plataforma.module.ts`, `app.module.ts`, `operaciones.controller.ts`, `exportacion.service.ts`, `contracts/src/index.ts`, `aptitud-cp12.e2e.spec.ts`, `CafeinaService`, `operaciones.service.ts`, `trabajador.module.ts`, `salud.controller.ts`, `@nestjs/swagger`, `package.json`, `UsuarioJwtPayload`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `@nestjs/common` to `modulos/indicadores/indicadores.service.ts`, `areas.controller.ts`, `CrearActualizarDiarioDto`, `AuthService`, `UsuarioDto`, `plataforma.module.ts`, `app.module.ts`, `IngestaCafeinaRespuestaDto`, `exportacion.service.ts`, `contracts/src/index.ts`, `aptitud-cp12.e2e.spec.ts`, `CafeinaService`, `operaciones.service.ts`, `salud.controller.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._