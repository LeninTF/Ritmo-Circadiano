# MASTER — CircaRuta (Transporte Cueva S.A.C.)

Fuente de verdad visual global de la PWA. Si existe `pages/<pantalla>.md`, sus reglas prevalecen sobre este archivo para esa pantalla.
Base: `CLAUDE.md` §14 (Figma `0Vxkj2VLxxaXP8fkxT4JdR`). Las filas marcadas **Δ §14** cambiaron valores anteriores de §14; ya están incorporadas en §14 (24 oct 2026). Página de Notion "Sistema de diseño" alineada el mismo día. Pendiente: frames 01–04 de Figma.

## 1. Principios

1. **Una pregunta por pantalla.** Cada pantalla responde una sola cosa: "¿cuándo duermo?", "¿puedo tomar café?", "¿estoy apto?". Un solo CTA primario.
2. **Adultos primero.** Usuarios de 25–60 años, conductores, a menudo cansados o con poca luz. Texto grande, botones grandes, palabras simples, nada que dependa de gestos ocultos.
3. **La hora es la protagonista.** Las horas se leen de un vistazo: cifras grandes, `HH:mm` 24 h, cifras tabulares.
4. **Nunca solo color.** Todo estado (semáforo, racha, corte) lleva icono + texto.
5. **Calma, no alarma.** Herramienta preventiva y no disciplinaria (RN11): tono amable, sin rojo dominante salvo riesgo real.

## 2. Referencias y qué tomamos de cada una

| Referencia | Qué tomamos | Dónde aplica |
|---|---|---|
| Aaptiv (godly.design/app/aaptiv) | Horario como lista vertical limpia: hora grande a la izquierda, actividad a la derecha, mucho aire, una tarjeta héroe con "lo siguiente". Sin decoración. | Hoy (plan diario, ventana de descanso, próximos eventos) |
| ASICS Runkeeper (godly.design/app/asics-runkeeperrun-tracker) | Cifra resumen grande encima del gráfico; barras semanales con línea de meta; racha como fila de 7 círculos (check = cumplido); calendario mensual con puntos. | Diario (historial de sueño, racha de días con ≥ 7 h), curva circadiana |
| YAZIO (godly.design/app/ai-calorie-tracker-by-yazio) | Buscador + chips de categoría; "Recientes" primero; rejilla de tiles con icono, nombre y cantidad; al tocar, hoja inferior con tamaño de porción (stepper/segmentos) y el efecto calculado en vivo antes de confirmar. | Cafeína (registrar bebida) |

## 3. Color

Tokens CSS en `apps/pwa/src/styles`. Nunca hex sueltos en componentes.

### 3.1 Tema claro (igual a §14, con dos correcciones de contraste)

| Token | Valor | Contraste | Uso |
|---|---|---|---|
| `--color-fondo` | `#f2f4f7` | — | Fondo de pantalla |
| `--color-superficie` | `#ffffff` | — | Tarjetas, tab bar |
| `--color-superficie-2` | `#eaecf0` | — | Botón secundario, tiles |
| `--color-borde` | `#d0d5dd` | — | Bordes |
| `--color-texto` | `#101828` | 17.8:1 | Texto principal |
| `--color-texto-2` | `#475467` | 7.7:1 | Texto secundario |
| `--color-texto-3` **Δ §14** | `#667085` (antes `#98a2b3`) | 5.0:1 (antes 2.6:1, falla AA) | Etiquetas, pie |
| `--color-primario` | `#3538cd` | 8.1:1 (texto blanco encima) | CTA, tab activa |
| `--color-ok` / `--color-alerta` / `--color-peligro` | `#12b76a` / `#f79009` / `#f04438` | 2.1–3.8:1 | **Solo rellenos, iconos y barras**, nunca texto |
| `--color-ok-texto` **Δ §14** (nuevo) | `#067647` | 5.7:1 | Texto de estado verde |
| `--color-alerta-texto` **Δ §14** (nuevo) | `#b54708` | 5.4:1 | Texto de estado ámbar |
| `--color-peligro-texto` **Δ §14** (nuevo) | `#b42318` | 6.6:1 | Texto de estado rojo |

