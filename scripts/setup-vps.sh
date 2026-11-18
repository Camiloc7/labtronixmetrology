#!/bin/bash
# ============================================
# Labtronix Metrology - Setup VPS
# Ejecutar como root o con sudo en Ubuntu 24.04
# ============================================
set -euo pipefail

APP_USER="${APP_USER:-camilo}"
APP_DIR="/home/$APP_USER/labtronixmetrology"
PG_PASSWORD="$(openssl rand -hex 32)"
ADMIN_PASSWORD="$(openssl rand -hex 16)"
COMERCIAL_PASSWORD="$(openssl rand -hex 16)"
TECNICO_PASSWORD="$(openssl rand -hex 16)"

echo "============================================"
echo " Labtronix Metrology - Setup VPS"
echo "============================================"
echo ""
echo " Usuario del sistema: $APP_USER"
echo " Directorio app:      $APP_DIR"
echo ""

# ============================================
# 0. Actualizar sistema
# ============================================
echo "[0/12] Actualizando sistema..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl git ufw fail2ban unattended-upgrades logrotate

# ============================================
# 1. Node.js 20 LTS
# ============================================
echo "[1/12] Instalando Node.js 20 LTS..."
if ! command -v node &> /dev/null || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
  echo "    Node.js $(node -v) instalado"
else
  echo "    Node.js ya instalado: $(node -v)"
fi

# Instalar PM2 globalmente
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
  echo "    PM2 instalado"
else
  echo "    PM2 ya instalado"
fi

# ============================================
# 2. Docker y Docker Compose
# ============================================
echo "[2/12] Verificando Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker "$APP_USER"
  echo "    Docker instalado"
else
  echo "    Docker ya instalado: $(docker --version)"
fi

# Docker Compose plugin (viene con Docker moderno)
if ! docker compose version &> /dev/null; then
  apt-get install -y -qq docker-compose-plugin
fi
echo "    Docker Compose: $(docker compose version --short)"

# ============================================
# 3. Nginx
# ============================================
echo "[3/12] Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
  apt-get install -y -qq nginx
  systemctl enable nginx
  echo "    Nginx instalado"
else
  echo "    Nginx ya instalado"
fi

# ============================================
# 4. Certbot (para SSL cuando tengas dominio)
# ============================================
echo "[4/12] Instalando Certbot..."
if ! command -v certbot &> /dev/null; then
  apt-get install -y -qq certbot python3-certbot-nginx
  echo "    Certbot instalado"
else
  echo "    Certbot ya instalado"
fi

# ============================================
# 5. Firewall UFW
# ============================================
echo "[5/12] Configurando firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
echo "    UFW habilitado (SSH, HTTP, HTTPS)"

# ============================================
# 6. Docker Compose - PostgreSQL + Redis
# ============================================
echo "[6/12] Configurando PostgreSQL y Redis via Docker..."

# Crear directorio para docker-compose de infra
mkdir -p "$APP_DIR/infra"

cat > "$APP_DIR/infra/docker-compose.yml" << 'INFRACOMPOSE'
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    container_name: labtronix_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: labtronix_db
      POSTGRES_USER: labtronix_user
      POSTGRES_PASSWORD: PG_PASSWORD_PLACEHOLDER
    ports:
      - '127.0.0.1:5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U labtronix_user -d labtronix_db']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: labtronix_redis
    restart: unless-stopped
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes
    ports:
      - '127.0.0.1:6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
INFRACOMPOSE

# Reemplazar password en el compose
sed -i "s/PG_PASSWORD_PLACEHOLDER/$PG_PASSWORD/" "$APP_DIR/infra/docker-compose.yml"

cd "$APP_DIR/infra"
docker compose up -d

# Esperar a que PostgreSQL este listo
echo "    Esperando PostgreSQL..."
for i in $(seq 1 30); do
  if docker compose exec postgres pg_isready -U labtronix_user -d labtronix_db > /dev/null 2>&1; then
    echo "    PostgreSQL listo"
    break
  fi
  sleep 1
done

echo "    Redis y PostgreSQL corriendo en Docker"

