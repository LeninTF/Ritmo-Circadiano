# Smoke test del piloto (v0.9.0-piloto)

Recorrido manual antes de abrir el piloto (lun 26 oct). Se hace en **staging** con un telefono Android y un iPhone con la PWA **instalada**. Marcar cada casilla y anotar el fallo con captura si algo no pasa.

- PWA: https://ritmo-circadiano-pwa.lenin7777-lt.workers.dev
- API: https://ritmo-circadiano.onrender.com (plan gratuito: la primera peticion tras 15 min de inactividad tarda ~1 min)

> Cada registro consume un codigo `P##` de participante real. Usar una sola cuenta de prueba y decidir con el equipo si se borra antes del piloto (cuando exista `DELETE /me`, con ese endpoint).

## 0. Previo

- [ ] `GET /health` responde 200 y `GET /areas` devuelve 6 areas.
- [ ] Existe una cuenta con rol `jefe_operaciones` para asignar turnos (paso 2).
- [ ] La PWA abre sin errores en la consola del navegador de escritorio.

## 1. Instalacion

| Paso | Android (Chrome) | iOS (Safari 16.4+) |
|---|---|---|
| Abrir la URL de la PWA | [ ] | [ ] |
| Instalar: Android "Instalar app"; iOS Compartir > "Agregar a inicio" | [ ] | [ ] |
| Abrir desde el icono: se ve sin barra del navegador | [ ] | [ ] |

## 2. Recorrido (RF01 → RF11)

| # | Paso | Esperado | Android | iOS |
|---|---|---|---|---|
| 1 | `/consentimiento` → aceptar → `/registro` | Sin aceptar no deja avanzar (RN11) | [ ] | [ ] |
| 2 | Registrarse | Muestra el codigo `P##`; nunca muestra el correo en otras pantallas | [ ] | [ ] |
| 3 | Cerrar sesion y `/ingresar` | Entra; clave incorrecta muestra error sin decir cual campo fallo | [ ] | [ ] |
| 4 | Jefe asigna un turno al participante (`/turnos`) | El trabajador lo ve en `/turnos` | [ ] | [ ] |
| 5 | `/plan` | Ventana de descanso, luz natural y picos en `HH:mm` 24 h | [ ] | [ ] |
| 6 | `/cafeina`: registrar una bebida | Muestra mg y la hora de corte; nunca despues de `dormir - 6 h` (RN05) | [ ] | [ ] |
| 7 | `/diario`: registrar el sueno | Se guarda; al repetir el mismo dia se actualiza, no se duplica | [ ] | [ ] |
| 8 | `/aptitud` | Semaforo con icono y texto, y el aviso "Herramienta preventiva de apoyo..." | [ ] | [ ] |

## 3. Offline (RNF03)

- [ ] Con la app abierta, activar modo avion y registrar una bebida y el diario: no muestra error.
- [ ] Desactivar modo avion: los registros llegan a la API (aparecen al ingresar con la misma cuenta en otro dispositivo).
- [ ] Abrir la app sin red: carga el plan del dia desde cache.

## 4. Notificaciones (RF10)

- [ ] Android: aceptar permiso; llega un recordatorio de prueba.
- [ ] iOS: solo con la PWA instalada; se muestra la guia antes de pedir permiso.

## 5. Seguridad minima

- [ ] Un trabajador que entra a `/indicadores` es redirigido (sin rol de jefe).
- [ ] `GET <API>/me` sin token → 401.

## Resultado y release

| Fecha | Quien | Android | iOS | Bloqueantes |
|---|---|---|---|---|
| | | | | |

Si no hay bloqueantes, una persona del equipo crea la etiqueta sobre el commit verificado de `develop`:

```bash
git tag -a v0.9.0-piloto <sha> -m "Piloto 26 oct 2026"
git push origin v0.9.0-piloto
```
