#!/usr/bin/env bash
# Restaura un respaldo de scripts/backup-bd.sh en la BD de DESTINO_URL.
# Uso: DESTINO_URL=... BACKUP_CLAVE=... scripts/restaurar-bd.sh respaldos/archivo.dump.enc
# --clean borra y recrea los objetos del respaldo en el destino: nunca apuntar a produccion sin acuerdo.
set -euo pipefail

: "${DESTINO_URL:?Falta DESTINO_URL}"
: "${BACKUP_CLAVE:?Falta BACKUP_CLAVE}"
archivo="${1:?Indica el archivo .dump.enc}"

restaurar() {
  if command -v pg_restore >/dev/null && [ "$(pg_restore --version | grep -oE '[0-9]+' | head -1)" -ge 16 ]; then
    pg_restore --clean --if-exists --no-owner --no-privileges --exit-on-error -d "$DESTINO_URL"
  else
    docker run --rm -i --network host -e DESTINO_URL postgres:16 \
      sh -c 'pg_restore --clean --if-exists --no-owner --no-privileges --exit-on-error -d "$DESTINO_URL"'
  fi
}

openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -pass env:BACKUP_CLAVE -in "$archivo" | restaurar
echo "Restaurado en el destino. Verifica: SELECT count(*) FROM usuario;"
