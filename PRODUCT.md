# PRODUCT.md — CircaRuta

<!-- impeccable:product-schema 1 -->

> **Tu ritmo, tu ruta, tu seguridad.**

Este archivo describe **qué es el producto y para quién existe**. No define colores, tipografías ni estilo visual; eso va en `DESIGN.md` y en las variables de Figma.
Las líneas marcadas con `[POR CONFIRMAR]` son supuestos del equipo que deben validarse con el cliente.

---

## Platform

web

PWA instalable, mobile-first (lienzo base 390 px). La vista de supervisión se usa en escritorio o tablet.

---

## 1. Propósito

CircaRuta es una PWA mobile-first que ayuda a los conductores de **Transporte Cueva S.A.C.** (Ica, Perú) a reducir la fatiga y la somnolencia al volante. Para lograrlo, alinea su descanso con tres factores reales:

1. **Su turno real**, no el turno teórico.
2. **El fotoperiodo local**, es decir, la hora en que amanece y oscurece donde está el conductor.
3. **Su consumo de cafeína**: café pasado, espresso, té, gaseosa cola y bebida energizante (catálogo de `prisma/seed.ts`). La hoja de coca y otros estimulantes sin cafeína quedan **fuera del alcance**: el cálculo solo modela cafeína en mg.

El objetivo es que la app indique **cuándo descansar, cuánto descansar y cuándo evitar la cafeína**, de forma simple y en el momento en que el conductor lo necesita.

**Qué no es:** no es un dispositivo médico, no diagnostica trastornos del sueño y no reemplaza la normativa de jornada laboral. Es una herramienta de apoyo a la prevención. Sus datos **no se usan con fines disciplinarios** y participar es voluntario.

---

## Positioning

El plan se calcula con el turno real asignado por la empresa, el amanecer/atardecer local de Ica y la cafeína residual; corre igual sin señal; y la empresa nunca ve datos individuales.

---

## 2. Usuarios

### Usuario principal: conductor (rol `trabajador`)
- Trabaja en turnos rotativos o nocturnos.
- Usa la app en el celular, muchas veces **de noche, cansado y con poco tiempo**.
- Puede tener poca familiaridad con la tecnología. `[POR CONFIRMAR edad promedio y nivel digital]`
- Puede estar en ruta con **conexión intermitente o sin señal**.
- **Nunca debe interactuar con la app mientras conduce.** Solo la usa antes del turno, durante pausas o al terminar.

### Usuarios secundarios
- **Jefatura de operaciones (`jefe_operaciones`):** asigna turnos y revisa el panorama de fatiga del equipo. Solo ve **agregados de 5 o más trabajadores**; si hay menos, la app responde que los datos no son suficientes. Usa escritorio o tablet, de día.
- **Despachador (`despachador`):** antes de la salida ve **solo el color del semáforo de aptitud**, y solo si el conductor decidió compartirlo.
- **Administración (`administrador`):** gestiona usuarios, áreas, parámetros del sistema y la exportación anonimizada del estudio.

---

## 3. Contexto de uso

| Situación | Implicancia para el producto |
|---|---|
| Uso nocturno o con poca luz | La interfaz no debe deslumbrar ni romper el descanso. |
| Usuario cansado | Pocas decisiones por pantalla, acciones obvias y textos cortos. |
| Pausas breves en ruta | Las tareas clave se completan en menos de 30 segundos `[POR CONFIRMAR]`. |
| Sin conexión | Registrar descansos y consultar recomendaciones funciona offline y se sincroniza después. |
| Manos ocupadas o guantes `[POR CONFIRMAR]` | Botones y áreas táctiles grandes. |
| Vehículo en movimiento | La app no pide interacción ni muestra alertas que distraigan al conducir. |
| Antes de salir a ruta | El conductor hace un autorreporte de pre-salida (sueño de las últimas 24 h y somnolencia) y obtiene un semáforo verde, ámbar o rojo. |

---

## 4. Tareas clave (por orden de importancia)

1. **Ver mi estado ahora:** si debo descansar o si estoy en buen momento.
2. **Registrar descanso y sueño:** inicio, fin y calidad percibida.
3. **Registrar mi turno real:** cuándo empecé y cuándo terminé realmente.
4. **Registrar el consumo de cafeína:** qué tomé y a qué hora.
5. **Recibir una recomendación concreta:** por ejemplo, "Descansa 20 min antes de las 03:00" o "Evita cafeína después de las 02:00".
6. *(Supervisión)* Ver el panorama de fatiga del equipo y las alertas, siempre en agregado.

Si una pantalla no ayuda a alguna de estas tareas, probablemente sobra.

---

## 5. Voz y tono

