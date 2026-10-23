# Backups y monitoreo del piloto

La BD tiene datos de salud de los participantes (Ley 29733). Todo respaldo se **cifra** y se guarda fuera del repo.

## 1. Respaldos

| Capa | Que cubre | Quien |
|---|---|---|
| Neon (gestionado) | Restauracion a un punto en el tiempo dentro de la ventana del plan (*Settings > Restore window*; en el plan gratuito es corta) | Automatico |
| `scripts/backup-bd.sh` | Copia diaria completa, cifrada con AES-256 (`openssl`, PBKDF2) | Responsable de I1, una vez al dia durante el piloto |

### Respaldo diario

```bash
export DATABASE_URL='<cadena de Neon staging, del panel de Neon>'
export BACKUP_CLAVE='<frase larga; guardarla en el gestor de contrasenas del equipo>'
bash scripts/backup-bd.sh /ruta/segura/respaldos
```

- Usa `pg_dump` 16 si esta instalado; si no, la imagen `postgres:16` de Docker.
- El volcado se cifra al vuelo: nunca queda un `.dump` en claro. `respaldos/` esta en `.gitignore`.
- Guardar los archivos en una unidad del equipo con acceso restringido. Conservar 14 dias y borrar los mas antiguos.
- **Sin `BACKUP_CLAVE` no se puede restaurar.** Si se pierde la frase, los respaldos no sirven.

### Prueba de restauracion (una vez por semana)

Restaurar en una BD vacia, **nunca en staging ni en produccion**:

```bash
docker run -d --rm --name pg-prueba -e POSTGRES_PASSWORD=prueba -p 55432:5432 postgres:16
export DESTINO_URL='postgresql://postgres:prueba@localhost:55432/postgres'
bash scripts/restaurar-bd.sh /ruta/segura/respaldos/circadiano-AAAAMMDDTHHMMSSZ.dump.enc
docker exec pg-prueba psql -U postgres -c "select count(*) from usuario;"
docker stop pg-prueba
```

Verificado el 23 oct 2026 con Postgres 16: los conteos de `usuario`, `area`, `audit_log` y `_prisma_migrations` coinciden entre el origen y el destino. Una clave equivocada falla sin tocar el destino.

### Restaurar staging tras un incidente

1. Preferir el *restore* de Neon (crea una rama al momento elegido; sin perder la actual).
2. Si la ventana ya paso: crear una rama nueva en Neon, restaurar alli el ultimo respaldo y cambiar `DATABASE_URL` en Render. No restaurar encima de la rama en uso.

## 2. Monitoreo

| Que | Como | Quien |
|---|---|---|
| API arriba | UptimeRobot, monitor HTTP cada 5 min a `https://ritmo-circadiano.onrender.com/health` con alerta por correo al equipo. Tambien evita que Render apague el servicio gratuito por inactividad. | **Paso humano:** crear la cuenta y el monitor |
| PWA arriba | Segundo monitor a la URL de la PWA | Paso humano |
| Errores | Render > *Logs*: revisar cada manana del piloto buscando `ERROR`. Los logs no tienen datos personales (RNF04, `docs/seguridad-rnf04.md`). | Responsable de I1 |
| Acciones sensibles | `SELECT accion, count(*) FROM audit_log WHERE fecha > now() - interval '1 day' GROUP BY 1;` | Responsable de I1 |

## 3. Pendientes humanos

- Crear la cuenta de UptimeRobot y los dos monitores con el correo del equipo.
- Definir quien guarda `BACKUP_CLAVE` y donde se almacenan los respaldos.
- Revisar en Neon la ventana de restauracion del plan contratado.
