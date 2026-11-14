#!/usr/bin/env bash
# ============================================
# Labtronix Metrology - Backup de PostgreSQL
# ============================================
# Genera un dump comprimido de la base de datos que corre en el contenedor
# Docker `labtronix_postgres`, valida el archivo y elimina los backups que
# superan la retencion configurada.
#
# Uso:
#   ./scripts/backup-postgres.sh
#
# Variables opcionales:
#   BACKUP_DIR       Directorio destino (por defecto ~/backups/postgres)
#   KEEP_DAYS        Dias de retencion (por defecto 14)
#   PG_CONTAINER     Nombre del contenedor (por defecto labtronix_postgres)
#   DATABASE_USER    Usuario de PostgreSQL (por defecto labtronix_user)
#   DATABASE_NAME    Base de datos (por defecto labtronix_db)
#
# Pensado para cron: no depende de variables de un shell interactivo.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/postgres}"
KEEP_DAYS="${KEEP_DAYS:-14}"
PG_CONTAINER="${PG_CONTAINER:-labtronix_postgres}"
DATABASE_USER="${DATABASE_USER:-labtronix_user}"
DATABASE_NAME="${DATABASE_NAME:-labtronix_db}"

# cron no hereda el PATH del login: resolvemos docker explicitamente.
DOCKER_BIN="$(command -v docker || true)"
if [ -z "$DOCKER_BIN" ]; then
  for candidate in /usr/bin/docker /usr/local/bin/docker /snap/bin/docker; do
    if [ -x "$candidate" ]; then DOCKER_BIN="$candidate"; break; fi
  done
fi
if [ -z "$DOCKER_BIN" ]; then
  echo "ERROR: docker no encontrado" >&2
  exit 1
fi

if ! "$DOCKER_BIN" inspect "$PG_CONTAINER" >/dev/null 2>&1; then
  echo "ERROR: el contenedor $PG_CONTAINER no existe o no esta corriendo" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
DATE="$(date +%Y%m%d_%H%M%S)"
TARGET="$BACKUP_DIR/labtronix_${DATE}.sql.gz"
PARTIAL="${TARGET}.part"

cleanup() { rm -f "$PARTIAL"; }
trap cleanup EXIT

"$DOCKER_BIN" exec "$PG_CONTAINER" \
  pg_dump --no-owner --no-privileges -U "$DATABASE_USER" -d "$DATABASE_NAME" \
  | gzip -9 > "$PARTIAL"

# Verificaciones: gzip valido y contenido minimo (evita guardar dumps vacios).
gzip -t "$PARTIAL"
SIZE_BYTES="$(stat -c%s "$PARTIAL")"
if [ "$SIZE_BYTES" -lt 1024 ]; then
  echo "ERROR: dump sospechosamente pequeno (${SIZE_BYTES} bytes)" >&2
  exit 1
fi

mv "$PARTIAL" "$TARGET"
trap - EXIT

# Retencion.
find "$BACKUP_DIR" -maxdepth 1 -name 'labtronix_*.sql.gz' -mtime +"$KEEP_DAYS" -delete

echo "$(date '+%Y-%m-%d %H:%M:%S'): backup OK - $TARGET ($(du -h "$TARGET" | cut -f1)), retencion ${KEEP_DAYS}d"
