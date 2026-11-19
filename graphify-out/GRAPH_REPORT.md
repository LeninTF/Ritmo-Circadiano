# Graph Report - Ritmo-Circadiano  (2026-11-19)

## Corpus Check
- 357 files · ~176,484 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 26 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 5)

## Summary
- 2424 nodes · 5232 edges · 171 communities (122 shown, 49 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e821ae30`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .obtenerPanel
- sync.module.ts
- rmeq.ts
- AuthService
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
- AptitudService
- operaciones.controller.ts
- modulos/cafeina/cafeina.service.ts
- CLAUDE.md — CircaRuta (Transporte Cueva S.A.C.)
- compilerOptions
- development
- api-e2e/project.json
- turnos.component.ts
- Despliegue a produccion (dom 22 nov 2026)
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
- ubicacion.service.ts
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
- plataforma.module.ts
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
- circadiano.spec.ts
- typecheck
- circadiano.ts
- CrearIngestaCafeinaBodyDto
- ColorSemaforo
- test
- salud.controller.ts
- configurations
- paginas/cafeina/cafeina.service.ts
- paginas/cafeina/cafeina.service.ts
- outbox.service.spec.ts
- CircadianoController
- Staging del piloto
- modulos/indicadores/indicadores.service.ts
- diario/diario.service.ts
- CrearUbicacionDto
- MASTER — CircaRuta (Transporte Cueva S.A.C.)
- App
- ConfirmarTurnoDto
- OutboxService
- ExportacionController
- CafeinaService
- pwa-e2e/project.json
- optimization
- README.md
- UsuarioEliminadoTrabajadorListener
- domain/src/aptitud.ts
- UsuarioJwtPayload
- ProximoTurnoComponent
- Auditoría de release — 2026-10-25
- IndicadoresComponent
- SPEC.md — Slice 01: Cuenta + Registro de cafeína
- DiarioController
- .listar
- .crearAptitud
- navegacion-rol.ts
- offline/offline-store.service.ts
- PRODUCT.md — CircaRuta
- contracts/src/index.ts
- CrearUbicacionDto
- 1. Respaldos
- PlanService
- sync-queue.ts
- IConnectivityProvider
- ngsw-config.spec.ts
- lww-policy.ts
- AuthService
- AptitudComponent
- CrearPerfilCronotipoDto
- turnos.component.spec.ts
- contracts/tsconfig.spec.json
- LoginDto
- CafeinaController
- @angular/core
- exportacion.service.ts
- Escaneo OWASP ZAP baseline: 23 oct 2026
- backup-bd.sh
- restaurar-bd.sh
- CrearAptitudDto
- PlanHoyComponent
- PlanDiarioDto
- exportacion.ts
- UsuarioEliminadoCafeinaListener
- RefrescarTokenDto
- Smoke test del piloto (v0.9.0-piloto)
- Tareas: Sistema de diseño PWA
- registro.component.ts
- mi-consumo.component.spec.ts
- Entorno
- UsuarioEliminadoCircadianoListener
- IndicadoresController
- pwa-e2e/tsconfig.json
- UsuarioEliminadoOperacionesListener
- assertKAnonymity
- RegistroDto
- PlataformaComponent
- Cuentas de prueba por rol (solo local y staging)
- ConsultaDiarioFiltroDto
- app.module.ts
- soporte.ts
- identidad.ts
- domain/src/index.ts
- RefrescarTokenDto
- 6. Restricciones

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 96 edges
2. `@angular/core` - 85 edges
3. `PrismaService` - 68 edges
4. `@angular/common` - 47 edges
5. `OfflineStoreService` - 44 edges
6. `UsuarioJwtPayload` - 44 edges
7. `Roles()` - 37 edges
8. `UsuarioActual` - 35 edges
9. `@nestjs/swagger` - 35 edges
10. `@angular/router` - 33 edges

## Surprising Connections (you probably didn't know these)
- `7. Offline (RNF03)` --references--> `OutboxService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/core/offline/outbox.service.ts
- `Fase 2 — Componentes compartidos (dueño I4)` --references--> `ColorSemaforo`  [INFERRED]
  tasks/plan.md → libs/contracts/src/semaforo.ts
- `Fase 2 — Componentes compartidos` --references--> `ColorSemaforo`  [INFERRED]
  tasks/todo.md → libs/contracts/src/semaforo.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Communities (171 total, 49 thin omitted)

### Community 1 - "sync.module.ts"
Cohesion: 0.06
Nodes (26): IngestaSyncHandler, SyncController, SyncHandlerRegistry, UnknownSyncHandlerError, SyncModule, InvalidSyncBatchError, FakeHandler, SyncOrchestratorService (+18 more)

### Community 2 - "rmeq.ts"
Cohesion: 0.26
Nodes (6): Pregunta, RmeqComponent, RespuestasRmeq, clasificarCronotipo(), clasificarCronotipoDesdeRespuestas(), sumarRespuestasRmeq()

### Community 3 - "AuthService"
Cohesion: 0.18
Nodes (5): RegistroService, AuthService, RegistroDto, UsuarioDto, argon2

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
Cohesion: 0.11
Nodes (30): CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO, HORA_INICIO_NOCTURNO (+22 more)

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
Cohesion: 0.11
Nodes (8): GuiaInstalacionIosComponent, AnfitrionComponent, PushService, ResultadoSuscripcion, RUTA_POR_TIPO, AVISO_PUSH, PlanComponent, @angular/service-worker

### Community 19 - "AptitudService"
Cohesion: 0.12
Nodes (4): AptitudService, calcularHorasSuenoEnVentana(), TurnoAsignadoListener, TurnoAsignadoEvento

### Community 21 - "operaciones.controller.ts"
Cohesion: 0.11
Nodes (4): ActualizarTurnoDto, ConsultarTurnosDto, CrearTurnoDto, GESTIONAN_TURNOS

### Community 22 - "modulos/cafeina/cafeina.service.ts"
Cohesion: 0.10
Nodes (12): CafeinaService, HistorialService, NotificacionesService, DIARIO_REPOSITORY, DiarioService, IDiarioRepository, FakeDiarioRepository, TurnoAsignadoNotificacionListener (+4 more)

### Community 23 - "CLAUDE.md — CircaRuta (Transporte Cueva S.A.C.)"
Cohesion: 0.15
Nodes (12): Estado, 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos (+4 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.14
Nodes (13): dependsOn, executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests (+5 more)

### Community 27 - "turnos.component.ts"
Cohesion: 0.08
Nodes (15): ExcesoJornada, NOMBRES_DIA, TurnosComponent, rangoTurnoLima(), semanaDe(), sumarDias(), parametros(), TurnosService (+7 more)

### Community 28 - "Despliegue a produccion (dom 22 nov 2026)"
Cohesion: 0.24
Nodes (10): 10. Flujo Git y validación pre-PR, Arquitectura de produccion, Calendario, Despliegue a produccion (dom 22 nov 2026), Ensayo (vie 20 nov), Migraciones, Paso a paso del dia (👤), Rollback (+2 more)

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
Cohesion: 0.12
Nodes (10): PreferenciaTema, Tema, decodificarJwt(), estaVigente(), PayloadJwt, SesionService, TokensGuardados, MenuCuentaComponent (+2 more)

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
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 42 - "sync-lote.dto.ts"
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
Cohesion: 0.14
Nodes (14): autenticadoGuard(), rolGuard(), estado, ruta, ConsentimientoComponent, ESTILOS_FORMULARIO, consentimientoGuard(), FlujoRegistroService (+6 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.40
Nodes (4): assetGroups, dataGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 56 - "ubicacion.service.ts"
Cohesion: 0.29
Nodes (4): UbicacionService, EventoSolarDto, SedeEmpresa, ZONA_HORARIA_EMPRESA

### Community 57 - ".guardarSuscripcion"
Cohesion: 0.11
Nodes (4): NotificacionesController, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

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
Cohesion: 0.04
Nodes (55): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+47 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "parametros.controller.ts"
Cohesion: 0.10
Nodes (4): ActualizarParametroDto, ParametrosController, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "trabajador.module.ts"
Cohesion: 0.17
Nodes (3): aRespuesta(), PrismaDiarioRepository, CrearActualizarDiarioDto

### Community 65 - "plan-hoy.component.ts"
Cohesion: 0.13
Nodes (9): ChipComponent, AnfitrionComponent, MicroTarjetaComponent, ALTURA_BARRA, dentro(), FORMATO_HORA, TipoBarra, tipoDeHora() (+1 more)

### Community 66 - "@nestjs/common"
Cohesion: 0.10
Nodes (15): CronotipoService, PlanesService, TurnoParaPlan, OperacionesService, rangoFechas(), ParametroEditable, PARAMETROS_EDITABLES, ParametrosService (+7 more)

### Community 67 - "2. Usuarios"
Cohesion: 0.67
Nodes (3): 2. Usuarios, Usuario principal: conductor (rol `trabajador`), Usuarios secundarios

### Community 68 - "cafeina.ts"
Cohesion: 0.16
Nodes (21): 9. Convenciones de nomenclatura, ResidualCafeinaRespuestaDto, CafeinaActiva, calcularCafeinaActiva(), calcularHoraCorte(), ConsumoDia, residual(), resolverSemivida() (+13 more)

### Community 69 - "plataforma.module.ts"
Cohesion: 0.08
Nodes (8): AuditInterceptor, Rutas, Auditable, OpcionesAuditoria, AuthModule, CuentaController, UsuariosAdminController, UsuariosService

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "aptitud.component.ts"
Cohesion: 0.08
Nodes (16): ESTADOS, SemaforoAptitudComponent, IdPaso, MENSAJE_POR_ESTADO, Paso, PASOS, TEXTO_MOTIVO, AptitudService (+8 more)

### Community 72 - "UsuariosService"
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

### Community 81 - "circadiano.spec.ts"
Cohesion: 0.11
Nodes (13): ConfiguracionMotor, ParametrosTurno, CFG, SOLAR_ICA, TURNO_DIURNO, TURNO_NOCTURNO, DESFASE_LIMA_H, VERSION_ALGORITMO_PLAN (+5 more)

### Community 82 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 83 - "circadiano.ts"
Cohesion: 0.22
Nodes (17): calcularPlanLocal(), addH(), addMin(), aIso(), aPlanDiarioDto(), calcularCorteCafeina(), DELTA_CRONOTIPO_MIN, derivarRecordatorios() (+9 more)

### Community 84 - "CrearIngestaCafeinaBodyDto"
Cohesion: 0.12
Nodes (3): ConsultarHistorialDto, HistorialController, HistorialRespuestaDto

### Community 85 - "ColorSemaforo"
Cohesion: 0.26
Nodes (8): FilaAptitud, CrearAptitudRequest, CrearAptitudResponse, EvaluacionDespacho, IAptitud, MotivoAptitud, ColorSemaforo, ResultadoAptitudPresalida

### Community 86 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 87 - "salud.controller.ts"
Cohesion: 0.08
Nodes (9): AreasController, AreasService, Publica(), PrismaHealthIndicator, SaludController, SaludModule, AreaDto, @nestjs/terminus (+1 more)

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.12
Nodes (7): CafeinaComponent, Icono, ICONOS, BEBIDAS, errorRegistro(), RegistroCafeina, BebidaDto

### Community 90 - "paginas/cafeina/cafeina.service.ts"
Cohesion: 0.16
Nodes (15): aFechaReciente(), aItemLocal(), esperarConTope(), fechaLima(), FORMATO_HORA, IngestaLocal, IngestaLocalConFecha, MiConsumo (+7 more)

### Community 94 - "outbox.service.spec.ts"
Cohesion: 0.12
Nodes (21): CONNECTIVITY_PROVIDER_TOKEN, CLOCK_TOKEN, IClock, IOutboxRetryScheduler, OUTBOX_RETRY_POLICY_TOKEN, OUTBOX_RETRY_SCHEDULER_TOKEN, OutboxRetryPolicy, EnqueueOutboxInput (+13 more)

### Community 95 - "CircadianoController"
Cohesion: 0.17
Nodes (4): CircadianoController, GenerarPlanDto, PerfilCronotipoDto, GenerarPlanDto

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "modulos/indicadores/indicadores.service.ts"
Cohesion: 0.22
Nodes (6): AdherenciaRow, CafeinaRow, DescansoRow, IndicadoresPanelData, IndicadoresService, UniqueUserRow

### Community 98 - "diario/diario.service.ts"
Cohesion: 0.17
Nodes (7): DiarioComponent, aPayloadDiario(), DiarioService, EstadoGuardadoDiario, FormularioDiario, FORMULARIO, DiarioSyncPayload

### Community 99 - "CrearUbicacionDto"
Cohesion: 0.22
Nodes (8): Contexto, Dependencias, Fase 1 — Fundamentos, Fase 2 — Componentes compartidos (dueño I4), Fase 3 — Pantallas (en paralelo tras Checkpoint 2), Plan: Sistema de diseño del Figma en la PWA, Preguntas abiertas, Riesgos

### Community 100 - "MASTER — CircaRuta (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (12): 1. Principios, 2. Referencias y qué tomamos de cada una, 3.1 Tema claro (igual a §14, con dos correcciones de contraste), 3.2 Modo nocturno de bajo brillo **Δ §14**, 3. Color, 4. Tipografía, 5. Espaciado, forma y tamaño táctil, 6. Patrones clave (+4 more)

### Community 101 - "App"
Cohesion: 0.25
Nodes (3): App, appConfig, @angular/platform-browser

### Community 107 - "pwa-e2e/project.json"
Cohesion: 0.14
Nodes (14): executor, options, implicitDependencies, name, command, projectType, $schema, sourceRoot (+6 more)

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 111 - "domain/src/aptitud.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 112 - "UsuarioJwtPayload"
Cohesion: 0.09
Nodes (26): MockDelegado, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), ConsultaAptitud, USUARIOS, tokens (+18 more)

### Community 114 - "Auditoría de release — 2026-10-25"
Cohesion: 0.25
Nodes (7): 1. Módulos y dueños, 3. Verificación técnica, 5–6. Operaciones Notion aplicadas, Auditoría de release — 2026-10-25, Deuda técnica transversal, Pendientes manuales, Resumen ejecutivo

### Community 116 - "SPEC.md — Slice 01: Cuenta + Registro de cafeína"
Cohesion: 0.18
Nodes (11): 0. Cómo usar este documento, 10. Pruebas, 11. Estado y Definición de terminado, 1. Objetivo, 2. Alcance, 3. Convenciones, 4. Catálogos, 5. Modelo de datos (+3 more)

### Community 120 - "navegacion-rol.ts"
Cohesion: 0.29
Nodes (6): IconoPestana, INICIO_POR_ROL, Pestana, PESTANAS_POR_ROL, PESTANAS_TRABAJADOR, pestanasDe()

### Community 121 - "offline/offline-store.service.ts"
Cohesion: 0.17
Nodes (9): DEFAULT_DB_NAME, DexieDb, DEXIE_DB_TOKEN, MockSessionProvider, SesionPrueba, ISessionProvider, SESSION_PROVIDER_TOKEN, dexie (+1 more)

### Community 122 - "PRODUCT.md — CircaRuta"
Cohesion: 0.17
Nodes (12): 1. Propósito, 3. Contexto de uso, 4. Tareas clave (por orden de importancia), 5. Voz y tono, 7. Gestión del proyecto, 8. Evidencia y supuestos, 9. Cómo saber si funciona `[POR CONFIRMAR metas]`, Evidence on Hand (+4 more)

### Community 123 - "contracts/src/index.ts"
Cohesion: 0.15
Nodes (8): PruebaController, Roles(), UsuarioActual, UsuarioJwtPayload, ErrorApiDto, class-transformer, class-validator, @nestjs/swagger

### Community 124 - "CrearUbicacionDto"
Cohesion: 0.18
Nodes (4): CrearUbicacionDto, GeoService, CrearUbicacionDto, UbicacionDto

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

### Community 135 - "contracts/tsconfig.spec.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, outDir, types, extends, include, ./tsconfig.json

### Community 137 - "CafeinaController"
Cohesion: 0.07
Nodes (6): CafeinaController, ConsultarResumenCafeinaDto, CrearIngestaCafeinaBodyDto, 1. Arquitectura y SOLID, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto

### Community 138 - "@angular/core"
Cohesion: 0.17
Nodes (12): appRoutes, authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, AdminParametrosComponent, NOMBRE_CATEGORIA (+4 more)

### Community 139 - "exportacion.service.ts"
Cohesion: 0.24
Nodes (7): aCsv(), celda(), COLUMNAS_SQL, FilaExportacion, FORMATO, filas(), generalizarCuasiIdentificador()

### Community 140 - "Escaneo OWASP ZAP baseline: 23 oct 2026"
Cohesion: 0.40
Nodes (4): API: `https://ritmo-circadiano.onrender.com`, Escaneo OWASP ZAP baseline: 23 oct 2026, Pendiente, PWA: `https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev`

### Community 146 - "PlanDiarioDto"
Cohesion: 0.14
Nodes (13): aFecha(), aIso(), diaIso(), 4. Vertical slices (dueños de código), CategoriaCronotipo, EVENTO_PLAN_GENERADO, PlanDiarioDto, RecordatorioDelPlan (+5 more)

### Community 147 - "exportacion.ts"
Cohesion: 0.33
Nodes (5): CODIGOS_INDICADOR, ColumnaExportacion, COLUMNAS_EXPORTACION, FaseEvaluacion, FASES_EVALUACION

### Community 150 - "Smoke test del piloto (v0.9.0-piloto)"
Cohesion: 0.22
Nodes (8): 0. Previo, 1. Instalacion, 2. Recorrido (RF01 → RF11), 3. Offline (RNF03), 4. Notificaciones (RF10), 5. Seguridad minima, Resultado y release, Smoke test del piloto (v0.9.0-piloto)

### Community 151 - "Tareas: Sistema de diseño PWA"
Cohesion: 0.40
Nodes (4): Fase 1 — Fundamentos, Fase 2 — Componentes compartidos, Fase 3 — Pantallas, Tareas: Sistema de diseño PWA

### Community 152 - "registro.component.ts"
Cohesion: 0.14
Nodes (7): CARGOS, MENSAJES, RANGOS_EDAD, RegistroComponent, SEXOS, AnfitrionComponent, TarjetaComponent

### Community 153 - "mi-consumo.component.spec.ts"
Cohesion: 0.40
Nodes (5): resumenLocal(), AHORA, conConsumo(), EN_COLA, ENVIADO

### Community 158 - "pwa-e2e/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 160 - "assertKAnonymity"
Cohesion: 0.50
Nodes (3): 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), 2–4. Matriz de requerimientos y diagnóstico, assertKAnonymity()

### Community 163 - "Cuentas de prueba por rol (solo local y staging)"
Cohesion: 0.50
Nodes (3): Cuentas de prueba por rol (solo local y staging), Permisos esperados (verificados contra la API), Staging (Render)

### Community 166 - "app.module.ts"
Cohesion: 0.10
Nodes (12): AptitudModule, BebidasController, CafeinaModule, CircadianoModule, HistorialModule, IndicadoresModule, NotificacionesModule, OperacionesModule (+4 more)

### Community 167 - "soporte.ts"
Cohesion: 0.20
Nodes (12): contarOutbox(), crearCuentaEIngresar(), generarFechasLima(), leerOutbox(), obtenerAccessToken(), OperacionOutbox, claveDe(), correoDe() (+4 more)

### Community 171 - "identidad.ts"
Cohesion: 0.19
Nodes (11): AREAS, crearSiNoExiste(), CuentaDemo, CUENTAS_DEMO, Rol, sembrarAdministrador(), sembrarCuentasDemo(), sembrarIdentidad() (+3 more)

### Community 174 - "domain/src/index.ts"
Cohesion: 0.14
Nodes (13): OrigenPlan, planServidor, turno, TURNO, EstadoVistaTurno, MENSAJE_POR_ESTADO, ProximoTurnoService, ConfirmacionTurnoPayload (+5 more)

### Community 177 - "RefrescarTokenDto"
Cohesion: 0.16
Nodes (7): ActualizarUsuarioAdminDto, ActualizarUsuarioAdminDto, ESTADOS_USUARIO, EstadoUsuario, UsuarioAdminDto, Rol, ROLES

### Community 179 - "6. Restricciones"
Cohesion: 0.40
Nodes (5): 6. Restricciones, Accesibilidad, Calendario, Privacidad, Técnicas

## Knowledge Gaps
- **66 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@angular/core` connect `@angular/core` to `paginas/cafeina/cafeina.service.ts`, `plan-hoy.component.ts`, `sesion.service.ts`, `mi-consumo.component.spec.ts`, `diario/diario.service.ts`, `turnos.component.spec.ts`, `aptitud.component.ts`, `UsuariosService`, `sync-lote.dto.ts`, `domain/src/index.ts`, `@angular/router`, `@angular/core`, `registro.component.ts`, `offline/offline-store.service.ts`, `paginas/cafeina/cafeina.service.ts`, `turnos.component.ts`, `package.json`, `outbox.service.spec.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sync.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060041407867494824 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `sync.module.ts`, `modulos/indicadores/indicadores.service.ts`, `AuthService`, `api/src/main.ts`, `plataforma.module.ts`, `app.module.ts`, `exportacion.service.ts`, `UsuarioJwtPayload`, `operaciones.controller.ts`, `modulos/cafeina/cafeina.service.ts`, `salud.controller.ts`, `ubicacion.service.ts`, `contracts/src/index.ts`, `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `SPEC.md — Slice 01: Cuenta + Registro de cafeína` connect `SPEC.md — Slice 01: Cuenta + Registro de cafeína` to `6. Historias de usuario y criterios de aceptación`, `SPEC.md`, `cafeina.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._