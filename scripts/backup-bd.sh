#!/usr/bin/env bash
# Respaldo cifrado de la BD (contiene datos de salud: Ley 29733).
# Uso: DATABASE_URL=... BACKUP_CLAVE=... scripts/backup-bd.sh [carpeta]
# Sin pg_dump 16+ local usa la imagen postgres:16 de Docker.
set -euo pipefail

: "${DATABASE_URL:?Falta DATABASE_URL}"
: "${BACKUP_CLAVE:?Falta BACKUP_CLAVE (frase para cifrar el respaldo)}"
carpeta="${1:-respaldos}"
mkdir -p "$carpeta"
archivo="$carpeta/circadiano-$(date -u +%Y%m%dT%H%M%SZ).dump.enc"

volcar() {
  if command -v pg_dump >/dev/null && [ "$(pg_dump --version | grep -oE '[0-9]+' | head -1)" -ge 16 ]; then
    pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL"
  else
    docker run --rm --network host -e DATABASE_URL postgres:16 \
      sh -c 'pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL"'
  fi
}

# El volcado nunca toca el disco sin cifrar.
volcar | openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -pass env:BACKUP_CLAVE -out "$archivo"
[ -s "$archivo" ] || { echo "Respaldo vacio: revisa la conexion" >&2; rm -f "$archivo"; exit 1; }
echo "Respaldo listo: $archivo"
