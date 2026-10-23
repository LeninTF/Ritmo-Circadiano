# Graph Report - Ritmo-Circadiano  (2026-10-23)

## Corpus Check
- 207 files · ~86,502 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 23 file(s) not represented in the graph (top: (none) 10, .prisma 6, .scss 2)

## Summary
- 2061 nodes · 3092 edges · 124 communities (88 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2d02c52`
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
- auth.controller.e2e.spec.ts
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
- CrearTurnoDto
- cafeina.service.ts
- EncolarNotificacionDto
- overrides
- .obtenerPanel
- devDependencies
- package.json
- Constraints
- ParametrosController
- audit.interceptor.ts
- indicadores.component.ts
- auth.module.ts
- Prisma__TurnoLaboralClient
- cafeina.ts
- NotificacionesService
- compilerOptions
- app.routes.ts
- IngresarComponent
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
- registro.component.ts
- configurations
- auth.interceptor.ts
- client.ts
- SaludController
- aptitud.ts
- Staging del piloto
- aptitud.ts
- paginas-auth.spec.ts
- PrismaClient
- class.ts
- App
- contracts/src/index.ts
- auth.ts
- rn01.ts
- CafeinaComponent
- optimization
- README.md
- @nestjs/common
- auth.e2e.spec.ts
- chip.component.spec.ts
- domain/src/index.ts
- UsuariosService
- plataforma/auth/auth.service.ts
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- TurnosService
- Plan: Sistema de diseño del Figma en la PWA
- RegistroService
- Prisma__RutaClient
- UsuarioEliminadoOperacionesListener
- assertKAnonymity
- decorators/publica.decorator.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 57 edges
2. `PrismaService` - 44 edges
3. `@angular/core` - 36 edges
4. `PrismaClient` - 20 edges
5. `@nestjs/swagger` - 20 edges
6. `ExcesoJornadaAuditoriaDelegate` - 18 edges
7. `ParametroSistemaDelegate` - 18 edges
8. `RutaDelegate` - 18 edges
9. `TurnoLaboralDelegate` - 18 edges
10. `compilerOptions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `9. Convenciones de nomenclatura` --references--> `TurnosService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/paginas/turnos/turnos.service.ts

## Import Cycles
- None detected.

## Communities (124 total, 36 thin omitted)

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
Nodes (31): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+23 more)

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
Cohesion: 0.15
Nodes (23): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+15 more)

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
Cohesion: 0.10
Nodes (20): AnyNull, AreaScalarFieldEnum, BebidaScalarFieldEnum, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, IngestaCafeinaScalarFieldEnum, JsonNull (+12 more)

### Community 23 - "app.module.ts"
Cohesion: 0.11
Nodes (10): AppModule, CircadianoModule, IndicadoresModule, NotificacionesModule, OperacionesModule, TrabajadorModule, PrismaModule, helmet (+2 more)

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

### Community 34 - "auth.controller.e2e.spec.ts"
Cohesion: 0.17
Nodes (5): Roles(), ROLES_KEY, RolesGuard, IndicadoresService, RespuestaAgregada

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
Nodes (14): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, Ruta (+6 more)

### Community 49 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 50 - "AuthService"
Cohesion: 0.06
Nodes (8): AuthController, AuthService, LoginDto, RegistroDto, AuthService, AuthTokens, LoginDto, UsuarioDto

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "CrearTurnoDto"
Cohesion: 0.08
Nodes (3): CrearTurnoDto, OperacionesController, OperacionesService

### Community 56 - "cafeina.service.ts"
Cohesion: 0.08
Nodes (10): BebidasController, CafeinaController, CafeinaModule, CafeinaService, UsuarioEliminadoCafeinaListener, 1. Arquitectura y SOLID, BebidaDto, CrearIngestaCafeinaDto (+2 more)

### Community 57 - "EncolarNotificacionDto"
Cohesion: 0.10
Nodes (4): NotificacionesController, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (55): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+47 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (56): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+48 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "ParametrosController"
Cohesion: 0.10
Nodes (5): ActualizarParametroDto, ParametrosController, ParametrosService, ActualizarParametroDto, ParametroSistemaDto

### Community 64 - "audit.interceptor.ts"
Cohesion: 0.22
Nodes (3): AuditInterceptor, Rutas, Auditable

### Community 65 - "indicadores.component.ts"
Cohesion: 0.21
Nodes (5): IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse, @angular/forms, rxjs

### Community 66 - "auth.module.ts"
Cohesion: 0.15
Nodes (11): OpcionesAuditoria, tokens, JwtAuthGuard, ES_PUBLICA, RolesGuard, contexto(), SolicitudAutenticada, UsuarioJwtPayload (+3 more)

### Community 68 - "cafeina.ts"
Cohesion: 0.30
Nodes (12): IngestaItem, calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida(), SemividaCafeina, UsuarioCafeina, validarDosis() (+4 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 71 - "app.routes.ts"
Cohesion: 0.19
Nodes (12): appConfig, PreferenciaTema, appRoutes, Tema, autenticadoGuard(), rolGuard(), estado, ruta (+4 more)

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

### Community 87 - "registro.component.ts"
Cohesion: 0.14
Nodes (7): CARGOS, MENSAJES, RANGOS_EDAD, RegistroComponent, SEXOS, AnfitrionComponent, TarjetaComponent

### Community 88 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 89 - "auth.interceptor.ts"
Cohesion: 0.21
Nodes (9): authInterceptor(), conToken(), esDeLaApi(), esPublica(), RUTAS_PUBLICAS, ESTILOS_FORMULARIO, AdminParametrosComponent, environment (+1 more)

### Community 90 - "client.ts"
Cohesion: 0.14
Nodes (11): Area, Bebida, $Enums, ExcesoJornadaAuditoria, IngestaCafeina, Notificacion, ParametroSistema, Ruta (+3 more)

### Community 95 - "aptitud.ts"
Cohesion: 0.14
Nodes (10): ESTADOS, SemaforoAptitudComponent, 9. Convenciones de nomenclatura, ColorSemaforo, ResultadoAptitudPresalida, Fase 2 — Componentes compartidos (dueño I4), Fase 1 — Fundamentos, Fase 2 — Componentes compartidos (+2 more)

### Community 96 - "Staging del piloto"
Cohesion: 0.29
Nodes (6): Pasos que requieren una persona (cuentas), Pendiente conocido, Resumen, Rollback, Staging del piloto, Verificacion (despues del despliegue)

### Community 97 - "aptitud.ts"
Cohesion: 0.29
Nodes (8): AptitudPresalidaInvalidaError, calcularAptitudPresalida(), colorDivulgableAlDespachador(), EntradaAptitudPresalida, exigirFinito(), SOMNOLENCIA_MAX, SOMNOLENCIA_MIN, base

### Community 98 - "paginas-auth.spec.ts"
Cohesion: 0.11
Nodes (10): ConsentimientoComponent, escribir(), obtener(), decodificarJwt(), estaVigente(), PayloadJwt, SesionService, TokensGuardados (+2 more)

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 102 - "contracts/src/index.ts"
Cohesion: 0.16
Nodes (9): ActualizarTurnoDto, Publica(), Roles(), ROLES_PERMITIDOS, ErrorApiDto, TURNO_ASIGNADO, TurnoAsignadoEvento, class-validator (+1 more)

### Community 103 - "auth.ts"
Cohesion: 0.05
Nodes (13): AreasController, RefrescarTokenDto, ActualizarUsuarioAdminDto, UsuariosAdminController, ActualizarUsuarioAdminDto, AreaDto, ESTADOS_USUARIO, EstadoUsuario (+5 more)

### Community 104 - "rn01.ts"
Cohesion: 0.29
Nodes (6): detectarTurnoNocturno(), ValidacionDescansoResultado, ValidacionJornadaInput, ValidacionJornadaResultado, validarDescansoMinimo(), validarJornadaRN01()

### Community 108 - "optimization"
Cohesion: 0.33
Nodes (6): fonts, scripts, styles, optimization, inlineCritical, minify

### Community 110 - "@nestjs/common"
Cohesion: 0.13
Nodes (15): AreasService, RefrescoPayload, SECRETO, ParametroEditable, PARAMETROS_EDITABLES, CAMPOS_ADMIN, PrismaService, USUARIO_ELIMINADO (+7 more)

### Community 111 - "auth.e2e.spec.ts"
Cohesion: 0.19
Nodes (7): PruebaController, SECRETO, PrismaHealthIndicator, SaludModule, @nestjs/terminus, @nestjs/throttler, supertest

### Community 113 - "domain/src/index.ts"
Cohesion: 0.33
Nodes (3): Ruta, EstadoConfirmacion, TurnoLaboral

### Community 114 - "UsuariosService"
Cohesion: 0.11
Nodes (5): AuthModule, UsuarioActual, PlataformaModule, CuentaController, UsuariosService

### Community 115 - "plataforma/auth/auth.service.ts"
Cohesion: 0.19
Nodes (6): Entorno, SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), class-transformer

### Community 116 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.17
Nodes (11): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos (+3 more)

### Community 118 - "Plan: Sistema de diseño del Figma en la PWA"
Cohesion: 0.25
Nodes (7): Contexto, Dependencias, Fase 1 — Fundamentos, Fase 3 — Pantallas (en paralelo tras Checkpoint 2), Plan: Sistema de diseño del Figma en la PWA, Preguntas abiertas, Riesgos

## Knowledge Gaps
- **64 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.015625 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `audit.interceptor.ts`, `auth.controller.e2e.spec.ts`, `auth.module.ts`, `contracts/src/index.ts`, `auth.e2e.spec.ts`, `UsuariosService`, `app.module.ts`, `cafeina.service.ts`, `decorators/publica.decorator.ts`, `package.json`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.020618556701030927 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `indicadores.component.ts`, `paginas-auth.spec.ts`, `cafeina.ts`, `app.routes.ts`, `chip.component.spec.ts`, `registro.component.ts`, `auth.interceptor.ts`, `package.json`, `aptitud.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024691358024691357 - nodes in this community are weakly interconnected._