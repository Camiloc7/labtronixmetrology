#!/usr/bin/env bash
# ============================================================
# KrediYA - Script de instalación y configuración de Redis
# Ejecutar como root o con sudo en Ubuntu/Debian
# ============================================================
set -euo pipefail

echo "============================================================"
echo " KrediYA - Instalación de Redis"
echo "============================================================"

# 1. Instalar Redis
echo "[1/5] Instalando Redis Server..."
apt-get update -qq
apt-get install -y redis-server

# 2. Configurar Redis para producción
echo "[2/5] Configurando Redis para producción..."
REDIS_CONF="/etc/redis/redis.conf"
cp "$REDIS_CONF" "${REDIS_CONF}.bak.$(date +%Y%m%d)"

# Bind solo a localhost (seguridad)
sed -i 's/^bind .*/bind 127.0.0.1 ::1/' "$REDIS_CONF"

# Desactivar acceso externo
sed -i 's/^# protected-mode yes/protected-mode yes/' "$REDIS_CONF"

# Limitar memoria a 256MB (suficiente para caché de dashboards)
if grep -q "^maxmemory " "$REDIS_CONF"; then
  sed -i 's/^maxmemory .*/maxmemory 256mb/' "$REDIS_CONF"
else
  echo "maxmemory 256mb" >> "$REDIS_CONF"
fi

# Política de evicción: eliminar las llaves menos usadas
if grep -q "^maxmemory-policy " "$REDIS_CONF"; then
  sed -i 's/^maxmemory-policy .*/maxmemory-policy allkeys-lru/' "$REDIS_CONF"
else
  echo "maxmemory-policy allkeys-lru" >> "$REDIS_CONF"
fi

# 3. Habilitar y arrancar el servicio
echo "[3/5] Habilitando servicio de Redis..."
systemctl enable redis-server
systemctl restart redis-server

# 4. Verificar que Redis responde
echo "[4/5] Verificando conexión..."
if redis-cli ping | grep -q "PONG"; then
  echo "  ✅ Redis respondió PONG correctamente"
else
  echo "  ❌ Redis no responde. Revisar logs: journalctl -u redis-server"
  exit 1
fi

# 5. Instalar la librería de Python para el agente IA
echo "[5/5] Instalando librería redis para Python..."
VENV_PIP="/opt/apps/antifraude/krediya_fraud_system/venv/bin/pip3"
if [ -x "$VENV_PIP" ]; then
  "$VENV_PIP" install redis
  echo "  ✅ Librería redis instalada en el virtualenv"
else
  echo "  ⚠️  No se encontró el pip del virtualenv. Instalar manualmente:"
  echo "     /path/to/venv/bin/pip3 install redis"
fi

echo ""
echo "============================================================"
echo " ✅ Redis instalado y configurado"
echo ""
echo " Host:     127.0.0.1"
echo " Puerto:   6379"
echo " Memoria:  256MB (LRU eviction)"
echo " Estado:   $(systemctl is-active redis-server)"
echo ""
echo " Agregar a backend/.env:"
echo "   REDIS_HOST=127.0.0.1"
echo "   REDIS_PORT=6379"
echo "============================================================"
