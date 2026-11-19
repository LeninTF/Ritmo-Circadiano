# Validación pendiente en staging

Estado al 19 nov 2026, rama `develop` (`b5a64f0`). Consolida lo que falta validar después de la prueba automatizada de los 11 módulos de la *Matriz de funcionalidades*.

- PWA: https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev
- API: https://ritmo-circadiano.onrender.com (Swagger en `/docs`)
- Cuentas: `docs/credenciales-prueba.md` (A01, J01, D01, T01–T05). **No usar el registro público para probar**: gasta códigos P del estudio.

## Resumen

| # | Qué falta | Tipo | Bloqueado por | Quién |
|---|---|---|---|---|
| 1 | Panel de Indicadores en la PWA | Re-prueba tras corregir | Bug B1 | I2 |
| 2 | Grilla de Turnos en la PWA (ver, crear, importar, editar) | Re-prueba tras corregir | Bug B2 | I2 |
| 3 | RN01: acumulado y ventana móvil de 24 h | Re-prueba tras corregir | Bug B3 | I2 |
| 4 | Validación de `hasta` en `/cafeina/residual` | Re-prueba tras corregir | Bug B4 | I4 |
| 5 | Notificaciones push en celular | Manual | — | I4 |
| 6 | Instalación de la PWA (Android e iOS) | Manual | — | I4 |
| 7 | Modo offline en la PWA (sin red y reconexión) | Manual | — | I5 |
| 8 | Flujos del trabajador completos desde la PWA | Manual | Turno asignado (B2 o API) | I3, I4, I5 |
| 9 | Plan nocturno, siesta (RN06) y protección de luz (RN08) | Manual o API | Turno asignado | I3 |
| 10 | Regenerar el plan al corregir un turno (`TurnoAsignado`) | API | — | I3, I5 |
| 11 | Cambio de parámetros por el admin (RN02) | Manual | — | I1 |
| 12 | Auditoría (`audit_log`) | Consulta SQL | Acceso a Neon/Supabase | I1 |
| 13 | Borrado en cascada de `DELETE /me` | Consulta SQL | Acceso a Neon/Supabase | I1 |
| 14 | Exportación CSV con datos reales | Manual | 5 o más participantes con pretest | I1 |
| 15 | Semivida por usuario (RN03) | **Falta implementar** | Código | I4 |
| 16 | Heurística para turnos de tarde | Decisión del equipo | — | I3 |
| 17 | Limpieza antes de producción | Tarea | — | I1 |

## Bugs abiertos

| ID | Slice | Archivo | Problema |
|---|---|---|---|
| B1 | I2 | `apps/pwa/src/app/paginas/indicadores/indicadores.service.ts` | `baseUrl = '/api/indicadores'`: no usa `environment.apiUrl` y tiene `/api` de más. La petición va a Cloudflare, que devuelve `index.html`, y la pantalla muestra "n < 5". |
| B2 | I2 | `apps/pwa/src/app/paginas/turnos/turnos.service.ts`, `turnos.component.ts` | `baseUrl = '/operaciones'` sin `environment.apiUrl`. Además, la grilla consulta `/turnos/me` (el jefe vería solo sus turnos) y trae un UUID ficticio por defecto. |
| B3 | I2 | `apps/api/src/modulos/operaciones/operaciones.service.ts` (`crearTurno`) | El turno se crea y luego se valida RN01 sin excluirlo: se cuenta dos veces. Además se suma por `fecha` y no por ventana móvil de 24 h. |
| B4 | I4 | `apps/api/src/modulos/cafeina/cafeina.controller.ts` (`calcularResidual`) | `hasta=abc` devuelve 500 y una fecha ISO devuelve 200 con 0 mg. Debe responder 400. |

Menores: el trabajador ve los botones "Nuevo" e "Importar" en `/turnos`; al ingresar, todos los roles van a `/plan` y ven pestañas del trabajador.

---

## Paso a paso

Antes de cada sesión: abrir `https://ritmo-circadiano.onrender.com/health` y esperar el 200 (el primer acceso tarda unos 50 s). Usar una ventana de incógnito por rol. Límite: 10 inicios de sesión por minuto.

### 1. Indicadores (tras corregir B1)
1. Ingresar como **J01** e ir a `/indicadores`.
2. Abrir DevTools › Network: la petición debe ir a `ritmo-circadiano.onrender.com/indicadores/panel`, no a `workers.dev`.
3. Sin fechas: deben verse los indicadores (conductores únicos, turnos, horas promedio, adherencia).
4. Filtrar un rango sin turnos: debe aparecer "Privacidad protegida (n < 5)".
5. **Correcto si:** no aparece ningún código P ni correo, y con menos de 5 conductores no se muestran cifras.

