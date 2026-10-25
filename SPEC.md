# SPEC.md — Slice 01: Cuenta + Registro de cafeína

> **CircaRuta** · *Tu ritmo, tu ruta, tu seguridad.*
> Contrato de la API: [`api-contract.yaml`](./api-contract.yaml) · Producto: [`PRODUCT.md`](./PRODUCT.md) · Diseño: [`design-system/gestor-circadiano/MASTER.md`](./design-system/gestor-circadiano/MASTER.md)

## 0. Cómo usar este documento

- Describe el flujo **registro → login → registrar café → ver mi consumo** tal como está implementado. `api-contract.yaml` documenta sus endpoints.
- **`CLAUDE.md` prevalece** sobre este archivo (arquitectura, nombres en español, privacidad, modelo de datos). Si algo aquí lo contradice, avisa y corrige este archivo.
- Si encuentras una ambigüedad que este documento no resuelve, **detente y pregunta**. No inventes reglas de negocio.
- Lo marcado con `[POR CONFIRMAR]` ya tiene un valor por defecto: úsalo tal cual hasta que se confirme.

> **Historial.** La primera versión de este SPEC proponía tablas nuevas (`users`, `caffeine_intakes`), bcrypt, rutas en inglés con `/api/v1` y una pantalla `/inicio`. El equipo decidió reutilizar lo existente (`usuario`, `ingesta_cafeina`, Argon2id, rutas de `CLAUDE.md` §4) y llevar «ver mi consumo» a la pestaña **Cafeína** de la tab bar.

---

## 1. Objetivo

El conductor puede **crear su cuenta, iniciar sesión, registrar su consumo de cafeína y ver cuánta lleva hoy, en la semana y cuánta tiene activa ahora**, con una frase concreta: «Te quedan ~120 mg de cafeína activa. Si duermes a las 20:00, evita más café después de las 14:00.»

**Valor para el producto:** conecta el registro con el propósito de CircaRuta (descansar mejor). La cafeína activa es siempre una **estimación**, nunca un dato médico.

## 2. Alcance

| Incluido | Fuera de alcance (otros PR o slices) |
|---|---|
| Consentimiento, registro, login y rutas protegidas (I1, ya existentes) | Recuperar contraseña; login automático tras registrarse (pendiente con I1) |
| Registrar un consumo, también sin señal | Editar un registro (se elimina y se vuelve a crear) |
| Eliminar un registro propio ya enviado | Eliminar sin señal |
| Resumen de hoy, de 7 días y cafeína activa | Vista de supervisión |
| Catálogo de bebidas servido por la API | Notificaciones push (RF10, PR propio) |

---

## 3. Convenciones

- **Nombres:** identificadores, endpoints y columnas en **español sin tildes** (`CLAUDE.md` §9). Textos de la UI en español sencillo.
- **API:** sin prefijo global; rutas de `CLAUDE.md` §4 (`/auth/*`, `/me`, `/cafeina`, `/bebidas`, `/sync/lote`).
- **Fechas:** `timestamptz` en UTC; viajan en ISO 8601 con zona (`2026-10-24T14:30:00.000Z`).
- **Zona horaria de negocio:** `America/Lima` (UTC−5 todo el año). Define qué es «hoy» y cómo se agrupan los días. Las horas se muestran `HH:mm` de 24 h en hora de Lima.
- **IDs de ingesta:** el cliente genera un `client_id` UUID (lo hace el `OutboxService`) y se reutiliza en los reintentos. La tabla conserva su `id_ingesta` entero.
- **Cafeína:** mg; se redondea con `Math.round` solo al mostrar o responder.
- **Prisma:** esquema multiarchivo por slice (`prisma/schema/*.prisma`). Este slice **no agrega tablas ni columnas**.
- **Autenticación:** JWT de I1 (≤ 24 h, con refresh), contraseñas con Argon2id. Toda ruta lleva `JwtAuthGuard`; las nuevas de este slice, `@Roles('trabajador')`.
- **Frontend:** Angular standalone, signals, tokens CSS de `CLAUDE.md` §14 (nunca hex sueltos). Gráficos simples en CSS (sin dependencia nueva).
- **Cálculos:** solo en `libs/domain`; la PWA y la API ejecutan el mismo código (`CLAUDE.md` §1).

---

## 4. Catálogos

**Áreas:** `GET /areas` (público, para el formulario de registro). Viene de la tabla `area`.

