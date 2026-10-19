# Graph Report - Ritmo-Circadiano  (2026-10-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1439 nodes · 1717 edges · 98 communities (69 shown, 29 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16fc6066`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- Constraints
- avance01.md
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
- jest.config.cts
- app.module.ts
- compilerOptions
- development
- targets
- entorno.ts
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
- api/jest.config.cts
- options
- typecheck
- options
- production
- test
- ngsw-config.json
- environment.ts
- environment.production.ts
- jest-preset-angular
- pwa/jest.config.cts
- api/tsconfig.json
- test
- serve
- api/tsconfig.json
- pwa/project.json
- options
- typecheck
- pwa/tsconfig.app.json
- Constraints
- contracts/tsconfig.lib.json
- api/project.json
- targets
- api/src/main.ts
- Prisma__TurnoLaboralClient
- options
- production
- test
- cafeina.component.ts
- compilerOptions
- scripts
- configurations
- prune-lockfile
- Prisma__ExcesoJornadaAuditoriaClient
- Prisma__RutaClient
- webpack.config.js
- contracts/tsconfig.json
- domain/tsconfig.json
- Prisma__ParametroSistemaClient
- ngsw-config.json
- IndicadoresComponent
- @nx/jest
- PrismaClientBaseOptions
- plan.component.ts
- 9. Convenciones de nomenclatura
- dotenv
- environment.ts
- environment.production.ts
- jest-preset-angular
- engines

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 23 edges
2. `ExcesoJornadaAuditoriaDelegate` - 18 edges
3. `ParametroSistemaDelegate` - 18 edges
4. `RutaDelegate` - 18 edges
5. `TurnoLaboralDelegate` - 18 edges
6. `compilerOptions` - 18 edges
7. `PrismaService` - 17 edges
8. `OperacionesService` - 16 edges
9. `CrearTurnoDto` - 15 edges
10. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 15 edges

## Surprising Connections (you probably didn't know these)
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `10. Flujo Git y validación pre-PR` --references--> `main()`  [INFERRED]
  CLAUDE.md → prisma/seed.ts
- `9. Convenciones de nomenclatura` --references--> `ColorSemaforo`  [INFERRED]
  CLAUDE.md → libs/contracts/src/semaforo.ts
- `main()` --calls--> `PrismaClient`  [EXTRACTED]
  prisma/seed.ts → apps/api/src/generated/prisma/client.ts
- `PrismaService` --inherits--> `PrismaClient`  [EXTRACTED]
  apps/api/src/prisma/prisma.service.ts → apps/api/src/generated/prisma/client.ts

## Import Cycles
- None detected.

## Communities (98 total, 29 thin omitted)

### Community 0 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.02
Nodes (115): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean (+107 more)

### Community 1 - "Constraints"
Cohesion: 0.02
Nodes (97): AggregateTurnoLaboral, DateTimeFieldUpdateOperationsInput, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, NullableDateTimeFieldUpdateOperationsInput, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs (+89 more)

### Community 2 - "avance01.md"
Cohesion: 0.02
Nodes (81): AggregateExcesoJornadaAuditoria, ExcesoJornadaAuditoria$turnoArgs, ExcesoJornadaAuditoriaAggregateArgs, ExcesoJornadaAuditoriaAvgAggregateInputType, ExcesoJornadaAuditoriaAvgAggregateOutputType, ExcesoJornadaAuditoriaAvgOrderByAggregateInput, ExcesoJornadaAuditoriaCountAggregateInputType, ExcesoJornadaAuditoriaCountAggregateOutputType (+73 more)

### Community 3 - "package.json"
Cohesion: 0.03
Nodes (78): AggregateRuta, BoolFieldUpdateOperationsInput, DecimalFieldUpdateOperationsInput, GetRutaAggregateType, GetRutaGroupByPayload, Ruta$turnosArgs, RutaAggregateArgs, RutaAvgAggregateInputType (+70 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (53): AggregateParametroSistema, GetParametroSistemaAggregateType, GetParametroSistemaGroupByPayload, ParametroSistemaAggregateArgs, ParametroSistemaCountAggregateInputType, ParametroSistemaCountAggregateOutputType, ParametroSistemaCountArgs, ParametroSistemaCountOrderByAggregateInput (+45 more)

### Community 5 - "dependencies"
Cohesion: 0.04
Nodes (50): license, name, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+42 more)

