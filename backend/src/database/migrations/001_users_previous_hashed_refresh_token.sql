-- 001_users_previous_hashed_refresh_token.sql
-- Fecha: 2026-10-12
-- Motivo: la rotación de refresh tokens (auth.service) ahora almacena el SHA-256
-- del token actual y el anterior, para detectar reuso (replay) y revocar la familia.
-- En producción se aplica automáticamente vía scripts/db-migrate.sh (deploy.sh).
-- Idempotente: se puede ejecutar N veces sin efecto.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "previous_hashed_refresh_token" character varying;