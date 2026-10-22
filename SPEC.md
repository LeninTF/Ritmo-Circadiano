# Spec: Sistema de diseño compartido (tokens del Figma)

Hereda stack, comandos, estructura y convenciones de `CLAUDE.md` (§2, §3, §9). No se repiten aquí.

## Objetivo
Que los 5 integrantes usen los mismos colores, tipografía y componentes del prototipo Figma `0Vxkj2VLxxaXP8fkxT4JdR`. Fuente de verdad: `CLAUDE.md` §14 (tokens) + página espejo en Notion.

## Alcance
- `CLAUDE.md` §14: paleta clara/nocturna, tipografía, radios, espaciado, componentes, reglas (hecho).
- Notion: página "Sistema de diseño" bajo el Hub con la misma tabla (pendiente de confirmar destino).
- Código (fuera de este spec, siguiente paso): `apps/pwa/src/styles/tokens.css` con variables `--color-*`.

## Límites
- Siempre: tokens CSS, nunca hex en componentes; estado semáforo con icono + texto.
- Preguntar antes: crear páginas en Notion (CLAUDE.md §11 lo prohíbe salvo pedido expreso); añadir librería de UI.
- Nunca: copiar PII/datos reales a maquetas; cambiar paleta sin actualizar Figma, §14 y Notion.

## Criterios de éxito
1. Cada hex de §14 existe en el Figma (nodos 2:2, 2:208, 3:2).
2. `tokens.css` expone 1 variable por fila de la tabla, claro y nocturno.
3. `grep` de `#[0-9a-f]{6}` en `apps/pwa/src/app` no devuelve hallazgos.
4. Contraste AA verificado con axe-core (Lighthouse CI) en las 4 pantallas.

## Preguntas abiertas
- Pantalla 02 (Cafeína) no se analizó a nivel de color: solo reutiliza tokens ya listados; confirmar.
- Figma sin variables ni estilos: ¿se quiere que el equipo de diseño los cree para evitar deriva?
- Destino exacto en Notion (¿bajo el Hub `3fb89515…4ad4`?).
