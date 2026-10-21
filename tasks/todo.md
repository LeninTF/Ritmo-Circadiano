# Tareas: Sistema de diseño PWA

## Fase 1 — Fundamentos
- [x] T1: Tokens claro/nocturno
  - Aceptación: cada fila de CLAUDE.md §14 tiene variable en ambos temas; los 4 tokens actuales siguen como alias
  - Verify: `npx nx build pwa`; revisar claro/oscuro en `npx nx serve pwa`
  - Files: `apps/pwa/src/styles.scss`, `apps/pwa/src/index.html`
- [x] T2: Shell con tab bar de 4 pestañas
  - Aceptación: Hoy, Cafeína, Pre-salida, Diario; activa en `--color-primario` semibold; objetivo táctil ≥ 44 px
  - Verify: `npx nx test pwa` (app.spec.ts actualizado) y `npx nx build pwa`
  - Files: `apps/pwa/src/app/app.ts`, `app.html`, `app.scss`, `app.routes.ts`, `app.spec.ts`, stub `paginas/aptitud/`
- [ ] Checkpoint 1: build + lint + test verdes; capturas claro/oscuro; sin hex fuera de `styles.scss`

## Fase 2 — Componentes compartidos
- [x] T3: Tarjeta, chip y micro-tarjeta
  - Aceptación: solo `var(--*)`; un spec por componente
  - Verify: `npx nx test pwa`
  - Files: `apps/pwa/src/app/compartido/{tarjeta,chip,micro-tarjeta}/`
- [x] T4: Semáforo RN09
  - Aceptación: recibe `ColorSemaforo`; muestra icono + texto + color para verde/ámbar/rojo
  - Verify: spec con los 3 colores
  - Files: `apps/pwa/src/app/compartido/semaforo-aptitud/`
- [ ] Checkpoint 2: revisión de dueños I4 e I5; axe-core sin errores

## Fase 3 — Pantallas
- [ ] T5: Plan/Hoy (I3) — héroe, 3 micro-tarjetas, curva 24 h, recomendaciones (`paginas/plan/`)
- [ ] T6: Cafeína (I4) — mg actual, curva de decaimiento, catálogo, historial (`paginas/cafeina/`)
- [ ] T7: Pre-salida (I5) — stepper, somnolencia, chips, resultado, aviso (`paginas/aptitud/`)
- [ ] T8: Diario (I5) — solo adopta tokens y componentes (`paginas/diario/`)
  - Aceptación (T5–T8): sin hex en componentes; sin datos de sueño/cafeína en logs; PR ≤ 400 líneas cada una
  - Verify: `npx nx affected -t typecheck lint test build`
- [ ] Checkpoint 3: Lighthouse CI/axe en las 4 pantallas; `graphify update .`