- **Directo y breve.** Se usan frases de acción: "Descansa ahora", no "Se recomienda considerar un periodo de descanso".
- **Cercano, sin infantilizar.** Se habla de tú, como un compañero que cuida, no como un jefe que controla.
- **Sin culpa.** Si el conductor durmió poco, la app lo orienta; no lo regaña.
- **Español peruano claro**, sin tecnicismos médicos. Se dice "ritmo de sueño", no "ritmo circadiano", en la interfaz del conductor.
- **Las alertas de riesgo son serias, pero no alarmistas.** Siempre dicen qué hacer a continuación.
- En Pre-salida se muestra siempre: "Herramienta preventiva de apoyo. No reemplaza la evaluación médica ni autoriza la salida."

---

## 6. Restricciones

### Técnicas
- **Arquitectura:** monolito modular con Angular PWA (offline) + API REST en NestJS + PostgreSQL.
- **Offline-first:** las tareas 1 a 5 deben funcionar sin conexión.
- **Mobile-first:** se diseña primero para celular y después para escritorio (vista de supervisión).
- **Equipo:** 5 integrantes que trabajan por tajadas verticales; cada uno es full-stack de su módulo. Todos deben usar los mismos componentes y tokens.

### Calendario
- **Piloto:** lunes 26 de octubre de 2026 (code freeze el jueves 22 de octubre).
- **Producción:** domingo 22 de noviembre de 2026 (code freeze el miércoles 18 de noviembre).

### Accesibilidad
- Contraste suficiente también en el modo nocturno.
- Respetar `prefers-reduced-motion`; el movimiento es mínimo y solo informativo.
- La información nunca depende únicamente del color: un estado de riesgo también lleva texto o ícono.

### Privacidad
- Los datos de sueño, descanso y consumo son **datos personales sensibles**.
- La empresa solo ve agregados de 5 o más trabajadores; el despachador, solo el color del semáforo compartido.
- Los participantes del estudio se identifican por código (P01–P17), nunca por nombre o correo.
- Se debe cumplir la Ley N.° 29733 de Protección de Datos Personales del Perú.

---

## 7. Gestión del proyecto

- El proyecto sigue el **PMBOK** (7.ª y 8.ª ed.) integrado con **Scrum** y **Kanban**.
- Proyecto académico UTP con estudio pretest/postest real sobre 17 participantes.
- Las decisiones de diseño y los reportes de revisión de calidad se guardan como evidencia para el informe final.

---

## 8. Evidencia y supuestos

| Afirmación | Estado |
|---|---|
| Los conductores de Transporte Cueva presentan fatiga y somnolencia asociadas a sus turnos. | Caso de estudio del proyecto |
| Alinear el descanso con el turno real y la luz natural reduce la somnolencia. | Base del análisis del gestor — `[citar fuentes en el informe]` |
| Los conductores usan celular Android de gama media. | `[POR CONFIRMAR]` |
| Hay zonas de ruta sin señal. | `[POR CONFIRMAR rutas]` |
| La supervisión necesita una vista propia. | Confirmado: roles `jefe_operaciones` y `despachador` |

### Evidence on Hand
- Informe del proyecto: `contexto/avance01.md` (procesos, indicadores, criterios Gherkin CP-01…CP-16).
- Prototipo Figma "Gestor Circadiano — Prototipo PWA" (`0Vxkj2VLxxaXP8fkxT4JdR`): pantallas Dashboard, Cafeína, Pre-salida y Dashboard nocturno.
- Catálogo de bebidas con mg de cafeína en `prisma/seed.ts`.
- **No hay** testimonios, citas de conductores, logotipos de clientes ni resultados del estudio todavía. No se deben inventar.

---

## 9. Cómo saber si funciona `[POR CONFIRMAR metas]`

- Porcentaje de conductores que registran su descanso al menos una vez por turno durante el piloto.
- Tiempo promedio para registrar un descanso (meta: menos de 30 s).
- Reducción de la somnolencia autorreportada entre el inicio y el final del piloto.
- Ningún uso de la app detectado con el vehículo en movimiento.

---

## Product Principles

1. **Prevenir, nunca vigilar.** Todo lo que ve la empresa es agregado o compartido por decisión del conductor; nada sirve para sancionar.
2. **Una recomendación, no un tablero.** El conductor cansado recibe qué hacer y a qué hora, no datos para interpretar.
3. **Funciona sin señal.** Si una tarea del conductor no corre offline, no está terminada.
4. **El mismo cálculo en todas partes.** El celular y el servidor dan la misma hora de corte y el mismo plan; la exactitud de los cálculos no se negocia.
5. **Nunca mientras conduce.** La app se usa antes, en pausas o después del turno.
