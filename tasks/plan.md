# Plan: Sistema de diseño del Figma en la PWA

Spec: `SPEC.md`. Tokens de referencia: `CLAUDE.md` §14.

## Contexto
`apps/pwa/src/styles.scss` solo tiene 4 tokens genéricos y `apps/pwa/src/app/app.ts` navega con 5 enlaces (Inicio, Turnos, Plan, Cafeina, Diario). El Figma define 4 pestañas (Hoy, Cafeína, Pre-salida, Diario) y una paleta clara/nocturna. No existe `apps/pwa/src/app/compartido/`.

## Dependencias
tokens → (tab bar, tarjeta, semáforo) → pantallas por slice. Sin dependencia de backend.

## Fase 1 — Fundamentos
- **T1 Tokens claro/nocturno**: ampliar `styles.scss` con la tabla de §14, radios, sombra nocturna, selector `[data-tema="oscuro"]`, fuente Inter en `index.html`. Mantener los 4 tokens actuales como alias.
- **T2 Shell con tab bar de 4 pestañas**: `app.ts`, `app.html`, `app.scss`; stub lazy `aptitud` en `app.routes.ts` para Pre-salida (RF15, I5). Turnos/Indicadores salen de la tab bar pero siguen por URL (confirmar con dueño de I2).
- **Checkpoint 1**: build + lint + test verdes; capturas claro/oscuro; sin hex fuera de `styles.scss`.

## Fase 2 — Componentes compartidos (dueño I4)
- **T3 Tarjeta, chip, micro-tarjeta** en `apps/pwa/src/app/compartido/`.
- **T4 Semáforo RN09** (`semaforo-aptitud`) con `ColorSemaforo` de `libs/contracts`; icono + texto + color.
- **Checkpoint 2**: revisión de dueños I4 e I5; axe-core sin errores.

## Fase 3 — Pantallas (en paralelo tras Checkpoint 2)
- **T5 Plan/Hoy** (I3), **T6 Cafeína** (I4), **T7 Pre-salida** (I5), **T8 Diario** (I5, solo tokens).
- **Checkpoint 3**: `npx nx affected -t typecheck lint test build`, Lighthouse CI/axe en las 4 pantallas, `graphify update .`, PRs ≤ 400 líneas.

## Riesgos
- Cambiar la navegación toca archivos de I2/I3/I5: declararlo en la PR (§4).
- `--color-texto-3` (#98a2b3) falla AA en 9–10 px.
- Figma sin variables: puede haber deriva de valores.
- Pantalla 02 (Cafeína) no auditada a nivel de color.

## Preguntas abiertas
1. ¿Tab bar de 4 pestañas confirmada y destino de Turnos/Indicadores (I2)?
2. ¿Tema nocturno solo automático o también manual?
3. ¿Se crea antes la página de Notion?