### 2. Turnos en la PWA (tras corregir B2)
1. Ingresar como **J01** e ir a `/turnos`: la grilla de la semana debe mostrar los turnos de todo el equipo.
2. **Nuevo turno** para T01: diurno de 4 h → se guarda y aparece en la grilla.
3. **Nuevo turno** nocturno de 5 h → debe pedir confirmación de exceso (RN01). Confirmar con motivo → se guarda.
4. **Importar** un CSV con este encabezado y 2 filas → "2 importados":
   `idUsuario,idRuta,fecha,inicioProgramado,finProgramado,horasConduccion,esNocturno`
5. Editar y eliminar un turno.
6. Ingresar como **D01**: debe ver la grilla. Como **T01**: no debe ver "Nuevo" ni "Importar", solo sus turnos.

### 3. RN01 (tras corregir B3)
Con J01, por API (Swagger `/docs` › Authorize) o desde la PWA:
1. Mismo trabajador y mismo día: un turno de 3 h y otro de 4 h → **ambos se aceptan** (7 h).
2. Agregar uno de 4 h más → 409 (11 h > 10 h) y el detalle debe decir `horasAcumuladasDia: 11`.
3. Ventana móvil: el día D, un turno de 13:00 a 17:00 (4 h) y otro de 18:00 a 21:00 (3 h); el día D+1, uno de 07:00 a 11:00 (4 h) → el tercero da **409**: 11 h dentro de 24 h, aunque por día calendario sean 7 h y 4 h.
4. Nocturno de 4,5 h → 409 por continuo (límite 4 h). Con `?forzar=true` y motivo → 201.

### 4. Residual de cafeína (tras corregir B4)
1. Como T01, en Swagger: `GET /cafeina/residual?hasta=abc` → **400**.
2. Con `hasta` en horas desde 1970 (por ejemplo `Date.now()/3600000 + 6`) → 200 con un valor coherente.

### 5. Notificaciones push (celular)
**Android (Chrome):**
1. Abrir la PWA, ingresar como T01 y, en **Hoy**, tocar "Activar recordatorios". Aceptar el permiso.
2. Pedir a J01 que asigne a T01 un turno para mañana (el plan genera recordatorios futuros).
3. Como T01, abrir **Hoy** para que se genere el plan.
4. Esperar a la hora del primer recordatorio (luz, corte de cafeína o inicio de sueño). El servidor revisa cada minuto.
5. **Correcto si:** llega la notificación "CircaRuta (…)" y al tocarla abre la pantalla que corresponde (el corte de cafeína abre `/cafeina`).

**iPhone (iOS 16.4 o superior):** primero instalar la PWA (punto 6). Sin instalarla, iOS no permite push. Luego repetir los pasos de Android desde el ícono instalado.

Para probar rápido sin esperar: crear un turno que empiece en unas 2 h, así el primer recordatorio cae pronto.

### 6. Instalación de la PWA
1. **Android:** Chrome › menú › "Instalar aplicación". Abrir desde el ícono: sin barra del navegador, con el ícono y el nombre CircaRuta.
2. **iOS:** Safari › Compartir › "Agregar a inicio". Verificar que la app muestra la guía de instalación antes de pedir el permiso de notificaciones.

### 7. Offline (RNF03)
1. Con T01 ingresado y con red, abrir Hoy, Cafeína y Diario (se guardan en caché).
2. Activar el modo avión.
3. Registrar un café en **Cafeína › Registrar café** y llenar el **Diario**. Ambos deben guardarse sin error y quedar en cola.
4. Cerrar y volver a abrir la app sin red: el plan y los datos siguen visibles.
5. Quitar el modo avión: la cola se sincroniza sola.
6. Verificar con otra sesión de T01 (otro navegador) que aparece **un solo** café y **un solo** registro de diario, sin duplicados.

### 8. Flujos del trabajador desde la PWA
Requiere que T01 tenga un turno (punto 2, o crearlo por Swagger como J01). Con T01:
1. **Cronotipo** (`/cronotipo`): responder las 5 preguntas → debe mostrar la categoría (por ejemplo, todas las respuestas máximas = matutino definido).
2. **Ubicación:** aceptar la geolocalización o elegir sede Ica → amanecer y atardecer coherentes (Ica ≈ 05:25 y 18:15).
3. **Hoy** (`/plan`): ventana de descanso, picos, "Café hasta" y luz natural. Las horas en formato 24 h.
4. **Cafeína:** registrar desde el catálogo y en mg directos, ver el residual y borrar un registro.
5. **Diario:** registrar la noche anterior y volver a guardar el mismo día (debe reemplazar, no duplicar).
6. **Pre-salida** (`/aptitud`): con 8 h de sueño → verde "APTO"; con 6 h → ámbar; con 4 h o somnolencia 4–5 → rojo. Marcar "compartir".
7. Como **D01**, en `/despacho` con la fecha de hoy: aparece T01 con el color, **sin horas ni respuestas**. Un trabajador que no compartió no debe aparecer.
8. **Historial** (`/historial`): gráficos de 7, 14 y 30 días.

