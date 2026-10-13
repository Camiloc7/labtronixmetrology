-- 002_email_requests_processed_at.sql
-- Registra cuándo se procesó o descartó una solicitud para trazabilidad comercial.
-- Idempotente: se puede ejecutar varias veces sin efecto adicional.
ALTER TABLE "email_requests"
  ADD COLUMN IF NOT EXISTS "processed_at" timestamp with time zone;
