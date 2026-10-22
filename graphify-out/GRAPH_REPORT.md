# Graph Report - Ritmo-Circadiano  (2026-10-22)

## Corpus Check
- 131 files · ~64,978 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 1524 nodes · 1815 edges · 98 communities (67 shown, 31 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `311cd0d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prismaNamespace.ts
- TurnoLaboral.ts
- ExcesoJornadaAuditoria.ts
- Ruta.ts
- ParametroSistema.ts
- Runtime Dependencies
- compilerOptions
- Nx Workspace Config
- commonInputTypes.ts
- NPM Scripts
- Jest Preset Config
- ESLint Configuration
- Node Engine Requirements
- constantes.ts
- Domain Project Config
- Contracts TypeScript Config
- Domain TypeScript Config
- Contracts Project Config
- ExcesoJornadaAuditoriaDelegate
- ParametroSistemaDelegate
- RutaDelegate
- TurnoLaboralDelegate
- prismaNamespaceBrowser.ts
- app.module.ts
- API App TypeScript Config
- Serve Target Config
- api-e2e/project.json
- client.ts
- TurnosComponent
- API Spec TypeScript Config
- Workspace Copy Targets
- Typecheck Target Config
- PWA TypeScript Strictness
- Prisma Generate Target
- api/src/main.ts
- Serve Build Dependencies
- PWA Project Config
- API Project Config
- Prune Build Targets
- compilerOptions
- Lockfile Prune Target
- Webpack Configuration
- Prisma Config
- Static Serve Target
- api-e2e/tsconfig.json
- PWA Build Options
- Production Build Config
- enums.ts
- Service Worker Config
- Dev Environment Config
- Production Environment Config
- Jest Test Setup
- API TypeScript Config
- OperacionesService
- salud.controller.ts
- Environment Validation
- Dependency Overrides
- @nestjs/common
- devDependencies
- package.json
- Constraints
- .obtenerPanel
- @angular/core
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- Prisma__TurnoLaboralClient
- app.routes.ts
- operaciones.service.ts
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
- IndicadoresComponent
- aptitud.component.ts
- cafeina.component.ts
- diario.component.ts
- plan.component.ts
- plataforma.component.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 23 edges
2. `@angular/core` - 22 edges
3. `ExcesoJornadaAuditoriaDelegate` - 18 edges
4. `ParametroSistemaDelegate` - 18 edges
5. `RutaDelegate` - 18 edges
6. `TurnoLaboralDelegate` - 18 edges
7. `compilerOptions` - 18 edges
8. `PrismaService` - 17 edges
9. `CrearTurnoDto` - 16 edges
10. `OperacionesService` - 16 edges

## Surprising Connections (you probably didn't know these)
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `9. Convenciones de nomenclatura` --references--> `TurnosService`  [INFERRED]
  CLAUDE.md → apps/pwa/src/app/paginas/turnos/turnos.service.ts
- `Fase 2 — Componentes compartidos (dueño I4)` --references--> `ColorSemaforo`  [INFERRED]
  tasks/plan.md → libs/contracts/src/semaforo.ts
- `Fase 2 — Componentes compartidos` --references--> `ColorSemaforo`  [INFERRED]
  tasks/todo.md → libs/contracts/src/semaforo.ts

## Import Cycles
- None detected.

## Communities (98 total, 31 thin omitted)

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

### Community 5 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+21 more)

### Community 6 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 7 - "Nx Workspace Config"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 8 - "commonInputTypes.ts"
Cohesion: 0.05
Nodes (36): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+28 more)

### Community 9 - "NPM Scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 13 - "constantes.ts"
Cohesion: 0.09
Nodes (30): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+22 more)

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

### Community 22 - "prismaNamespaceBrowser.ts"
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 23 - "app.module.ts"
Cohesion: 0.12
Nodes (8): CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, TrabajadorModule, PrismaModule, @nestjs/schedule

### Community 24 - "API App TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 25 - "Serve Target Config"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 26 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "client.ts"
Cohesion: 0.06
Nodes (18): $Enums, ExcesoJornadaAuditoria, ParametroSistema, PrismaClient, Ruta, TurnoLaboral, config, decodeBase64AsWasm() (+10 more)

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

### Community 34 - "api/src/main.ts"
Cohesion: 0.33
Nodes (3): AppModule, helmet, @nestjs/core

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

### Community 39 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 40 - "Lockfile Prune Target"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 41 - "Webpack Configuration"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 44 - "Static Serve Target"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 45 - "api-e2e/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 46 - "PWA Build Options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 47 - "Production Build Config"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 48 - "enums.ts"
Cohesion: 0.25
Nodes (6): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral, EstadoConfirmacion

### Community 49 - "Service Worker Config"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 54 - "API TypeScript Config"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "OperacionesService"
Cohesion: 0.07
Nodes (8): ActualizarTurnoDto, CrearTurnoDto, OperacionesController, OperacionesService, detectarTurnoNocturno(), validarJornadaRN01(), @nestjs/platform-express, @nestjs/swagger

### Community 56 - "salud.controller.ts"
Cohesion: 0.12
Nodes (8): IS_PUBLIC_KEY, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/common, @nestjs/terminus, @nestjs/throttler

### Community 57 - "Environment Validation"
Cohesion: 0.25
Nodes (4): Entorno, validarEntorno(), class-transformer, class-validator

### Community 58 - "Dependency Overrides"
Cohesion: 0.18
Nodes (11): ajv, picomatch, js-yaml, undici, overrides, @angular-devkit/core@19.0.1, @nestjs/swagger, nx (+3 more)

### Community 59 - "@nestjs/common"
Cohesion: 0.17
Nodes (5): Roles(), ROLES_KEY, RolesGuard, IndicadoresController, IndicadoresService

### Community 60 - "devDependencies"
Cohesion: 0.04
Nodes (49): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint, @angular/language-service (+41 more)

### Community 61 - "package.json"
Cohesion: 0.04
Nodes (49): license, name, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+41 more)

### Community 62 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 63 - ".obtenerPanel"
Cohesion: 0.15
Nodes (3): 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), RespuestaAgregada, assertKAnonymity()

### Community 65 - "@angular/core"
Cohesion: 0.29
Nodes (6): IndicadoresService, PanelIndicadoresResponse, @angular/common, @angular/core, @angular/forms, rxjs

### Community 66 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.05
Nodes (29): Prisma__RutaClient, ESTADOS, SemaforoAptitudComponent, 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA") (+21 more)

### Community 68 - "app.routes.ts"
Cohesion: 0.30
Nodes (6): App, appConfig, appRoutes, @angular/platform-browser, @angular/router, @angular/service-worker

### Community 69 - "operaciones.service.ts"
Cohesion: 0.14
Nodes (10): PrismaService, 1. Arquitectura y SOLID, ErrorApiDto, Rol, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/config, @nestjs/event-emitter (+2 more)

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

## Knowledge Gaps
- **58 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1151 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `client.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`, `package.json`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017241379310344827 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02040816326530612 - nodes in this community are weakly interconnected._
- **Why does `@angular/core` connect `@angular/core` to `diario.component.ts`, `plan.component.ts`, `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)`, `plataforma.component.ts`, `app.routes.ts`, `chip.component.spec.ts`, `tarjeta.component.spec.ts`, `micro-tarjeta.component.spec.ts`, `package.json`, `aptitud.component.ts`, `cafeina.component.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024390243902439025 - nodes in this community are weakly interconnected._