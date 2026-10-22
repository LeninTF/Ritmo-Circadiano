# Graph Report - Ritmo-Circadiano  (2026-10-22)

## Corpus Check
- 97 files · ~35,386 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 865 nodes · 1188 edges · 63 communities (51 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fabd1e88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CrearTurnoDto
- Project Constraints
- Angular Dependencies
- Dev Tooling Dependencies
- Runtime Dependencies
- Base TypeScript Config
- Nx Workspace Config
- PWA App Shell
- NPM Scripts
- Jest Preset Config
- ESLint Configuration
- Node Engine Requirements
- Domain Constants and Chronotype
- Domain Project Config
- Contracts TypeScript Config
- Domain TypeScript Config
- Contracts Project Config
- PWA Spec TypeScript Config
- Domain Lib TypeScript Config
- Domain Spec TypeScript Config
- Contracts Lib TypeScript Config
- app.module.ts
- API App TypeScript Config
- Serve Target Config
- Build and Lint Targets
- cafeina.service.ts
- PWA App TypeScript Config
- API Spec TypeScript Config
- Workspace Copy Targets
- Typecheck Target Config
- PWA TypeScript Strictness
- Prisma Generate Target
- Jest Test Targets
- Serve Build Dependencies
- PWA Project Config
- API Project Config
- Prune Build Targets
- Build Configurations
- Lockfile Prune Target
- Webpack Configuration
- seed.ts
- Static Serve Target
- Typecheck Commands
- PWA Build Options
- Production Build Config
- Jest Test Executor
- Service Worker Config
- Dev Environment Config
- Production Environment Config
- Jest Test Setup
- API TypeScript Config
- Operaciones Controller Service
- @nestjs/common
- NotificacionesService
- Dependency Overrides
- PrismaService
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- api/src/main.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 22 edges
2. `compilerOptions` - 18 edges
3. `PrismaService` - 17 edges
4. `CrearTurnoDto` - 16 edges
5. `OperacionesService` - 16 edges
6. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 15 edges
7. `CafeinaService` - 14 edges
8. `OperacionesController` - 13 edges
9. `CafeinaComponent` - 13 edges
10. `calcularHoraCorte()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `9. Convenciones de nomenclatura` --references--> `ColorSemaforo`  [INFERRED]
  CLAUDE.md → libs/contracts/src/semaforo.ts
- `9. Convenciones de nomenclatura` --references--> `calcularHoraCorte()`  [INFERRED]
  CLAUDE.md → libs/domain/src/cafeina.ts
- `1. Arquitectura y SOLID` --references--> `CrearIngestaCafeinaDto`  [INFERRED]
  CLAUDE.md → libs/contracts/src/cafeina.dto.ts

## Import Cycles
- None detected.

## Communities (63 total, 12 thin omitted)

### Community 0 - "CrearTurnoDto"
Cohesion: 0.16
Nodes (6): ActualizarTurnoDto, CrearTurnoDto, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/platform-express, @nestjs/swagger

### Community 1 - "Project Constraints"
Cohesion: 0.29
Nodes (6): Constraints, Enforced with numbers, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 3 - "Angular Dependencies"
Cohesion: 0.04
Nodes (56): license, name, private, version, ajv, @angular/build, @angular/cli, @angular/compiler (+48 more)

### Community 4 - "Dev Tooling Dependencies"
Cohesion: 0.04
Nodes (53): devDependencies, ajv, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint (+45 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+22 more)

### Community 6 - "Base TypeScript Config"
Cohesion: 0.09
Nodes (22): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+14 more)

### Community 7 - "Nx Workspace Config"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "PWA App Shell"
Cohesion: 0.08
Nodes (14): App, appConfig, PreferenciaTema, appRoutes, Tema, DiarioComponent, PlanComponent, PlataformaComponent (+6 more)

### Community 9 - "NPM Scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "Domain Constants and Chronotype"
Cohesion: 0.06
Nodes (41): CafeinaComponent, IngestaItem, 4. Vertical slices (dueños de código), CategoriaCronotipo, calcularHoraCorte(), IngestaCafeina, residual(), resolverSemivida() (+33 more)

### Community 14 - "Domain Project Config"
Cohesion: 0.11
Nodes (18): name, commands, jestConfig, parallel, projectType, $schema, sourceRoot, tags (+10 more)

### Community 15 - "Contracts TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 16 - "Domain TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 17 - "Contracts Project Config"
Cohesion: 0.14
Nodes (13): name, commands, parallel, projectType, $schema, sourceRoot, tags, targets (+5 more)

### Community 18 - "PWA Spec TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 19 - "Domain Lib TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, declaration, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 20 - "Domain Spec TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 21 - "Contracts Lib TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, extends, include, ./tsconfig.json

### Community 23 - "app.module.ts"
Cohesion: 0.13
Nodes (8): CircadianoModule, OperacionesModule, PlataformaModule, TrabajadorModule, PrismaModule, SaludModule, @nestjs/schedule, @nestjs/throttler

### Community 24 - "API App TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "Serve Target Config"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "Build and Lint Targets"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 27 - "cafeina.service.ts"
Cohesion: 0.07
Nodes (14): BebidasController, CafeinaController, CafeinaModule, CafeinaService, 1. Arquitectura y SOLID, 9. Convenciones de nomenclatura, BebidaDto, CrearIngestaCafeinaDto (+6 more)

### Community 28 - "PWA App TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 29 - "API Spec TypeScript Config"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 30 - "Workspace Copy Targets"
Cohesion: 0.25
Nodes (8): cache, dependsOn, executor, options, outputs, buildTarget, options, copy-workspace-modules

### Community 31 - "Typecheck Target Config"
Cohesion: 0.25
Nodes (8): commands, parallel, typecheck, cache, dependsOn, executor, inputs, options

### Community 32 - "PWA TypeScript Strictness"
Cohesion: 0.12
Nodes (16): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compilerOptions, emitDecoratorMetadata, isolatedModules (+8 more)

### Community 33 - "Prisma Generate Target"
Cohesion: 0.29
Nodes (7): command, cache, executor, inputs, options, outputs, prisma-generate

### Community 34 - "Jest Test Targets"
Cohesion: 0.29
Nodes (7): jestConfig, passWithNoTests, test, dependsOn, executor, options, outputs

### Community 35 - "Serve Build Dependencies"
Cohesion: 0.29
Nodes (7): runBuildTargetDependencies, continuous, defaultConfiguration, dependsOn, executor, options, serve

### Community 36 - "PWA Project Config"
Cohesion: 0.29
Nodes (6): name, prefix, projectType, $schema, sourceRoot, tags

### Community 37 - "API Project Config"
Cohesion: 0.33
Nodes (5): name, projectType, $schema, sourceRoot, tags

### Community 38 - "Prune Build Targets"
Cohesion: 0.33
Nodes (6): dependsOn, dependsOn, executor, targets, build, prune

### Community 39 - "Build Configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 40 - "Lockfile Prune Target"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 41 - "Webpack Configuration"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 42 - "seed.ts"
Cohesion: 0.24
Nodes (6): AREAS, sembrarIdentidad(), argon2, dotenv, prisma, @prisma/adapter-pg

### Community 44 - "Static Serve Target"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 45 - "Typecheck Commands"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 46 - "PWA Build Options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 47 - "Production Build Config"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 48 - "Jest Test Executor"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 49 - "Service Worker Config"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 54 - "API TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 56 - "@nestjs/common"
Cohesion: 0.19
Nodes (4): PrismaHealthIndicator, SaludController, @nestjs/common, @nestjs/terminus

### Community 57 - "NotificacionesService"
Cohesion: 0.06
Nodes (10): Entorno, validarEntorno(), NotificacionesController, NotificacionesModule, NotificacionesService, CrearSuscripcionPushDto, EncolarNotificacionDto, NotificacionRespuestaDto (+2 more)

### Community 58 - "Dependency Overrides"
Cohesion: 0.15
Nodes (13): vite, ajv, picomatch, js-yaml, undici, overrides, @angular/build, @angular-devkit/core@19.0.1 (+5 more)

### Community 59 - "PrismaService"
Cohesion: 0.22
Nodes (5): PrismaService, @nestjs/config, @nestjs/event-emitter, @nestjs/testing, web-push

### Community 60 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.14
Nodes (13): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos, 5. Reglas de negocio (implementar exactamente así) (+5 more)

### Community 61 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/core

## Knowledge Gaps
- **63 isolated node(s):** `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 515 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `CrearTurnoDto`, `Angular Dependencies`, `PrismaService`, `app.module.ts`, `NotificacionesService`, `cafeina.service.ts`, `api/src/main.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Angular Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `Angular Dependencies`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03773584905660377 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Runtime Dependencies` to `Angular Dependencies`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._