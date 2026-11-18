#!/bin/bash
set -euo pipefail

# Ensure PATH and environment variables are loaded for non-interactive SSH sessions (e.g., Docker, NVM, PM2)
source ~/.profile 2>/dev/null || true
source ~/.bashrc 2>/dev/null || true
source ~/.bash_profile 2>/dev/null || true
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/snap/bin:~/.npm-global/bin

# Directorio de la aplicacion
cd "$(dirname "$0")/.."
APP_DIR=$(pwd)

BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://127.0.0.1:3001/api/v1/health}"
FRONTEND_HEALTH_URL="${FRONTEND_HEALTH_URL:-http://127.0.0.1:3000/}"
HEALTH_RETRIES="${HEALTH_RETRIES:-12}"
HEALTH_DELAY="${HEALTH_DELAY:-5}"

echo "============================================"
echo " Labtronix Metrology - Deploy con PM2"
echo "============================================"
echo " Directorio: $APP_DIR"
echo " Fecha: $(date)"
echo ""

PREV_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo "")"

rollback() {
  local code=$?
  trap - ERR
  echo ""
  echo "ERROR: deploy fallo (codigo $code)."
  if [ -n "$PREV_COMMIT" ] && [ "$PREV_COMMIT" != "$(git rev-parse HEAD 2>/dev/null || echo '')" ]; then
    echo "Intentando rollback de aplicacion a $PREV_COMMIT..."
    echo "NOTA: las migraciones de base de datos ya aplicadas no se revierten automaticamente."
    git reset --hard "$PREV_COMMIT" || true
    if (cd "$APP_DIR/backend" && npm install --include=dev && npm run build) && \
       (cd "$APP_DIR/frontend" && npm install --include=dev && npm run build) && \
       (cd "$APP_DIR" && pm2 reload ecosystem.config.js --update-env); then
      pm2 save || true
      echo "Rollback de aplicacion completado (verifique estado y datos)."
    else
      echo "Rollback automatico incompleto. Revise manualmente con: git log -1, pm2 list, pm2 logs"
    fi
  else
    echo "No hay commit previo distinto para rollback automatico. Revise manualmente."
  fi
  exit "$code"
}
trap rollback ERR

wait_for_http() {
  local url="$1"
  local name="$2"
  local i
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    if curl -fsS --max-time 10 "$url" >/dev/null 2>&1; then
      echo "    $name OK ($url)"
      return 0
    fi
    if [ "$i" -lt "$HEALTH_RETRIES" ]; then
      echo "    Esperando $name ($i/$HEALTH_RETRIES)..."
      sleep "$HEALTH_DELAY"
    fi
  done
  echo "    ERROR: $name no respondio en $url tras $HEALTH_RETRIES intentos" >&2
  return 1
}

# 1. Obtener ultimos cambios
echo "[1/6] Descargando cambios de main..."
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main
git clean -fd

# 2. Levantar Docker (PostgreSQL + Redis)
echo "[2/6] Verificando Docker Compose (PostgreSQL + Redis)..."
docker compose up -d

# Esperar a que PostgreSQL este listo
echo "    Esperando a que PostgreSQL este listo..."
for i in $(seq 1 30); do
  if docker compose exec postgres pg_isready -U labtronix_user -d labtronix_db > /dev/null 2>&1; then
    echo "    PostgreSQL listo"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "    ERROR: PostgreSQL no respondio en 30 segundos"
    exit 1
  fi
  sleep 1
done

# 3. Migraciones de base de datos
echo "[3/6] Aplicando migraciones de base de datos..."
bash scripts/db-migrate.sh

# 4. Build del Backend
echo "[4/6] Construyendo Backend..."
cd "$APP_DIR/backend"
npm install --include=dev
npm run build

# 5. Build del Frontend
echo "[5/6] Construyendo Frontend..."
cd "$APP_DIR/frontend"
rm -rf .next
npm install --include=dev
npm run build

# 6. Recargar PM2 y verificar salud
echo "[6/6] Recargando PM2 y verificando servicios..."
cd "$APP_DIR"

# Si PM2 ya tiene los procesos, recargar. Si no, iniciar.
if pm2 list | grep -q "labtronix-backend"; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
  pm2 save
  # Configurar PM2 para iniciar en reboot
  pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true
fi

pm2 save
sleep 3

wait_for_http "$BACKEND_HEALTH_URL" "Backend"
wait_for_http "$FRONTEND_HEALTH_URL" "Frontend"

trap - ERR

echo ""
echo "============================================"
echo " Deploy completado con exito!"
echo "============================================"
echo " Commit: $(git rev-parse --short HEAD)"
echo " Backend:  $BACKEND_HEALTH_URL"
echo " Frontend: $FRONTEND_HEALTH_URL"
echo " PostgreSQL: 127.0.0.1:5432 (Docker)"
echo " Redis: 127.0.0.1:6379 (Docker, sin uso activo en la app)"
echo " PM2 status: pm2 list"
echo ""
