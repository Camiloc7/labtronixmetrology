#!/bin/bash
set -e

# Aplica las migraciones SQL versionadas e idempotentes.
# Cada archivo de backend/src/database/migrations/*.sql se ejecuta en orden
# alfabético contra PostgreSQL (contenedor docker compose `postgres`).
# Seguro de repetir: todas las migraciones deben ser idempotentes
# (ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS, etc.).

cd "$(dirname "$0")/.."
MIGRATIONS_DIR="./backend/src/database/migrations"

DB_USER="${DATABASE_USER:-labtronix_user}"
DB_NAME="${DATABASE_NAME:-labtronix_db}"

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose no esta disponible"
  exit 1
fi

applied=0
for f in "$MIGRATIONS_DIR"/*.sql; do
  if [ ! -e "$f" ]; then
    echo "No hay migraciones pendientes en $MIGRATIONS_DIR"
    exit 0
  fi
  echo "Aplicando migracion: $(basename "$f")"
  docker compose exec -T postgres psql -v ON_ERROR_STOP=1 \
    -U "$DB_USER" -d "$DB_NAME" -q < "$f"
  applied=$((applied + 1))
done

echo "Migraciones aplicadas correctamente (${applied} archivo(s))."