# ============================================
# 7. Clonar/actualizar repositorio
# ============================================
echo "[7/12] Configurando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin main
  git reset --hard origin/main
  echo "    Repositorio actualizado"
else
  echo "    Repositorio no encontrado en $APP_DIR"
  echo "    Clona manualmente: git clone <tu-repo> $APP_DIR"
  echo "    Luego vuelve a ejecutar este script"
fi

# ============================================
# 8. Configurar .env del backend
# ============================================
echo "[8/12] Configurando variables de entorno..."

JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)

cat > "$APP_DIR/backend/.env" << ENVEOF
# Base de datos (Docker)
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=labtronix_db
DATABASE_USER=labtronix_user
DATABASE_PASSWORD=$PG_PASSWORD

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=8h
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=production

# Frontend URL (CORS) - Cambiar cuando tengas dominio
FRONTEND_URL=http://169.58.235.196

# Swagger
ENABLE_SWAGGER=false

# Trust proxy
TRUST_PROXY=true

# Upload limits
UPLOAD_MAX_EXCEL_MB=100
UPLOAD_MAX_IMAGE_MB=50

# Seed passwords
SEED_ADMIN_PASSWORD=$ADMIN_PASSWORD
SEED_COMERCIAL_PASSWORD=$COMERCIAL_PASSWORD
SEED_TECNICO_PASSWORD=$TECNICO_PASSWORD

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ENVEOF

# Frontend .env
cat > "$APP_DIR/frontend/.env.local" << FRONTENVEOF
NEXT_PUBLIC_API_URL=http://169.58.235.196/api/v1
FRONTENVEOF

echo "    .env del backend configurado"
echo "    .env.local del frontend configurado"

# ============================================
# 9. Build y deploy con PM2
# ============================================
echo "[9/12] Construyendo y desplegando..."

cd "$APP_DIR/backend"
npm ci --omit=dev
npm run build
echo "    Backend construido"

cd "$APP_DIR/frontend"
npm ci --omit=dev
npm run build
echo "    Frontend construido"

# Crear directorio de logs
mkdir -p "$APP_DIR/logs"

# Iniciar con PM2
cd "$APP_DIR"
pm2 delete labtronix-backend labtronix-frontend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" 2>/dev/null || true
echo "    PM2 iniciado"

# ============================================
# 10. Nginx config
# ============================================
echo "[10/12] Configurando Nginx..."

NGINX_CONF="/etc/nginx/sites-available/labtronix"
NGINX_MANAGED_BY_SETUP=0
if [ -f "$NGINX_CONF" ] || [ -f /etc/nginx/sites-enabled/labtronix ]; then
  echo "    Configuracion Nginx existente detectada en $NGINX_CONF; no se sobrescribe."
  echo "    Use nginx/labtronix.conf del repositorio (y Certbot/SSL) como fuente de verdad en servidores ya configurados."
else
  NGINX_MANAGED_BY_SETUP=1
  cat > "$NGINX_CONF" << 'NGINXCONF'
server {
    listen 80;
    server_name _;

    # Seguridad basica
    server_tokens off;

    # Tamanos maximos para uploads
    client_max_body_size 250M;

    # Socket.IO / WebSocket
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
    }

    # API Backend (NestJS en puerto 3001)
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
    }

    # Frontend Next.js (puerto 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos estaticos de Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;
}
NGINXCONF
fi

# Habilitar el sitio solo cuando el script acaba de crear la configuracion
if [ "$NGINX_MANAGED_BY_SETUP" -eq 1 ]; then
  ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/labtronix
  rm -f /etc/nginx/sites-enabled/default
fi

# Verificar configuracion
nginx -t
systemctl reload nginx
if [ "$NGINX_MANAGED_BY_SETUP" -eq 1 ]; then
  echo "    Nginx configurado y recargado"
else
  echo "    Nginx verificado y recargado (configuracion existente conservada)"
fi

# ============================================
# 11. Seed de usuarios iniciales
# ============================================
echo "[11/12] Ejecutando seed de usuarios..."
cd "$APP_DIR/backend"
npm run seed 2>/dev/null || echo "    Seed ya ejecutado o hubo un error (verificar manualmente)"