### Community 6 - "compilerOptions"
Cohesion: 0.04
Nodes (49): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint, @angular/language-service (+41 more)

### Community 7 - "nx.json"
Cohesion: 0.10
Nodes (4): OperacionesController, OperacionesService, detectarTurnoNocturno(), validarJornadaRN01()

### Community 8 - "@angular/core"
Cohesion: 0.05
Nodes (36): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+28 more)

### Community 9 - "scripts"
Cohesion: 0.10
Nodes (29): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+21 more)

### Community 10 - "@nx/jest"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 11 - "eslint.config.mjs"
Cohesion: 0.07
Nodes (28): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+20 more)

### Community 12 - "engines"
Cohesion: 0.12
Nodes (9): CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, TrabajadorModule, PrismaModule, @nestjs/schedule (+1 more)

### Community 13 - "constantes.ts"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 14 - "domain/project.json"
Cohesion: 0.13
Nodes (6): IS_PUBLIC_KEY, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 15 - "compilerOptions"
Cohesion: 0.14
Nodes (6): IndicadoresService, PrismaService, 1. Arquitectura y SOLID, RespuestaAgregada, assertKAnonymity(), @nestjs/config

### Community 16 - "compilerOptions"
Cohesion: 0.16
Nodes (5): ActualizarTurnoDto, CrearTurnoDto, validarDescansoMinimo(), @nestjs/platform-express, @nestjs/swagger

### Community 17 - "contracts/project.json"
Cohesion: 0.11
Nodes (18): name, commands, jestConfig, parallel, projectType, $schema, sourceRoot, tags (+10 more)

### Community 22 - "jest.config.cts"
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 23 - "app.module.ts"
Cohesion: 0.20
Nodes (7): App, appConfig, appRoutes, DiarioComponent, @angular/platform-browser, @angular/router, @angular/service-worker

### Community 24 - "compilerOptions"
Cohesion: 0.14
Nodes (13): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos, 4. Vertical slices (dueños de código) (+5 more)

### Community 25 - "development"
Cohesion: 0.14
Nodes (13): name, commands, parallel, projectType, $schema, sourceRoot, tags, targets (+5 more)

### Community 26 - "targets"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 29 - "compilerOptions"
Cohesion: 0.23
Nodes (6): ErrorApiDto, Rol, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/event-emitter, @nestjs/testing

### Community 30 - "copy-workspace-modules"
Cohesion: 0.20
Nodes (8): $Enums, ExcesoJornadaAuditoria, ParametroSistema, PrismaClient, Ruta, TurnoLaboral, main(), @prisma/adapter-pg

### Community 31 - "typecheck"
Cohesion: 0.17
Nodes (11): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+3 more)

### Community 33 - "prisma-generate"
Cohesion: 0.33
Nodes (4): Roles(), ROLES_KEY, RolesGuard, @nestjs/common

### Community 34 - "test"
Cohesion: 0.20
Nodes (5): config, decodeBase64AsWasm(), LogOptions, PrismaClientConstructor, @prisma/client

### Community 35 - "serve"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 37 - "api/project.json"
Cohesion: 0.20
Nodes (9): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, extends, files, include (+1 more)

### Community 38 - "targets"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+1 more)

### Community 39 - "configurations"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 40 - "prune-lockfile"
Cohesion: 0.25
Nodes (4): Entorno, validarEntorno(), class-transformer, class-validator

### Community 41 - "webpack.config.js"
Cohesion: 0.31
Nodes (5): IndicadoresService, PanelIndicadoresResponse, @angular/common, @angular/forms, rxjs

