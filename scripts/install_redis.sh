#!/bin/bash
# ============================================
# Labtronix - Instalar y configurar Redis
# ============================================
set -euo pipefail

echo "============================================"
echo " Labtronix - Redis Setup"
echo "============================================"

# Redis ya esta en Docker Compose, este script es opcional
# Si prefieres Redis nativo (sin Docker), ejecuta esto:

if command -v docker &> /dev/null && docker ps | grep -q labtronix_redis; then
  echo "Redis ya corriendo en Docker (labtronix_redis)"
  echo "  Host: 127.0.0.1"
  echo "  Port: 6379"
  echo ""
  echo "Para redis nativo sin Docker, descomenta las lineas de abajo."
  exit 0
fi

echo "Instalando Redis nativo..."
apt-get update -qq
apt-get install -y redis-server

# Configurar Redis para produccion
REDIS_CONF="/etc/redis/redis.conf"
cp "$REDIS_CONF" "${REDIS_CONF}.bak.$(date +%Y%m%d)"

sed -i 's/^bind .*/bind 127.0.0.1 ::1/' "$REDIS_CONF"
sed -i 's/^# protected-mode yes/protected-mode yes/' "$REDIS_CONF"

if grep -q "^maxmemory " "$REDIS_CONF"; then
  sed -i 's/^maxmemory .*/maxmemory 256mb/' "$REDIS_CONF"
else
  echo "maxmemory 256mb" >> "$REDIS_CONF"
fi

if grep -q "^maxmemory-policy " "$REDIS_CONF"; then
  sed -i 's/^maxmemory-policy .*/maxmemory-policy allkeys-lru/' "$REDIS_CONF"
else
  echo "maxmemory-policy allkeys-lru" >> "$REDIS_CONF"
fi

systemctl enable redis-server
systemctl restart redis-server

if redis-cli ping | grep -q "PONG"; then
  echo "Redis instalado y funcionando"
  echo "  Host: 127.0.0.1"
  echo "  Port: 6379"
  echo "  Memoria: 256MB (LRU)"
else
  echo "ERROR: Redis no responde. Revisar: journalctl -u redis-server"
  exit 1
fi