**Cargo, rango de edad y sexo:** listas de la PWA en `apps/pwa/src/app/auth/registro.component.ts` (I1). Son opcionales e informativas: **no otorgan permisos**. `[POR CONFIRMAR con Transporte Cueva]`

**Bebidas:** `GET /bebidas`. El frontend **no** duplica la lista; la guarda en el teléfono solo para abrir la pantalla sin señal. Semilla actual (`prisma/seed.ts`) `[POR CONFIRMAR con fuentes del informe]`:

| Bebida | mg por porción | Volumen |
|---|---|---|
| Café pasado | 95 | 240 ml |
| Espresso | 63 | 30 ml |
| Té | 47 | 240 ml |
| Gaseosa cola | 34 | 355 ml |
| Bebida energizante | 80 | 250 ml |
| **Otro** (la PWA lo agrega; el trabajador indica los mg) | — | — |

---

## 5. Modelo de datos

Se usan las tablas existentes, sin cambios de esquema:

- `usuario` (I1, `prisma/schema/i1-plataforma.prisma`): `codigo_participante`, `correo`, `hash_clave`, `semivida_h` (ERD01), consentimiento.
- `bebida` e `ingesta_cafeina` (I4, `prisma/schema/i4-cafeina.prisma`): `cafeina_mg` es el **total** del registro (mg por porción × porciones), `fecha_hora`, `client_id UNIQUE` (ERD06), `residual_estimado_mg`.
- Store Dexie `ingestas` (PWA): copia local `{ clientId, cafeinaMg, nombre }` para el modo sin señal y para el plan offline de I3.

---

## 6. Historias de usuario y criterios de aceptación

### HU-01 · Crear cuenta (I1, existente)
*Como conductor, quiero crear mi cuenta para empezar a registrar mi consumo.*

Flujo: `/consentimiento` («Acepto participar en el estudio», RN11) → `/registro` (correo, clave, área y, opcionales, cargo, rango de edad y sexo) → «Registro listo» con el **código de participante** → «Ingresar».

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| 1 | datos válidos | envío el formulario | veo «Registro listo» y mi código de participante |
| 2 | sin aceptar el consentimiento | intento continuar | el botón «Continuar» está deshabilitado |
| 3 | un correo ya registrado | envío el formulario | veo el error de la API junto al formulario |

> SPEC HU-01 #1 original pedía **iniciar sesión automáticamente** tras registrarse. Hoy se ingresa a mano; queda pendiente con el dueño de I1.

### HU-02 · Iniciar y cerrar sesión (I1, existente)

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| 1 | credenciales correctas | ingreso | llego a «Hoy» (`/plan`) o a la ruta que pedí antes |
| 2 | contraseña incorrecta **o** correo inexistente | ingreso | veo el mismo mensaje de error |
| 3 | sin sesión | entro a `/cafeina` o `/cafeina/nuevo` | voy a `/ingresar` |
| 4 | un token vencido | la API responde 401 | se intenta el refresh; si falla, voy a `/ingresar` |

### HU-03 · Registrar consumo (`/cafeina/nuevo`)
*Como conductor, quiero registrar rápido lo que tomé, también sin señal.*

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| 1 | estoy en `/cafeina/nuevo` | toco una bebida y «Guardar» | se registra con **1 porción** y la **hora actual**, vuelvo a «Mi consumo» y veo «Café registrado.» |
| 2 | una bebida del catálogo | cambio las porciones (1 a 4) | veo en vivo el total de mg |
| 3 | «Otro» | salgo del campo sin mg válidos | veo «Indica los mg (entre 1 y 1000).» y «Guardar» queda deshabilitado |
| 4 | elijo una hora que hoy todavía no llega | guardo | se toma como **ayer** (a las 00:05, «23:50» es el café de anoche en turno nocturno) |
| 5 | sin señal | guardo | veo «Guardado en tu teléfono. Se enviará cuando tengas señal.» y el registro queda «Pendiente de enviar» |
| 6 | un fallo de red o un reintento | la cola vuelve a enviar | **se reutiliza el mismo `client_id`** y no se duplica |

**Reglas (API):**
- Bebida del catálogo: **el servidor calcula `cafeina_mg` = mg por porción × porciones** y descarta lo enviado. Bebida inexistente → 400.
- Sin bebida («Otro»): `cafeina_mg` obligatorio, de 1 a 1000.
- `fecha_hora` entre ahora − 7 días y ahora + 5 minutos; fuera de ese rango → 400.
- `id_usuario` sale siempre del token; enviarlo en el cuerpo → 400 (RNF04).
- **Idempotencia:** mismo `client_id` del mismo usuario → devuelve lo guardado sin crear otro. `client_id` de otro usuario → 409.
- Con señal, la PWA espera el envío (máx. 5 s) antes de volver a «Mi consumo», para que ya lo cuente.