### 3.2 Modo nocturno de bajo brillo **Δ §14**

Pensado para turno nocturno y antes de dormir: sin blanco puro, sin negro puro, colores desaturados, fondo plano (se elimina el degradado de §14 para no generar bandas brillantes). Contrastes medidos sobre `--color-superficie`.

| Token | Valor | Contraste | Nota |
|---|---|---|---|
| `--color-fondo` | `#0e1320` | — | Plano, sin degradado |
| `--color-superficie` | `#161d2e` | — | Tarjetas (borde `#232c42`) |
| `--color-superficie-2` | `#1d2539` | — | Tiles, botón secundario |
| `--color-borde` | `#232c42` | — | |
| `--color-texto` | `#e4e7ee` | 13.6:1 | Gris claro, **no** `#ffffff` |
| `--color-texto-2` | `#a9b2c6` | 7.9:1 | |
| `--color-texto-3` | `#8590a8` | 5.2:1 | Ya cumple AA en 11 px |
| `--color-primario` | `#8e96ec` | 6.2:1 | Texto de botón primario: `#0e1320` (6.8:1) |
| `--color-ok` | `#4fc08f` | 7.4:1 | Válido como texto |
| `--color-alerta` | `#e2a83f` | 7.9:1 | Válido como texto |
| `--color-peligro` | `#e57b74` | 5.9:1 | Válido como texto |

Reglas del modo nocturno:
- Sin sombras de brillo ni glow; elevación por cambio de superficie (`superficie` → `superficie-2`). La sombra de §14 (`0 8px 24px rgba(0,0,0,.35)`) se mantiene solo en hojas inferiores.
- Ilustraciones/imágenes con `filter: brightness(.85)`.
- Activación: `prefers-color-scheme: dark` + `[data-tema="oscuro"]` + opción "Activar automáticamente al anochecer" (usa `evento_solar`).

## 4. Tipografía

Familia **Inter** (se mantiene §14; se descarta la sugerencia Lora/Raleway del generador: serif y Raleway fino se leen peor en pantallas pequeñas con poca luz). `font-variant-numeric: tabular-nums` en toda hora y cifra.

**Δ §14:** el cuerpo sube de 12–13 px a 16 px (público adulto, evita zoom automático en iOS). Mínimo absoluto en la app: 13 px, y solo para pies no esenciales.

| Rol | Tamaño / alto de línea | Peso |
|---|---|---|
| Cifra héroe (hora, mg) | 40 / 46 | 700 |
| Título de pantalla | 24 / 32 | 700 |
| Cifra de tile | 22 / 28 | 700 |
| Título de tarjeta | 18 / 24 | 600 |
| Cuerpo | 16 / 24 | 400 |
| Botón | 17 / 22 | 600 |
| Etiqueta | 14 / 20 | 500 |
| Micro-etiqueta (MAYÚSCULAS) | 13 / 16, `letter-spacing` 0.5 px | 600 |

Soportar zoom del sistema hasta 200 % sin cortar texto (envolver, no truncar).

## 5. Espaciado, forma y tamaño táctil

Escala de 4 px, densidad espaciosa: `--esp-1: 4px` · `--esp-2: 8px` · `--esp-3: 12px` · `--esp-4: 16px` · `--esp-5: 20px` · `--esp-6: 24px` · `--esp-8: 32px` · `--esp-12: 48px`.

- Lienzo 390 px, margen lateral 20 px; padding de tarjeta 20; gap entre bloques 16; gap de tiles 12.
- Radios: tarjeta 16 · tile 16 · botón 14 · chip 20 · hoja inferior 24 (arriba).

**Botones grandes** **Δ §14**

