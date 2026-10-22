# Graph Report - Ritmo-Circadiano  (2026-10-22)

## Corpus Check
- 143 files · ~66,434 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 1577 nodes · 1948 edges · 107 communities (68 shown, 39 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d8c705b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prismaNamespace.ts
- TurnoLaboral.ts
- ExcesoJornadaAuditoria.ts
- Ruta.ts
- operaciones.service.ts
- ParametroSistema.ts
- package.json
- devDependencies
- client.ts
- commonInputTypes.ts
- constantes.ts
- auth.e2e.spec.ts
- nx.json
- @nestjs/common
- dependencies
- app.module.ts
- salud.controller.ts
- compilerOptions
- domain/project.json
- ExcesoJornadaAuditoriaDelegate
- ParametroSistemaDelegate
- RutaDelegate
- TurnoLaboralDelegate
- pwa/tsconfig.json
- prismaNamespaceBrowser.ts
- .obtenerPanel
- compilerOptions
- compilerOptions
- contracts/project.json
- api-e2e/project.json
- compilerOptions
- @angular/core
- TurnosComponent
- app.routes.ts
- compilerOptions
- CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)
- overrides
- development
- semaforo-aptitud.component.ts
- TurnosService
- compilerOptions
- compilerOptions
- domain/tsconfig.lib.json
- compilerOptions
- eslint.config.mjs
- api-e2e/tsconfig.json
- copy-workspace-modules
- typecheck
- entorno.ts
- enums.ts
- api/tsconfig.json
- targets
- pwa/tsconfig.app.json
- Constraints
- contracts/tsconfig.lib.json
- Plan: Sistema de diseño del Figma en la PWA
- prisma-generate
- test
- serve
- pwa/project.json
- options
- typecheck
- chip.component.spec.ts
- tarjeta.component.spec.ts
- Spec: Sistema de diseño compartido (tokens del Figma)
- api/project.json
- targets
- Entorno
- Prisma__RutaClient
- Prisma__TurnoLaboralClient
- .soloJefe
- JwtAuthGuard
- options
- production
- test
- scripts
- configurations
- prune-lockfile
- api/src/main.ts
- Prisma__ExcesoJornadaAuditoriaClient
- webpack.config.js
- micro-tarjeta.component.spec.ts
- OfflineStoreService
- pull_request_template.md
- Tareas: Sistema de diseño PWA
- Prisma__ParametroSistemaClient
- ngsw-config.json
- IndicadoresComponent
- assertKAnonymity
- @nx/jest
- PrismaClientBaseOptions
- aptitud.component.ts
- cafeina.component.ts
- diario.component.ts
- plan.component.ts
- plataforma.component.ts
- dotenv
- README.md
- environment.ts
- environment.production.ts
- jest-preset-angular
- engines

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 31 edges
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
- `Fase 2 — Componentes compartidos` --references--> `ColorSemaforo`  [INFERRED]
  tasks/todo.md → libs/contracts/src/semaforo.ts