### HU-04 · Ver mi consumo (`/cafeina`, pestaña Cafeína)
*Como conductor, quiero ver cuánta cafeína llevo y cuánta tengo activa para decidir si tomo más.*

En este orden:
1. **Cafeína activa ahora** (sección 7), con estado con icono y texto («Todavía activa» / «Nivel bajo») y siempre «Estimación aproximada, no es un dato médico.»
2. **Total de hoy:** «158 mg · 2 registros».
3. **Barras de los últimos 7 días**, del más antiguo a hoy, con el promedio y una etiqueta accesible por día. Los días sin consumo van en 0.
4. **Registros de hoy:** hora, bebida, mg; «Pendiente de enviar» si sigue en la cola.
5. **Botón principal «Registrar café»** (56 px) → `/cafeina/nuevo`.

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| 1 | sin registros | abro la pestaña | veo «Aún no registras consumos. Empieza con tu primer café.» y el botón principal |
| 2 | 2 registros hoy (95 + 63 mg) | abro la pestaña | el total dice **158 mg · 2 registros** |
| 3 | registros en distintos días | abro la pestaña | las barras agrupan por día de Lima |
| 4 | acabo de registrar un café con señal | vuelvo a la pestaña | el resumen ya lo incluye |
| 5 | sin señal | abro la pestaña | veo «Sin señal: calculado con lo registrado en este teléfono.» con el mismo cálculo del servidor |

### HU-05 · Eliminar un registro

| # | Dado | Cuando | Entonces |
|---|---|---|---|
| 1 | un registro propio ya enviado | toco la papelera | aparece en la misma fila «¿Eliminar este registro?» con «Sí, eliminar» y «Cancelar»; el foco va a «Sí, eliminar» |
| 2 | la confirmación abierta | toco «Sí, eliminar» | desaparece, veo «Registro eliminado.» y el resumen se actualiza |
| 3 | la confirmación abierta | toco «Cancelar» o Escape | se cierra sin borrar |
| 4 | un registro de **otro** usuario | llamo a `DELETE /cafeina/:id` | la API responde 404 (no revela que existe) |
| 5 | sin señal | intento eliminar | veo «Necesitas señal para eliminar un registro.» |

---

## 7. Reglas de negocio

### 7.1 Cafeína activa (estimación)

- **Vida media:** `H = 5` h (RN03; por defecto hasta que I1 exponga `usuario.semivida_h`).
- **Umbral de nivel bajo:** `T = 50` mg, leído de `parametro_sistema.umbral_cafeina_mg` (RN02). Es criterio de diseño, no clínico.
- **Registros considerados:** `fecha_hora` entre `ahora − 24 h` y `ahora`.

```
activeMg(ahora) = Σ cafeina_mg_i × 0.5 ^ ((ahora − fecha_hora_i) / H)

si activeMg ≤ T  → horaNivelBajo = null
si no            → horaNivelBajo = ahora + H × log2(activeMg / T)
```

- Implementado en `libs/domain/src/cafeina.ts` (`calcularCafeinaActiva`, reutiliza `residual()`). Lo usan la API (`GET /cafeina/resumen`) y la PWA sin señal.
- `mg` se redondea **solo al responder**.

**Casos de prueba obligatorios** (unitarios, con `ahora` fijo):

| Registros | `mg` | `horaNivelBajo` |
|---|---|---|
| 100 mg hace 5 h | 50 | `null` |
| 200 mg ahora | 200 | `ahora + 10 h` |
| 95 mg hace 10 h + 63 mg ahora | 87 (23,75 + 63) | `ahora + 5 × log2(86,75/50)` ≈ `ahora + 3 h 58 min 29 s` (±1 min) |
| 300 mg hace 25 h | 0 | `null` (fuera de la ventana de 24 h) |
| ninguno | 0 | `null` |

### 7.2 Hora de corte y hora de dormir

- **No se recalculan en este slice.** Salen del plan del día de I3 (`PlanDiarioDto.inicioSueno` y `horaCorteCafeina`, RN04 + RN05).

