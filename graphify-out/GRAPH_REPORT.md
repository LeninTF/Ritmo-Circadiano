# Graph Report - Ritmo-Circadiano  (2026-10-19)

## Corpus Check
- 76 files · ~27,569 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 7, .prisma 6, .scss 2)

## Summary
- 673 nodes · 752 edges · 61 communities (49 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f117a03c`
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
- turno.e2e-spec.ts
- compilerOptions
- contracts/project.json
- compilerOptions
- domain/tsconfig.lib.json
- compilerOptions
- contracts/tsconfig.lib.json
- jest.config.cts
- app.routes.ts
- compilerOptions
- development
- targets
- client.ts
- pwa/tsconfig.app.json
- client.ts
- pull_request_template.md
- typecheck
- pwa/tsconfig.json
- @nestjs/common
- TurnosService
- serve
- indicadores.component.ts
- api/project.json
- targets
- configurations
- prune-lockfile
- @angular/core
- PrismaService
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
- prisma.service.ts
- PrismaHealthIndicator
- PrismaService
- overrides
- api/src/main.ts
- @nestjs/common

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` - 15 edges
3. `@nestjs/common` - 13 edges
4. `@angular/core` - 9 edges
5. `PrismaService` - 9 edges
6. `compilerOptions` - 9 edges
7. `compilerOptions` - 9 edges
8. `targets` - 9 edges
9. `compilerOptions` - 8 edges
10. `PrismaHealthIndicator` - 7 edges

## Surprising Connections (you probably didn't know these)
- `1. Arquitectura y SOLID` --references--> `PrismaService`  [INFERRED]
  CLAUDE.md → apps/api/src/prisma/prisma.service.ts
- `10. Flujo Git y validación pre-PR` --references--> `main()`  [INFERRED]
  CLAUDE.md → prisma/seed.ts
- `9. Convenciones de nomenclatura` --references--> `ColorSemaforo`  [INFERRED]
  CLAUDE.md → libs/contracts/src/semaforo.ts
- `RangoRmeq` --references--> `CategoriaCronotipo`  [EXTRACTED]
  libs/domain/src/constantes.ts → libs/contracts/src/cronotipo.ts
- `main()` --calls--> `sembrarIdentidad()`  [EXTRACTED]
  prisma/seed.ts → prisma/seeds/identidad.ts

## Import Cycles
- None detected.

## Communities (61 total, 12 thin omitted)

### Community 0 - "CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)"
Cohesion: 0.07
Nodes (20): 0. Carga de contexto bajo demanda (no precargar), 10. Flujo Git y validación pre-PR, 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos, 4. Vertical slices (dueños de código) (+12 more)

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
Cohesion: 0.07
Nodes (29): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+21 more)

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
Cohesion: 0.10
Nodes (11): AppModule, CafeinaModule, CircadianoModule, IndicadoresModule, OperacionesModule, PlataformaModule, TrabajadorModule, helmet (+3 more)

### Community 13 - "constantes.ts"
Cohesion: 0.08
Nodes (23): compileOnSave, compilerOptions, declaration, emitDecoratorMetadata, experimentalDecorators, importHelpers, lib, module (+15 more)

### Community 14 - "domain/project.json"
Cohesion: 0.12
Nodes (7): IS_PUBLIC_KEY, Publica(), PrismaHealthIndicator, SaludController, SaludModule, @nestjs/terminus, @nestjs/throttler

### Community 15 - "turno.e2e-spec.ts"
Cohesion: 0.15
Nodes (8): RolesGuard, ErrorApiDto, Rol, TURNO_ASIGNADO, TurnoAsignadoEvento, @nestjs/event-emitter, @nestjs/testing, supertest

### Community 16 - "compilerOptions"
Cohesion: 0.16
Nodes (5): ActualizarTurnoDto, CrearTurnoDto, validarDescansoMinimo(), @nestjs/platform-express, @nestjs/swagger

### Community 17 - "contracts/project.json"
Cohesion: 0.11
Nodes (18): name, commands, jestConfig, parallel, projectType, $schema, sourceRoot, tags (+10 more)

### Community 22 - "jest.config.cts"
Cohesion: 0.12
Nodes (14): AnyNull, DbNull, Decimal, ExcesoJornadaAuditoriaScalarFieldEnum, JsonNull, ModelName, NullsOrder, NullTypes (+6 more)

### Community 23 - "app.routes.ts"
Cohesion: 0.20
Nodes (7): App, appConfig, appRoutes, DiarioComponent, @angular/platform-browser, @angular/router, @angular/service-worker

### Community 24 - "compilerOptions"
Cohesion: 0.14
Nodes (12): 0. Carga de contexto bajo demanda (no precargar), 11. Protocolo MCP de Notion (estado vivo), 12. CONSTRAINTS.md (límites duros), 13. graphify, 2. Stack, 3. Comandos, 4. Vertical slices (dueños de código), 5. Reglas de negocio (implementar exactamente así) (+4 more)

### Community 25 - "development"
Cohesion: 0.14
Nodes (13): name, commands, parallel, projectType, $schema, sourceRoot, tags, targets (+5 more)

