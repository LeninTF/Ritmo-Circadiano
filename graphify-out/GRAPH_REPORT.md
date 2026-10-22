# Graph Report - Ritmo-Circadiano  (2026-10-22)

## Corpus Check
- 144 files · ~70,193 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 1667 nodes · 2117 edges · 109 communities (70 shown, 39 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `70733a4a`
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
- client.ts
- TurnosComponent
- compilerOptions
- copy-workspace-modules
- typecheck
- pwa/tsconfig.json
- prisma-generate
- @nestjs/common
- serve
- pwa/project.json
- api/project.json
- targets
- compilerOptions
- prune-lockfile
- webpack.config.js
- dotenv
- options
- api-e2e/tsconfig.json
- options
- production
- enums.ts
- ngsw-config.json
- environment.ts
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- OperacionesService
- salud.controller.ts
- notificaciones.service.ts
- overrides
- .obtenerPanel
- devDependencies
- package.json
- Constraints
- contracts/src/index.ts
- @angular/core
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- Prisma__TurnoLaboralClient
- app.routes.ts
- @nestjs/common
- compilerOptions
- TurnosService
- OfflineStoreService
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
- chip.component.spec.ts
- PrismaClientBaseOptions
- test
- tarjeta.component.spec.ts
- configurations
- micro-tarjeta.component.spec.ts
- client.ts
- aptitud.component.ts
- semaforo-aptitud.component.ts
- Prisma__RutaClient
- plan.component.ts
- plataforma.component.ts
- PrismaClient
- class.ts
- App
- entorno.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 29 edges
2. `@angular/core` - 22 edges
3. `PrismaService` - 22 edges
4. `ExcesoJornadaAuditoriaDelegate` - 18 edges
5. `ParametroSistemaDelegate` - 18 edges
6. `RutaDelegate` - 18 edges
7. `TurnoLaboralDelegate` - 18 edges
8. `compilerOptions` - 18 edges
9. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 16 edges
10. `CrearTurnoDto` - 16 edges

## Surprising Connections (you probably didn't know these)
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `assertKAnonymity()`  [INFERRED]
  CLAUDE.md → libs/domain/src/k-anonymity.ts
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `9. Convenciones de nomenclatura` --references--> `TurnosService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/paginas/turnos/turnos.service.ts
- `9. Convenciones de nomenclatura` --references--> `calcularHoraCorte()`  [INFERRED]
  CLAUDE.md → libs/domain/src/cafeina.ts

## Import Cycles
- None detected.

## Communities (109 total, 39 thin omitted)

### Community 0 - "prismaNamespace.ts"
Cohesion: 0.02
Nodes (115): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean (+107 more)

### Community 1 - "TurnoLaboral.ts"
Cohesion: 0.02
Nodes (97): AggregateTurnoLaboral, DateTimeFieldUpdateOperationsInput, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, NullableDateTimeFieldUpdateOperationsInput, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs (+89 more)

### Community 2 - "ExcesoJornadaAuditoria.ts"
Cohesion: 0.02
Nodes (81): AggregateExcesoJornadaAuditoria, ExcesoJornadaAuditoria$turnoArgs, ExcesoJornadaAuditoriaAggregateArgs, ExcesoJornadaAuditoriaAvgAggregateInputType, ExcesoJornadaAuditoriaAvgAggregateOutputType, ExcesoJornadaAuditoriaAvgOrderByAggregateInput, ExcesoJornadaAuditoriaCountAggregateInputType, ExcesoJornadaAuditoriaCountAggregateOutputType (+73 more)

### Community 3 - "Ruta.ts"
Cohesion: 0.03
Nodes (78): AggregateRuta, BoolFieldUpdateOperationsInput, DecimalFieldUpdateOperationsInput, GetRutaAggregateType, GetRutaGroupByPayload, Ruta$turnosArgs, RutaAggregateArgs, RutaAvgAggregateInputType (+70 more)

### Community 4 - "ParametroSistema.ts"
Cohesion: 0.04
Nodes (53): AggregateParametroSistema, GetParametroSistemaAggregateType, GetParametroSistemaGroupByPayload, ParametroSistemaAggregateArgs, ParametroSistemaCountAggregateInputType, ParametroSistemaCountAggregateOutputType, ParametroSistemaCountArgs, ParametroSistemaCountOrderByAggregateInput (+45 more)

### Community 5 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 7 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "commonInputTypes.ts"
Cohesion: 0.05
Nodes (36): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+28 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.06
Nodes (45): CafeinaComponent, IngestaItem, 4. Vertical slices (dueños de código), CategoriaCronotipo, calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida() (+37 more)

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
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 23 - "app.module.ts"
Cohesion: 0.10
Nodes (10): AppModule, CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, TrabajadorModule, PrismaModule (+2 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "client.ts"
Cohesion: 0.31
Nodes (7): PrismaClient, 10. Flujo Git y validación pre-PR, main(), AREAS, sembrarIdentidad(), argon2, @prisma/adapter-pg

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

### Community 34 - "@nestjs/common"
Cohesion: 0.27
Nodes (4): Roles(), ROLES_KEY, RolesGuard, @nestjs/common

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

### Community 41 - "webpack.config.js"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 44 - "options"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 45 - "api-e2e/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, references, ../../tsconfig.base.json

### Community 46 - "options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 47 - "production"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 48 - "enums.ts"
Cohesion: 0.25
Nodes (6): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral, EstadoConfirmacion

### Community 49 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "OperacionesService"
Cohesion: 0.07
Nodes (7): ActualizarTurnoDto, CrearTurnoDto, OperacionesController, OperacionesService, detectarTurnoNocturno(), @nestjs/platform-express, @nestjs/swagger

### Community 56 - "salud.controller.ts"
Cohesion: 0.12
Nodes (7): IS_PUBLIC_KEY, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus, @nestjs/throttler

### Community 57 - "notificaciones.service.ts"
Cohesion: 0.09
Nodes (6): NotificacionesController, NotificacionesModule, NotificacionesService, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto

### Community 58 - "overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - ".obtenerPanel"
Cohesion: 0.12
Nodes (4): IndicadoresController, IndicadoresService, 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), assertKAnonymity()

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (55): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+47 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (55): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+47 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "contracts/src/index.ts"
Cohesion: 0.05
Nodes (25): BebidasController, CafeinaController, CafeinaService, 1. Arquitectura y SOLID, 9. Convenciones de nomenclatura, BebidaDto, CrearIngestaCafeinaDto, IngestaCafeinaRespuestaDto (+17 more)

### Community 65 - "@angular/core"
Cohesion: 0.21
Nodes (6): IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse, @angular/common, @angular/forms, rxjs

### Community 66 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.18
Nodes (10): 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos, 5. Reglas de negocio (implementar exactamente así) (+2 more)

### Community 68 - "app.routes.ts"
Cohesion: 0.20
Nodes (8): appConfig, PreferenciaTema, appRoutes, Tema, DiarioComponent, @angular/platform-browser, @angular/router, @angular/service-worker

### Community 69 - "@nestjs/common"
Cohesion: 0.14
Nodes (9): PrismaService, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/config, @nestjs/event-emitter, @nestjs/schedule, @nestjs/testing, supertest (+1 more)

### Community 70 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

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
Cohesion: 0.25
Nodes (5): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral

### Community 100 - "class.ts"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 103 - "entorno.ts"
Cohesion: 0.25
Nodes (4): Entorno, validarEntorno(), class-transformer, class-validator

## Knowledge Gaps
- **64 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `@angular-devkit/core`, `@angular-devkit/schematics`, `@angular/build` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1208 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `class.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `client.ts`, `package.json`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `@angular-devkit/core` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017241379310344827 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `@nestjs/common`, `OperacionesService`, `app.module.ts`, `salud.controller.ts`, `notificaciones.service.ts`, `package.json`, `contracts/src/index.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02040816326530612 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `OfflineStoreService` to `@angular/core`, `plan.component.ts`, `plataforma.component.ts`, `app.routes.ts`, `constantes.ts`, `chip.component.spec.ts`, `tarjeta.component.spec.ts`, `micro-tarjeta.component.spec.ts`, `package.json`, `aptitud.component.ts`, `semaforo-aptitud.component.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024390243902439025 - nodes in this community are weakly interconnected._