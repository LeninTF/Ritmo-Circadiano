# Graph Report - Ritmo-Circadiano  (2026-10-21)

## Corpus Check
- 84 files · ~30,549 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 725 nodes · 850 edges · 57 communities (45 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf4948fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- Constraints
- package.json
- devDependencies
- dependencies
- compilerOptions
- nx.json
- @angular/core
- scripts
- @nx/jest
- eslint.config.mjs
- engines
- constantes.ts
- domain/project.json
- compilerOptions
- compilerOptions
- contracts/project.json
- compilerOptions
- domain/tsconfig.lib.json
- compilerOptions
- contracts/tsconfig.lib.json
- app.module.ts
- compilerOptions
- development
- targets
- CrearTurnoDto
- pwa/tsconfig.app.json
- compilerOptions
- copy-workspace-modules
- typecheck
- pwa/tsconfig.json
- prisma-generate
- test
- serve
- pwa/project.json
- api/project.json
- targets
- configurations
- prune-lockfile
- webpack.config.js
- dotenv
- options
- typecheck
- options
- production
- test
- ngsw-config.json
- environment.ts
- environment.production.ts
- jest-preset-angular
- api/tsconfig.json
- OperacionesController
- overrides

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `OperacionesController` - 17 edges
3. `@nestjs/common` - 15 edges
4. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 15 edges
5. `CrearTurnoDto` - 14 edges
6. `PrismaService` - 10 edges
7. `targets` - 9 edges
8. `compilerOptions` - 9 edges
9. `compilerOptions` - 9 edges
10. `@angular/core` - 9 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `9. Convenciones de nomenclatura` --references--> `ColorSemaforo`  [INFERRED]
  CLAUDE.md → libs/contracts/src/semaforo.ts
- `10. Flujo Git y validación pre-PR` --references--> `main()`  [INFERRED]
  CLAUDE.md → prisma/seed.ts
- `RangoRmeq` --references--> `CategoriaCronotipo`  [EXTRACTED]
  libs/domain/src/constantes.ts → libs/contracts/src/cronotipo.ts

## Import Cycles
- None detected.

## Communities (57 total, 12 thin omitted)

### Community 0 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.08
Nodes (21): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos, 4. Vertical slices (dueños de código) (+13 more)

### Community 1 - "Constraints"
Cohesion: 0.29
Nodes (6): Constraints, Enforced with numbers, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 3 - "package.json"
Cohesion: 0.04
Nodes (52): license, name, private, version, @angular/build, @angular/cli, @angular/common, @angular/compiler (+44 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (47): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint, @angular/language-service (+39 more)

### Community 5 - "dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+21 more)

### Community 6 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+14 more)

### Community 7 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "@angular/core"
Cohesion: 0.11
Nodes (12): App, appConfig, appRoutes, CafeinaComponent, DiarioComponent, PlanComponent, PlataformaComponent, TurnosComponent (+4 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.08
Nodes (29): CategoriaCronotipo, ErrorApiDto, RespuestaAgregada, Rol, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H (+21 more)

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

### Community 18 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 19 - "domain/tsconfig.lib.json"
Cohesion: 0.22
Nodes (8): compilerOptions, declaration, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 20 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 21 - "contracts/tsconfig.lib.json"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, extends, include, ./tsconfig.json

### Community 23 - "app.module.ts"
Cohesion: 0.05
Nodes (22): AppModule, Entorno, validarEntorno(), CafeinaModule, CircadianoModule, OperacionesModule, PlataformaModule, TrabajadorModule (+14 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "targets"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 27 - "CrearTurnoDto"
Cohesion: 0.09
Nodes (8): ActualizarTurnoDto, CrearTurnoDto, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/event-emitter, @nestjs/platform-express, @nestjs/swagger, @nestjs/testing

### Community 28 - "pwa/tsconfig.app.json"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, types, exclude, extends, include, ./tsconfig.json

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

### Community 34 - "test"
Cohesion: 0.29
Nodes (7): jestConfig, passWithNoTests, test, dependsOn, executor, options, outputs

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

### Community 39 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 40 - "prune-lockfile"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 41 - "webpack.config.js"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 44 - "options"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 45 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 46 - "options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 47 - "production"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 48 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 49 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 54 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 58 - "overrides"
Cohesion: 0.18
Nodes (11): ajv, picomatch, js-yaml, undici, overrides, @angular-devkit/core@19.0.1, @nestjs/swagger, nx (+3 more)

## Knowledge Gaps
- **59 isolated node(s):** `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 475 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` be split into smaller, more focused modules?**
  _Cohesion score 0.08465608465608465 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `app.module.ts` to `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)`, `package.json`, `CrearTurnoDto`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.03773584905660377 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._