# ============================================
# 12. Backup automatico de PostgreSQL
# ============================================
echo "[12/12] Configurando backup automatico..."

BACKUP_DIR="/home/$APP_USER/backups/postgres"
mkdir -p "$BACKUP_DIR"

# El backup vive versionado en scripts/backup-postgres.sh: se instala una copia
# en /usr/local/bin para que cron no dependa del repo.
if [ -f "$APP_DIR/scripts/backup-postgres.sh" ]; then
  install -m 755 -o root -g root "$APP_DIR/scripts/backup-postgres.sh" /usr/local/bin/labtronix-backup.sh
  echo "    Script de backup instalado desde el repositorio"
else
  echo "    ERROR: falta $APP_DIR/scripts/backup-postgres.sh; el backup no se configuro" >&2
fi

# Cron diario a las 3 AM. El log va al home del usuario: /var/log no es
# escribible por usuarios sin privilegios y el redirect fallaria antes de
# ejecutar el script.
(crontab -l 2>/dev/null | grep -v labtronix-backup; echo "0 3 * * * mkdir -p /home/$APP_USER/backups && /usr/local/bin/labtronix-backup.sh >> /home/$APP_USER/backups/labtronix-backup.log 2>&1") | crontab -

echo "    Backup automatico configurado (diario a las 3 AM, retencion 14 dias)"

# ============================================
# Configurar fail2ban
# ============================================
echo ""
echo "Configurando fail2ban..."
cat > /etc/fail2ban/jail.local << 'F2BEOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
F2BEOF

systemctl enable fail2ban
systemctl restart fail2ban
echo "    fail2ban configurado"

# ============================================
# Logrotate para la app
# ============================================
cat > /etc/logrotate.d/labtronix << LOGROTATEEOF
$APP_DIR/backend/logs/*.log
$APP_DIR/frontend/logs/*.log {
    su $APP_USER $APP_USER
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
LOGROTATEEOF

# ============================================
# RESUMEN
# ============================================
echo ""
echo "============================================"
echo " SETUP COMPLETADO"
echo "============================================"
echo ""
echo " CREDENCIALES (GUARDAR EN LUGAR SEGURO):"
echo "   PostgreSQL password: $PG_PASSWORD"
echo "   Admin password:      $ADMIN_PASSWORD"
echo "   Comercial password:  $COMERCIAL_PASSWORD"
echo "   Tecnico password:    $TECNICO_PASSWORD"
echo ""
echo " USUARIOS CREADOS:"
echo "   admin@labtronix.com     / admin password"
echo "   comercial@labtronix.com / comercial password"
echo "   tecnico@labtronix.com   / tecnico password"
echo ""
echo " SERVICIOS:"
echo "   Backend:  http://localhost:3001 (PM2)"
echo "   Frontend: http://localhost:3000 (PM2)"
echo "   Nginx:    http://169.58.235.196 (puerto 80)"
echo "   PostgreSQL: 127.0.0.1:5432 (Docker, no expuesto)"
echo "   Redis: 127.0.0.1:6379 (Docker, no expuesto)"
echo ""
echo " COMANDOS UTILES:"
echo "   pm2 list                  - Ver procesos"
echo "   pm2 logs labtronix-backend - Ver logs del backend"
echo "   docker compose -f $APP_DIR/infra/docker-compose.yml ps"
echo ""
echo " SIGUIENTE PASO:"
echo "   1. Apunta tu dominio a 169.58.235.196"
echo "   2. Ejecuta: certbot --nginx -d tudominio.com -d www.tudominio.com"
echo "   3. Actualiza FRONTEND_URL en backend/.env"
echo "   4. Actualiza NEXT_PUBLIC_API_URL en frontend/.env.local"
echo "   5. Reinicia: pm2 restart labtronix-backend labtronix-frontend"
echo ""
echo " GUARDA ESTAS CREDENCIALES EN UN LUGAR SEGURO!"
echo "============================================"