| Tipo | Alto mín. | Uso |
|---|---|---|
| Primario | **56 px**, ancho completo | Una acción principal por pantalla ("Registrar", "Confirmar turno") |
| Secundario | 52 px | Acción alternativa, fondo `superficie-2` |
| Chip / segmento | 44 px | Filtros, tamaños de porción |
| Icono suelto | área táctil 48×48 aunque el icono mida 24 | Cerrar, info |
| Tab bar | 64 px + safe-area | 4 pestañas con icono 24 y texto 13 |

Separación mínima entre objetivos táctiles: 8 px. Estado presionado: opacidad 0.85 + escala 0.98, 100 ms; foco visible 3 px `primario` con separación 2 px.

## 6. Patrones clave

**Hoy (Aaptiv):** tarjeta héroe "Ventana de descanso" con rango en 40 px → lista "Tu día" con filas de 64 px: hora (22/700) · icono · texto (16) · estado. La fila actual se marca con barra lateral `primario` y la etiqueta "AHORA".

**Diario y rachas (Runkeeper):** encabezado con cifra resumen ("6 h 48 min · promedio semanal") → barras de 7 días (alto 160, radio 6, línea de meta 7 h discontinua con texto "Meta 7 h") → fila de racha de 7 círculos de 40 px (check + inicial del día; cumplido = `ok` con icono, no cumplido = borde) → texto "Racha: 4 días". Cada barra tocable (≥ 44 px de ancho de zona) muestra el valor exacto; tabla alternativa para lector de pantalla.

**Cafeína (YAZIO):** buscador → chips (Todas · Café · Té · Energizante · Gaseosa · Otros) → "Recientes" → rejilla 2 columnas de tiles de 104 px (icono 32, nombre 16/600, "95 mg" 14) → hoja inferior: tamaño (Pequeño · Mediano · Grande) como segmentos de 44 px, cifra mg en vivo, y "Con esta bebida tu último café sería a las 14:30" antes del botón "Registrar" de 56 px. Deshacer durante 5 s tras registrar.

**Pre-salida:** stepper de 3 pasos, slider de somnolencia de 5 pasos con caras/etiquetas de texto, resultado con icono + texto grande ("APTO", "APTO CON MEDIDAS", "NO RECOMENDADO") + aviso fijo de §14.

## 7. Iconos y movimiento

- Un solo set lineal (Lucide o Phosphor, trazo 2 px), tamaños 20 / 24 / 32. Sin emojis.
- Movimiento sutil: 150–250 ms, `ease-out` al entrar, salida ~70 % de la entrada. Solo transform/opacity. Con `prefers-reduced-motion` sin animación.

## 8. Lo que debe evitarse

- Blanco puro (`#ffffff`) como texto o fondo en modo nocturno; negro puro `#000`.
- Degradados, glow, neón, glassmorphism o fondos con imagen.
- Texto de cuerpo < 16 px; cualquier texto < 13 px; texto fino (peso < 400).
- `ok`/`alerta`/`peligro` claros como color de texto (fallan AA); usar las variantes `-texto`.
- Comunicar estado solo con color.
- Más de un CTA primario por pantalla; botones < 44 px; iconos sin área táctil de 48 px.
- Gestos ocultos (deslizar para borrar) sin botón visible equivalente.
- Gráficos sin cifra resumen, sin unidades o con más de 7–8 barras en móvil.
- Jerga clínica ("ritmo circadiano desfasado") en la UI: decir "tu cuerpo está en su hora más baja".
- Rojo para fallar una racha o lenguaje que suene a sanción (RN11).
- Carruseles automáticos, modales para navegar, spinners largos (usar skeleton).
- Hex sueltos en componentes; Lora/Raleway u otra familia distinta de Inter.

## 9. Checklist de entrega

- [ ] Contraste ≥ 4.5:1 en ambos temas (medir, no suponer).
- [ ] Botón primario 56 px; todo objetivo ≥ 44 px con 8 px de separación.
- [ ] Cuerpo 16 px; zoom 200 % sin cortes.
- [ ] Estados con icono + texto; gráficos con resumen textual.
- [ ] Modo nocturno probado de noche con brillo bajo.
- [ ] `prefers-reduced-motion` respetado; foco visible.