**Textos de la tarjeta:**
- Activa y con plan: «Te quedan ~{mg} mg de cafeína activa. Si duermes a las {inicioSueno}, evita más café después de las {horaCorteCafeina}.» (sin corte: «…evita más café por hoy.»)
- Activa y sin plan: «Tienes ~{mg} mg de cafeína activa. Bajará a nivel bajo cerca de las {horaNivelBajo}.»
- En nivel bajo: «Tu cafeína activa está en nivel bajo.» (más la frase del plan, si hay plan).
- Siempre: «Estimación aproximada, no es un dato médico.»

### 7.3 Agrupación por día
- Un día va de 00:00 a 23:59:59.999 en `America/Lima` (`resumirConsumoPorDia`).
- `dias` trae exactamente `N` elementos, del más antiguo al más reciente, y **el último es hoy**.

---

## 8. Pantallas y rutas (Angular)

| Ruta | Acceso | Contenido |
|---|---|---|
| `/consentimiento` | libre | Texto del estudio y casilla «Acepto participar en el estudio» (I1). |
| `/registro` | tras el consentimiento | Formulario HU-01 (I1). |
| `/ingresar` | libre | Correo, clave, «Ingresar» (I1). |
| `/plan` («Hoy») | con sesión | Plan del día de I3. Destino tras ingresar. |
| `/cafeina` («Cafeína») | con sesión | **Mi consumo** (HU-04, HU-05). |
| `/cafeina/nuevo` | con sesión | **Registrar café** (HU-03): rejilla de bebidas con check, «Otro», contador de porciones (− 1 +), hora, total en vivo y «Guardar»; enlace «Mi consumo» para volver. |

**Requisitos de UI** (`CLAUDE.md` §14 y `MASTER.md`): objetivos táctiles ≥ 48 px, botón primario de 56 px, cuerpo de 16 px, tema claro por defecto y modo nocturno de bajo brillo (automático de 22:00 a 06:00 o manual), estado nunca solo con color, `prefers-reduced-motion` respetado, mobile-first desde 360 px.

---

## 9. Errores

La API usa el formato por defecto de NestJS (no hay filtro global todavía):

```json
{ "statusCode": 400, "message": ["La hora no puede estar en el futuro."], "error": "Bad Request" }
```

| HTTP | Cuándo | Qué muestra la PWA |
|---|---|---|
| 400 | Cuerpo o query inválidos; bebida inexistente; hora fuera de rango | El error junto al campo (la PWA valida antes con los mismos textos) |
| 401 | Sin token, inválido o vencido | Refresh o vuelta a `/ingresar` |
| 403 | Rol distinto de `trabajador` | — |
| 404 | `DELETE` de un registro inexistente o ajeno | «No se pudo eliminar. Intenta de nuevo.» |
| 409 | `client_id` usado por otro usuario | La cola lo marca como rechazado |
| sin red | Status 0 | Modo sin señal (HU-03 #5, HU-04 #5) |

---

## 10. Pruebas

**Dominio (`libs/domain`, cobertura ≥ 70 %):** casos de 7.1 y agrupación por día de Lima.

**API (Jest + Supertest):** resumen (7 días con ceros, total de hoy, cafeína activa, umbral de `parametro_sistema`); validación de `POST /cafeina` y `/cafeina/sync/lote`; reglas de HU-03; handler `ingesta` de `/sync/lote`; dueño desde el token, 401 y 403.

**PWA (Jest):** reglas del formulario, cola offline y caché del catálogo, texto de la tarjeta con y sin plan, resumen local, confirmación en fila.

**E2E (Playwright, `npx nx e2e pwa-e2e`):**
1. Flujo feliz: registro → ingresar → «Mi consumo» vacío → «Café pasado» × 2 → **190 mg** y la barra de hoy → eliminar → estado vacío.
2. Sin señal: registrar offline → «Pendiente de enviar» → al volver la señal el servidor lo cuenta.

Requiere PostgreSQL con migraciones y semilla: `docker compose up -d && npm run db:setup`.

---

## 11. Estado y Definición de terminado

Implementado en PRs apilados: #60 (dominio y resumen) → #61 (validación y sincronización) → #62 (registrar café) → #63 (mi consumo) → #64 (e2e) → #66 (pulido). #65 (shell y modo nocturno) va sobre #62.

- [x] Sin cambios de esquema Prisma.
- [x] Endpoints según `api-contract.yaml`, protegidos por rol y en Swagger.
- [x] Pruebas de la sección 10 en verde, junto con `lint` y `build`.
- [x] `/impeccable audit` sin hallazgos graves pendientes en las pantallas de Cafeína.
- [ ] Fusionado en `develop` y verificado en staging.
- [ ] Pendientes `[POR CONFIRMAR]`: áreas, cargos y mg de las bebidas.