### Community 26 - "targets"
Cohesion: 0.15
Nodes (12): executor, options, outputs, implicitDependencies, name, jestConfig, passWithNoTests, projectType (+4 more)

### Community 27 - "client.ts"
Cohesion: 0.09
Nodes (6): config, decodeBase64AsWasm(), LogOptions, PrismaClient, PrismaClientConstructor, @prisma/client

### Community 29 - "client.ts"
Cohesion: 0.18
Nodes (9): $Enums, ExcesoJornadaAuditoria, ParametroSistema, PrismaClient, Ruta, TurnoLaboral, 10. Flujo Git y validación pre-PR, main() (+1 more)

### Community 30 - "pull_request_template.md"
Cohesion: 0.40
Nodes (4): Checklist de Verificación y Calidad, Descripción, Notas Adicionales / Evidencias, Tipo de Cambio

### Community 20 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 21 - "contracts/tsconfig.lib.json"
Cohesion: 0.25
Nodes (7): compilerOptions, declaration, outDir, types, extends, include, ./tsconfig.json

### Community 23 - "app.module.ts"
Cohesion: 0.13
Nodes (8): CafeinaModule, CircadianoModule, OperacionesModule, PlataformaModule, TrabajadorModule, @nestjs/event-emitter, @nestjs/schedule, @nestjs/throttler

### Community 24 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, outDir, target, types (+4 more)

### Community 32 - "pwa/tsconfig.json"
Cohesion: 0.15
Nodes (3): 6. Privacidad y seguridad (obligatorio · Ley N.° 29733), RespuestaAgregada, assertKAnonymity()

### Community 33 - "@nestjs/common"
Cohesion: 0.19
Nodes (6): Roles(), ROLES_KEY, IndicadoresController, IndicadoresService, PrismaModule, @nestjs/common

### Community 35 - "serve"
Cohesion: 0.20
Nodes (10): development, buildTarget, extractLicenses, optimization, sourceMap, configurations, continuous, defaultConfiguration (+2 more)

### Community 36 - "indicadores.component.ts"
Cohesion: 0.31
Nodes (5): IndicadoresService, PanelIndicadoresResponse, @angular/common, @angular/forms, rxjs

### Community 37 - "api/project.json"
Cohesion: 0.12
Nodes (16): angularCompilerOptions, enableI18nLegacyMessageIdFormat, strictInjectionParameters, strictInputAccessModifiers, strictTemplates, compilerOptions, emitDecoratorMetadata, isolatedModules (+8 more)

### Community 38 - "targets"
Cohesion: 0.18
Nodes (10): compilerOptions, module, moduleResolution, outDir, target, types, extends, files (+2 more)

### Community 39 - "configurations"
Cohesion: 0.22
Nodes (8): compilerOptions, module, moduleResolution, outDir, types, extends, include, ./tsconfig.json

### Community 40 - "prune-lockfile"
Cohesion: 0.25
Nodes (4): Entorno, validarEntorno(), class-transformer, class-validator

### Community 43 - "api/jest.config.cts"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 44 - "options"
Cohesion: 0.13
Nodes (14): compilerOptions, forceConsistentCasingInFileNames, importHelpers, module, noFallthroughCasesInSwitch, noImplicitOverride, noImplicitReturns, noPropertyAccessFromIndexSignature (+6 more)

### Community 45 - "typecheck"
Cohesion: 0.25
Nodes (7): compilerOptions, esModuleInterop, extends, files, include, ../../tsconfig.base.json, references

### Community 55 - "prisma.service.ts"
Cohesion: 0.29
Nodes (6): main(), AREAS, sembrarIdentidad(), argon2, @nestjs/config, @prisma/adapter-pg

### Community 57 - "PrismaService"
Cohesion: 0.20
Nodes (3): PrismaModule, PrismaService, 1. Arquitectura y SOLID

### Community 58 - "overrides"
Cohesion: 0.20
Nodes (10): ajv, picomatch, js-yaml, undici, overrides, @angular-devkit/core@19.0.1, @nestjs/swagger, nx (+2 more)

### Community 59 - "api/src/main.ts"
Cohesion: 0.29
Nodes (4): AppModule, helmet, @nestjs/core, @nestjs/swagger

### Community 60 - "@nestjs/common"
Cohesion: 0.52
Nodes (3): SaludModule, @nestjs/common, @nestjs/terminus

## Knowledge Gaps
- **61 isolated node(s):** `@angular-devkit/core`, `@angular-devkit/schematics`, `@angular/build`, `@angular/cli`, `@angular/compiler-cli` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 454 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` connect `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` to `PrismaService`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `@angular-devkit/core`, `@angular-devkit/schematics`, `@angular/build` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CLAUDE.md — Gestor Web Circadiano (Transporte Cueva S.A.C.)` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.03636363636363636 - nodes in this community are weakly interconnected._
- **Why does `PrismaService` connect `PrismaService` to `PrismaHealthIndicator`, `@nestjs/common`, `prisma.service.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
