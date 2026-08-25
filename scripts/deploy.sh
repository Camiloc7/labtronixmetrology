#!/bin/bash
set -e

# Asegurarse de estar en el directorio de la aplicación (asumimos ~/labtronixmetrology)
cd "$(dirname "$0")/.."
APP_DIR=$(pwd)

echo "🚀 Iniciando Despliegue con PM2 en $APP_DIR..."

# 1. Obtener últimos cambios
echo "📥 Descargando últimos cambios de main..."
git reset --hard HEAD
git clean -fd
git pull origin main

# 2. Setup y Build del Backend
echo "⚙️ Construyendo Backend..."
cd $APP_DIR/backend
npm install
npm run build

# 3. Setup y Build del Frontend
echo "🎨 Construyendo Frontend..."
cd $APP_DIR/frontend
npm install
npm run build

# 4. Recargar el clúster con Zero-Downtime usando PM2
echo "🚀 Recargando PM2 sin tiempo de inactividad..."
cd $APP_DIR
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

echo "✅ ¡Despliegue completado con éxito!"

