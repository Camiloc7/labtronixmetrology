#!/bin/bash
set -euo pipefail

# Aplica las migraciones SQL versionadas e idempotentes.
# Cada archivo de backend/src/database/migrations/*.sql se ejecuta en orden
# alfabético contra PostgreSQL (contenedor docker compose `postgres`).
# Lleva registro en la tabla `schema_migrations` para no re-ejecutar archivos
# ya aplicados. Las migraciones deben seguir siendo idempotentes por seguridad.

cd "$(dirname "$0")/.."
MIGRATIONS_DIR="./backend/src/database/migrations"

DB_USER="${DATABASE_USER:-labtronix_user}"
DB_NAME="${DATABASE_NAME:-labtronix_db}"

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose no esta disponible"
  exit 1
fi

# Crear tabla de seguimiento de migraciones si no existe
docker compose exec -T postgres psql -v ON_ERROR_STOP=1 \
  -U "$DB_USER" -d "$DB_NAME" -q <<'SQL'
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename TEXT PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT NOW()
);
SQL

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "No hay directorio de migraciones en $MIGRATIONS_DIR; omitiendo."
  exit 0
fi

applied=0
skipped=0
for f in "$MIGRATIONS_DIR"/*.sql; do
  [ -e "$f" ] || continue
  name="$(basename "$f")"
  exists=$(docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" -tAc \
    "SELECT 1 FROM schema_migrations WHERE filename = '$name' LIMIT 1;" 2>/dev/null || echo "")

  if [ "$exists" = "1" ]; then
    skipped=$((skipped + 1))
    continue
  fi

  echo "Aplicando migracion: $name"
  docker compose exec -T postgres psql -v ON_ERROR_STOP=1 \
    -U "$DB_USER" -d "$DB_NAME" -q < "$f"
  docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" -q \
    -c "INSERT INTO schema_migrations (filename) VALUES ('$name') ON CONFLICT (filename) DO NOTHING;"
  applied=$((applied + 1))
done

echo "Migraciones: ${applied} aplicada(s), ${skipped} ya registrada(s)."