- `9. Convenciones de nomenclatura` --references--> `CrearTurnoDto`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/operaciones/dto/crear-turno.dto.ts
- `4. Vertical slices (dueños de código)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `6. Privacidad y seguridad (obligatorio · Ley N.° 29733)` --references--> `JwtAuthGuard`  [INFERRED]
  CLAUDE.md → apps/api/src/modulos/plataforma/auth/jwt-auth.guard.ts
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts

## Import Cycles
- None detected.

## Communities (107 total, 39 thin omitted)

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

### Community 4 - "operaciones.service.ts"
Cohesion: 0.07
Nodes (9): ActualizarTurnoDto, CrearTurnoDto, OperacionesController, OperacionesService, detectarTurnoNocturno(), validarDescansoMinimo(), validarJornadaRN01(), @nestjs/platform-express (+1 more)

### Community 5 - "ParametroSistema.ts"
Cohesion: 0.04
Nodes (53): AggregateParametroSistema, GetParametroSistemaAggregateType, GetParametroSistemaGroupByPayload, ParametroSistemaAggregateArgs, ParametroSistemaCountAggregateInputType, ParametroSistemaCountAggregateOutputType, ParametroSistemaCountArgs, ParametroSistemaCountOrderByAggregateInput (+45 more)

### Community 6 - "package.json"
Cohesion: 0.04
Nodes (49): license, name, private, version, @angular/build, @angular/cli, @angular/compiler, @angular/compiler-cli (+41 more)

### Community 7 - "devDependencies"
Cohesion: 0.04
Nodes (49): devDependencies, @angular/build, @angular/cli, @angular/compiler-cli, @angular-devkit/core, @angular-devkit/schematics, angular-eslint, @angular/language-service (+41 more)

### Community 8 - "client.ts"
Cohesion: 0.06
Nodes (18): $Enums, ExcesoJornadaAuditoria, ParametroSistema, PrismaClient, Ruta, TurnoLaboral, config, decodeBase64AsWasm() (+10 more)

### Community 9 - "commonInputTypes.ts"
Cohesion: 0.05
Nodes (36): BoolFilter, BoolWithAggregatesFilter, DateTimeFilter, DateTimeNullableFilter, DateTimeNullableWithAggregatesFilter, DateTimeWithAggregatesFilter, DecimalFilter, DecimalWithAggregatesFilter (+28 more)

### Community 10 - "constantes.ts"
Cohesion: 0.10
Nodes (29): CategoriaCronotipo, CATEGORIA_RMEQ_SIN_RESPUESTA, CONDUCCION_MAX_ACUMULADA_H, CONDUCCION_MAX_DIURNA_H, CONDUCCION_MAX_NOCTURNA_H, CONDUCCION_VENTANA_H, CORTE_CAFEINA_ANTES_DORMIR_H, HORA_FIN_NOCTURNO (+21 more)

### Community 11 - "auth.e2e.spec.ts"
Cohesion: 0.13
Nodes (18): Roles(), ROLES_PERMITIDOS, RolesGuard, contexto(), SolicitudAutenticada, AuthTokens, LoginDto, RegistroDto (+10 more)

### Community 12 - "nx.json"
Cohesion: 0.06
Nodes (31): analytics, cache, dependsOn, inputs, dependsOn, ci, codeCoverage, ci (+23 more)

### Community 13 - "@nestjs/common"
Cohesion: 0.12
Nodes (12): Roles(), ROLES_KEY, RolesGuard, IndicadoresService, PrismaService, 1. Arquitectura y SOLID, TURNO_ASIGNADO, TurnoAsignadoEvento (+4 more)

### Community 14 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+22 more)

### Community 15 - "app.module.ts"
Cohesion: 0.10
Nodes (10): CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, AuthModule, PlataformaModule, TrabajadorModule, PrismaModule (+2 more)

### Community 16 - "salud.controller.ts"
Cohesion: 0.11
Nodes (8): IS_PUBLIC_KEY, Publica(), ES_PUBLICA, Publica(), PrismaHealthIndicator, SaludController, @nestjs/terminus, @nestjs/throttler

### Community 17 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 18 - "domain/project.json"
Cohesion: 0.11
Nodes (18): name, commands, jestConfig, parallel, projectType, $schema, sourceRoot, tags (+10 more)

### Community 23 - "pwa/tsconfig.json"
Cohesion: 0.12
Nodes (16): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compilerOptions, emitDecoratorMetadata, isolatedModules (+8 more)

### Community 24 - "prismaNamespaceBrowser.ts"
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 26 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 27 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 28 - "contracts/project.json"
Cohesion: 0.14
Nodes (13): name, commands, parallel, projectType, $schema, sourceRoot, tags, targets (+5 more)

### Community 29 - "api-e2e/project.json"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 30 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 31 - "@angular/core"
Cohesion: 0.29
Nodes (6): IndicadoresService, PanelIndicadoresResponse, @angular/common, @angular/core, @angular/forms, rxjs

### Community 33 - "app.routes.ts"
Cohesion: 0.30
Nodes (6): App, appConfig, appRoutes, @angular/platform-browser, @angular/router, @angular/service-worker

### Community 34 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 35 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.18
Nodes (10): 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 14. Sistema de diseño (fuente: Figma "Gestor Circadiano — Prototipo PWA"), 2. Stack, 3. Comandos, 5. Reglas de negocio (implementar exactamente así) (+2 more)

### Community 36 - "overrides"
Cohesion: 0.18
Nodes (11): ajv, picomatch, js-yaml, undici, overrides, @angular-devkit/core@19.0.1, @nestjs/swagger, nx (+3 more)

### Community 37 - "development"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 38 - "semaforo-aptitud.component.ts"
Cohesion: 0.24
Nodes (5): ESTADOS, SemaforoAptitudComponent, 9. Convenciones de nomenclatura, ColorSemaforo, Fase 2 — Componentes compartidos (dueño I4)

### Community 40 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 41 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 42 - "domain/tsconfig.lib.json"
Cohesion: 0.22
Nodes (8): compilerOptions, declaration, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 43 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 45 - "api-e2e/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 46 - "copy-workspace-modules"
Cohesion: 0.25
Nodes (8): cache, dependsOn, executor, options, outputs, buildTarget, options, copy-workspace-modules

### Community 47 - "typecheck"
Cohesion: 0.25
Nodes (8): commands, parallel, typecheck, cache, dependsOn, executor, inputs, options

### Community 48 - "entorno.ts"
Cohesion: 0.36
Nodes (6): SEGUNDOS_POR_UNIDAD, segundosDeExpira(), BASE, validarEntorno(), class-transformer, class-validator

### Community 49 - "enums.ts"
Cohesion: 0.25
Nodes (6): $Enums, ExcesoJornadaAuditoria, ParametroSistema, Ruta, TurnoLaboral, EstadoConfirmacion

### Community 50 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 51 - "targets"
Cohesion: 0.25
Nodes (8): configurations, defaultConfiguration, executor, outputs, executor, targets, build, lint

### Community 52 - "pwa/tsconfig.app.json"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, types, exclude, extends, include, ./tsconfig.json

### Community 53 - "Constraints"
Cohesion: 0.25
Nodes (7): Constraints, Enforced with numbers, Exceptions, Exceptions, Floor (always enforced, blocks immediately), Measured, not yet enforced, Not set up (and why)

### Community 54 - "contracts/tsconfig.lib.json"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, extends, include, ./tsconfig.json

### Community 55 - "Plan: Sistema de diseño del Figma en la PWA"
Cohesion: 0.25
Nodes (7): Contexto, Dependencias, Fase 1 — Fundamentos, Fase 3 — Pantallas (en paralelo tras Checkpoint 2), Plan: Sistema de diseño del Figma en la PWA, Preguntas abiertas, Riesgos

### Community 56 - "prisma-generate"
Cohesion: 0.29
Nodes (7): command, cache, executor, inputs, options, outputs, prisma-generate

### Community 57 - "test"
Cohesion: 0.29
Nodes (7): jestConfig, passWithNoTests, test, dependsOn, executor, options, outputs

### Community 58 - "serve"
Cohesion: 0.29
Nodes (7): runBuildTargetDependencies, continuous, defaultConfiguration, dependsOn, executor, options, serve

### Community 59 - "pwa/project.json"
Cohesion: 0.29
Nodes (6): name, prefix, projectType, $schema, sourceRoot, tags

### Community 60 - "options"
Cohesion: 0.29
Nodes (7): buildTarget, spa, staticFilePath, continuous, executor, options, serve-static

### Community 61 - "typecheck"
Cohesion: 0.29
Nodes (7): commands, parallel, typecheck, cache, executor, inputs, options

### Community 64 - "Spec: Sistema de diseño compartido (tokens del Figma)"
Cohesion: 0.29
Nodes (6): Alcance, Criterios de éxito, Límites, Objetivo, Preguntas abiertas, Spec: Sistema de diseño compartido (tokens del Figma)

### Community 65 - "api/project.json"
Cohesion: 0.33
Nodes (5): name, projectType, $schema, sourceRoot, tags

### Community 66 - "targets"
Cohesion: 0.33
Nodes (6): dependsOn, dependsOn, executor, targets, build, prune

### Community 72 - "options"
Cohesion: 0.33
Nodes (6): options, assets, browser, inlineStyleLanguage, outputPath, styles

### Community 73 - "production"
Cohesion: 0.33
Nodes (6): production, budgets, buildTarget, fileReplacements, outputHashing, serviceWorker

### Community 74 - "test"
Cohesion: 0.33
Nodes (6): jestConfig, tsConfig, test, executor, options, outputs

### Community 75 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, check:coverage-domain, check:lint, check:secrets, check:types, db:setup

### Community 76 - "configurations"
Cohesion: 0.40
Nodes (5): development, production, buildTarget, buildTarget, configurations

### Community 77 - "prune-lockfile"
Cohesion: 0.40
Nodes (5): cache, dependsOn, executor, outputs, prune-lockfile

### Community 80 - "webpack.config.js"
Cohesion: 0.40
Nodes (3): { join }, { NxAppWebpackPlugin }, @nx/webpack

### Community 83 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist de Verificación y Calidad, Descripción, Notas Adicionales / Evidencias, Tipo de Cambio

### Community 84 - "Tareas: Sistema de diseño PWA"
Cohesion: 0.40
Nodes (4): Fase 1 — Fundamentos, Fase 2 — Componentes compartidos, Fase 3 — Pantallas, Tareas: Sistema de diseño PWA

### Community 86 - "ngsw-config.json"
Cohesion: 0.50
Nodes (3): assetGroups, index, $schema

### Community 90 - "PrismaClientBaseOptions"
Cohesion: 0.67
Nodes (3): PrismaClientBaseOptions, PrismaClientOptionsWithAccelerateUrl, PrismaClientOptionsWithAdapter

## Knowledge Gaps
- **58 isolated node(s):** `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json`, `../../tsconfig.base.json`, `./tsconfig.json` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1171 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `client.ts` to `prismaNamespace.ts`, `TurnoLaboral.ts`, `ExcesoJornadaAuditoria.ts`, `Ruta.ts`, `ParametroSistema.ts`, `package.json`, `commonInputTypes.ts`, `prismaNamespaceBrowser.ts`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `./tsconfig.json`, `./tsconfig.json` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `prismaNamespace.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.017241379310344827 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `TurnoLaboral.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02040816326530612 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `@nestjs/common` to `operaciones.service.ts`, `package.json`, `auth.e2e.spec.ts`, `api/src/main.ts`, `app.module.ts`, `salud.controller.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `ExcesoJornadaAuditoria.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.024390243902439025 - nodes in this community are weakly interconnected._