### 9. Plan nocturno, siesta y luz (RN06, RN08)
1. J01 asigna a T02 un turno nocturno de 22:00 a 02:00 (4 h).
2. T02 abre **Hoy** y comprueba:
   - inicio del sueño = fin del turno + 60 min (03:00);
   - aviso de "proteger de luz intensa" entre el fin del turno y el inicio del sueño;
   - si el turno no deja 7 h de sueño en 24 h, aparece una siesta de 90 min que termina al menos 60 min antes del turno.

### 10. Regenerar el plan al corregir un turno
1. T01 con plan generado para hoy: anotar la ventana de descanso.
2. En **Hoy**, "Corregir" el horario real del turno (por ejemplo, empezar 2 h más tarde).
3. **Correcto si:** el plan se recalcula solo y cambian la ventana de descanso y el corte de cafeína.

### 11. Parámetros (RN02)
1. Como A01, en `/admin/parametros`, cambiar `umbral_cafeina_mg` de 50 a 30 y guardar.
2. Como T01, en Cafeína: el residual se compara contra 30 mg y la hora de corte se adelanta.
3. **Volver a dejarlo en 50.**

### 12. Auditoría
En el editor SQL de Neon/Supabase (solo lectura):
```sql
SELECT accion, recurso, fecha FROM audit_log ORDER BY fecha DESC LIMIT 30;
```
Debe haber filas de `login`, `turno_forzado`, `exportacion`, `parametro_actualizado`, `usuario_actualizado` y `borrado_cuenta`, generadas por las pruebas de los puntos 1–11 y por la limpieza del 19 nov. **Ninguna fila debe contener datos de sueño, cafeína ni correos.**

### 13. Borrado en cascada (`DELETE /me`)
El 19 nov se borraron 7 cuentas QA (P14–P20) con 204. Para confirmar que no quedó nada:
```sql
SELECT 'turnos' t, count(*) FROM turno_laboral tl LEFT JOIN usuario u ON u.id = tl.id_usuario WHERE u.id IS NULL
UNION ALL SELECT 'sueno', count(*) FROM registro_sueno r LEFT JOIN usuario u ON u.id = r.id_usuario WHERE u.id IS NULL
UNION ALL SELECT 'aptitud', count(*) FROM aptitud_presalida a LEFT JOIN usuario u ON u.id = a.id_usuario WHERE u.id IS NULL;
```
Todos los conteos deben ser 0. Agregar las tablas de cafeína, cronotipo, planes y notificaciones con la misma forma (revisar los nombres de columna en `prisma/schema/`).

### 14. Exportación con datos reales
Hoy responde 409 ("se necesitan al menos 5 participantes con pretest") porque no hay evaluaciones cargadas, y **ningún endpoint permite crearlas**.
1. Definir con I1 cómo se cargan los instrumentos pretest (PSQI, ESE-VP, ficha) a la tabla `evaluacion`.
2. Con 5 o más participantes cargados: A01 › `/plataforma` › "Exportar indicadores (CSV)".
3. **Correcto si:** el archivo usa `codigo_participante` y no tiene correo, `hash_clave` ni nombres. Con menos de 5, responde 409.

### 15. Semivida por usuario (RN03): falta implementar
`cafeina.service.ts` usa siempre `SEMIVIDA_H_DEFECTO` (5 h) e ignora `usuario.semivida_h` (3 h para fumadores, 8 h para metabolizador lento). Una vez implementado: poner `semivida_h = 3` a T03 y verificar que su residual baja más rápido que el de T01 con la misma ingesta.

### 16. Turnos de tarde: decisión
Para un turno de 18:00 a 21:30, la heurística diurna de RF07 propone dormir de 08:30 a 16:00. Cumple la regla, pero el equipo debe decidir si los turnos de tarde necesitan otra regla. Si se cambia, hay que subir `version_algoritmo`.

### 17. Antes de producción (22 nov)
1. Borrar J01, D01 y T01–T05 (iniciar sesión con cada una › `DELETE /me`).
2. Quitar `SEED_DEMO_CLAVE` y `SEED_ADMIN_CLAVE` de Render.
3. Cambiar la clave de A01.
4. Confirmar que el siguiente registro público recibe el código P que corresponde.
