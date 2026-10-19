# Graph Report - Ritmo-Circadiano  (2026-10-19)

## Corpus Check
- 110 files · ~61,432 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 1418 nodes · 1681 edges · 82 communities (63 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16fc6066`
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
- prismaNamespace.ts
- TurnoLaboral.ts
- ExcesoJornadaAuditoria.ts
- Ruta.ts
- ParametroSistema.ts
- OperacionesService
- commonInputTypes.ts
- operaciones.service.ts
- PrismaClient
- salud.controller.ts
- indicadores.controller.ts
- ExcesoJornadaAuditoriaDelegate
- ParametroSistemaDelegate
- RutaDelegate
- TurnoLaboralDelegate
- prismaNamespaceBrowser.ts
- client.ts
- TurnosComponent
- PrismaService
- contracts/src/index.ts
- enums.ts
- api/src/main.ts
- Prisma__TurnoLaboralClient
- Prisma__ExcesoJornadaAuditoriaClient
- pull_request_template.md
- Prisma__ParametroSistemaClient
- PrismaClientBaseOptions

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 22 edges
2. `ExcesoJornadaAuditoriaDelegate` - 18 edges
3. `ParametroSistemaDelegate` - 18 edges
4. `RutaDelegate` - 18 edges
5. `TurnoLaboralDelegate` - 18 edges
6. `compilerOptions` - 18 edges
7. `CrearTurnoDto` - 16 edges
8. `OperacionesService` - 16 edges
9. `PrismaService` - 16 edges
10. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 15 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `9. Convenciones de nomenclatura` --references--> `TurnosService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/paginas/turnos/turnos.service.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `assertKAnonymity()`  [INFERRED]
  CLAUDE.md → libs/domain/src/k-anonymity.ts
- `10. Flujo Git y validación pre-PR` --references--> `main()`  [INFERRED]
  CLAUDE.md → prisma/seed.ts

## Import Cycles
- None detected.

## Communities (82 total, 19 thin omitted)

### Community 0 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.10
Nodes (15): Prisma__RutaClient, 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos (+7 more)

### Community 1 - "Constraints"
Cohesion: 0.29
Nodes (6): Constraints, Enforced with numbers, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 3 - "package.json"
Cohesion: 0.04
Nodes (48): license, name, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+40 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (47): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint, @angular/language-service (+39 more)

### Community 5 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+14 more)

### Community 7 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "@angular/core"
Cohesion: 0.06
Nodes (19): App, appConfig, appRoutes, CafeinaComponent, DiarioComponent, IndicadoresComponent, IndicadoresService, PanelIndicadoresResponse (+11 more)

### Community 9 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.10
Nodes (29): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+21 more)

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
Cohesion: 0.13
Nodes (10): CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, TrabajadorModule, PrismaModule, @nestjs/common (+2 more)

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "targets"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 27 - "entorno.ts"
Cohesion: 0.25
Nodes (4): Entorno, validarEntorno(), class-transformer, class-validator

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

### Community 55 - "prismaNamespace.ts"
Cohesion: 0.02
Nodes (115): AnyNull, Args, At, AtLeast, AtLoose, AtStrict, BatchPayload, Boolean (+107 more)

### Community 56 - "TurnoLaboral.ts"
Cohesion: 0.02
Nodes (97): AggregateTurnoLaboral, DateTimeFieldUpdateOperationsInput, EnumEstadoConfirmacionFieldUpdateOperationsInput, GetTurnoLaboralAggregateType, GetTurnoLaboralGroupByPayload, NullableDateTimeFieldUpdateOperationsInput, TurnoLaboral$excesosAuditoriaArgs, TurnoLaboralAggregateArgs (+89 more)

### Community 57 - "ExcesoJornadaAuditoria.ts"
Cohesion: 0.02
Nodes (81): AggregateExcesoJornadaAuditoria, ExcesoJornadaAuditoria$turnoArgs, ExcesoJornadaAuditoriaAggregateArgs, ExcesoJornadaAuditoriaAvgAggregateInputType, ExcesoJornadaAuditoriaAvgAggregateOutputType, ExcesoJornadaAuditoriaAvgOrderByAggregateInput, ExcesoJornadaAuditoriaCountAggregateInputType, ExcesoJornadaAuditoriaCountAggregateOutputType (+73 more)

### Community 58 - "Ruta.ts"
Cohesion: 0.03
Nodes (78): AggregateRuta, BoolFieldUpdateOperationsInput, DecimalFieldUpdateOperationsInput, GetRutaAggregateType, GetRutaGroupByPayload, Ruta$turnosArgs, RutaAggregateArgs, RutaAvgAggregateInputType (+70 more)

### Community 59 - "ParametroSistema.ts"
Cohesion: 0.04
Nodes (53): AggregateParametroSistema, GetParametroSistemaAggregateType, GetParametroSistemaGroupByPayload, ParametroSistemaAggregateArgs, ParametroSistemaCountAggregateInputType, ParametroSistemaCountAggregateOutputType, ParametroSistemaCountArgs, ParametroSistemaCountOrderByAggregateInput (+45 more)

### Community 60 - "OperacionesService"
Cohesion: 0.10
Nodes (4): OperacionesController, OperacionesService, detectarTurnoNocturno(), validarJornadaRN01()

### Community 61 - "commonInputTypes.ts"
Cohesion: 0.05
Nodes (36): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+28 more)

### Community 62 - "operaciones.service.ts"
Cohesion: 0.13
Nodes (8): ActualizarTurnoDto, CrearTurnoDto, TURNO_ASIGNADO, TurnoAsignadoEvento, validarDescansoMinimo(), @nestjs/event-emitter, @nestjs/platform-express, @nestjs/swagger

### Community 63 - "PrismaClient"
Cohesion: 0.09
Nodes (6): config, decodeBase64AsWasm(), LogOptions, PrismaClient, PrismaClientConstructor, @prisma/client

### Community 64 - "salud.controller.ts"
Cohesion: 0.13
Nodes (6): IS_PUBLIC_KEY, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus

### Community 65 - "indicadores.controller.ts"
Cohesion: 0.13
Nodes (4): Roles(), ROLES_KEY, RolesGuard, IndicadoresController

### Community 70 - "prismaNamespaceBrowser.ts"
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 71 - "client.ts"
Cohesion: 0.19
Nodes (9): $Enums, ExcesoJornadaAuditoria, ParametroSistema, PrismaClient, Ruta, TurnoLaboral, main(), @nestjs/config (+1 more)

### Community 73 - "PrismaService"
Cohesion: 0.18
Nodes (4): IndicadoresService, PrismaService, 1. Arquitectura y SOLID, @nestjs/testing

### Community 74 - "contracts/src/index.ts"
Cohesion: 0.18
Nodes (5): 9. Convenciones de nomenclatura, ErrorApiDto, RespuestaAgregada, Rol, ColorSemaforo

### Community 75 - "enums.ts"
Cohesion: 0.25
Nodes (6): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral, EstadoConfirmacion

### Community 76 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/core

### Community 79 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist de Verificación y Calidad, Descripción, Notas Adicionales / Evidencias, Tipo de Cambio

### Community 81 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **55 isolated node(s):** `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1085 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `PrismaClient` to `package.json`, `prismaNamespaceBrowser.ts`, `client.ts`, `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **What connects `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `app.module.ts` to `salud.controller.ts`, `indicadores.controller.ts`, `package.json`, `client.ts`, `api/src/main.ts`, `operaciones.service.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._