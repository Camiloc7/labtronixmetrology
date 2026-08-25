#!/bin/bash
set -e

# Directorio de la aplicacion
cd "$(dirname "$0")/.."
APP_DIR=$(pwd)

echo "============================================"
echo " Labtronix Metrology - Deploy con PM2"
echo "============================================"
echo " Directorio: $APP_DIR"
echo " Fecha: $(date)"
echo ""

# 1. Obtener ultimos cambios
echo "[1/5] Descargando cambios de main..."
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main
git clean -fd

# 2. Levantar Docker (PostgreSQL + Redis)
echo "[2/5] Verificando Docker Compose (PostgreSQL + Redis)..."
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

# 3. Build del Backend
echo "[3/5] Construyendo Backend..."
cd "$APP_DIR/backend"
npm ci --omit=dev
npm run build

# 4. Build del Frontend
echo "[4/5] Construyendo Frontend..."
cd "$APP_DIR/frontend"
npm ci --omit=dev
npm run build

# 5. Recargar PM2
echo "[5/5] Recargando PM2..."
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

echo ""
echo "============================================"
echo " Deploy completado con exito!"
echo "============================================"
echo " Backend:  http://localhost:3001"
echo " Frontend: http://localhost:3000"
echo " PostgreSQL: 127.0.0.1:5432 (Docker)"
echo " Redis: 127.0.0.1:6379 (Docker)"
echo " PM2 status: pm2 list"
echo ""