### Community 43 - "api/jest.config.cts"
Cohesion: 0.22
Nodes (9): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+1 more)

### Community 44 - "options"
Cohesion: 0.22
Nodes (9): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+1 more)

### Community 45 - "typecheck"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, references, ../../tsconfig.base.json

### Community 46 - "options"
Cohesion: 0.25
Nodes (8): cache, dependsOn, executor, options, outputs, buildTarget, options, copy-workspace-modules

### Community 47 - "production"
Cohesion: 0.25
Nodes (8): commands, parallel, typecheck, cache, dependsOn, executor, inputs, options

### Community 48 - "test"
Cohesion: 0.25
Nodes (6): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral, EstadoConfirmacion

### Community 49 - "ngsw-config.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, outDir, types, extends, include

### Community 50 - "environment.ts"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 51 - "environment.production.ts"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, exclude, extends, include

### Community 52 - "jest-preset-angular"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, outDir, types, extends, include

### Community 54 - "api/tsconfig.json"
Cohesion: 0.29
Nodes (7): command, cache, executor, inputs, options, outputs, prisma-generate

### Community 55 - "test"
Cohesion: 0.29
Nodes (7): jestConfig, passWithNoTests, test, dependsOn, executor, options, outputs

### Community 56 - "serve"
Cohesion: 0.29
Nodes (7): runBuildTargetDependencies, continuous, defaultConfiguration, dependsOn, executor, options, serve

### Community 57 - "api/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, esModuleInterop, extends, files, include, references

### Community 58 - "pwa/project.json"
Cohesion: 0.29
Nodes (6): name, prefix, projectType, $schema, sourceRoot, tags

### Community 59 - "options"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 60 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 61 - "pwa/tsconfig.app.json"
Cohesion: 0.29
Nodes (6): compilerOptions, outDir, types, exclude, extends, include

### Community 62 - "Constraints"
Cohesion: 0.29
Nodes (6): Constraints, Enforced with numbers, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - "contracts/tsconfig.lib.json"
Cohesion: 0.29
Nodes (6): compilerOptions, declaration, outDir, types, extends, include

### Community 64 - "api/project.json"
Cohesion: 0.33
Nodes (5): name, projectType, $schema, sourceRoot, tags

### Community 65 - "targets"
Cohesion: 0.33
Nodes (6): dependsOn, dependsOn, executor, targets, build, prune

### Community 66 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/core

### Community 68 - "options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 69 - "production"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 70 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 72 - "compilerOptions"
Cohesion: 0.33
Nodes (6): compilerOptions, emitDecoratorMetadata, isolatedModules, module, moduleResolution, noPropertyAccessFromIndexSignature

### Community 73 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 74 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 75 - "prune-lockfile"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 78 - "webpack.config.js"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 79 - "contracts/tsconfig.json"
Cohesion: 0.40
Nodes (4): extends, files, include, references

### Community 80 - "domain/tsconfig.json"
Cohesion: 0.40
Nodes (4): extends, files, include, references

### Community 82 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 85 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **45 isolated node(s):** `@angular/build`, `@angular/cli`, `@angular/compiler`, `@angular/compiler-cli`, `@angular-devkit/core` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1098 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `test` to `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)`, `Constraints`, `avance01.md`, `package.json`, `devDependencies`, `dependencies`, `@angular/core`, `jest.config.cts`, `copy-workspace-modules`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **What connects `@angular/build`, `@angular/cli`, `@angular/compiler` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` be split into smaller, more focused modules?**
  _Cohesion score 0.017241379310344827 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `compilerOptions` to `dependencies`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `Constraints` be split into smaller, more focused modules?**
  _Cohesion score 0.02040816326530612 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `prisma-generate` to `api/src/main.ts`, `dependencies`, `engines`, `domain/project.json`, `compilerOptions`, `compilerOptions`, `compilerOptions`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `avance01.md` be split into smaller, more focused modules?**
  _Cohesion score 0.024390243902439025 - nodes in this community are weakly interconnected._