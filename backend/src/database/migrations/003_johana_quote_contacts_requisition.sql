-- 003: Contactos flexibles, campos de cotización Johana, vínculo cotización-requisición
-- Idempotente: ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS

-- Clients: contactos flexibles (arreglo JSONB)
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS contacts jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill contactos desde campos legacy (solo si contacts está vacío)
UPDATE clients
SET contacts = (
  COALESCE(
    (
      SELECT jsonb_agg(c) FROM (
        SELECT jsonb_build_object(
          'id', md5(random()::text || clock_timestamp()::text || 'general'),
          'type', 'GENERAL',
          'name', COALESCE(NULLIF(contact_name, ''), 'Contacto general'),
          'position', '',
          'phones', CASE WHEN NULLIF(phone, '') IS NOT NULL THEN jsonb_build_array(phone) ELSE '[]'::jsonb END,
          'emails', CASE WHEN NULLIF(email, '') IS NOT NULL THEN jsonb_build_array(email) ELSE '[]'::jsonb END,
          'isPrimary', true
        ) AS c
        WHERE NULLIF(contact_name, '') IS NOT NULL OR NULLIF(phone, '') IS NOT NULL OR NULLIF(email, '') IS NOT NULL
        UNION ALL
        SELECT jsonb_build_object(
          'id', md5(random()::text || clock_timestamp()::text || 'tecnico'),
          'type', 'TECNICO',
          'name', contacto_tecnico,
          'position', '',
          'phones', CASE WHEN NULLIF(telefono_tecnico, '') IS NOT NULL THEN jsonb_build_array(telefono_tecnico) ELSE '[]'::jsonb END,
          'emails', CASE WHEN NULLIF(email_tecnico, '') IS NOT NULL THEN jsonb_build_array(email_tecnico) ELSE '[]'::jsonb END,
          'isPrimary', true
        ) AS c
        WHERE NULLIF(contacto_tecnico, '') IS NOT NULL OR NULLIF(telefono_tecnico, '') IS NOT NULL OR NULLIF(email_tecnico, '') IS NOT NULL
        UNION ALL
        SELECT jsonb_build_object(
          'id', md5(random()::text || clock_timestamp()::text || 'compras'),
          'type', 'COMPRAS',
          'name', contacto_comercial,
          'position', '',
          'phones', CASE WHEN NULLIF(telefono_comercial, '') IS NOT NULL THEN jsonb_build_array(telefono_comercial) ELSE '[]'::jsonb END,
          'emails', CASE WHEN NULLIF(email_comercial, '') IS NOT NULL THEN jsonb_build_array(email_comercial) ELSE '[]'::jsonb END,
          'isPrimary', true
        ) AS c
        WHERE NULLIF(contacto_comercial, '') IS NOT NULL OR NULLIF(telefono_comercial, '') IS NOT NULL OR NULLIF(email_comercial, '') IS NOT NULL
      ) sub
    ),
    '[]'::jsonb
  )
)
WHERE (contacts IS NULL OR contacts = '[]'::jsonb);

-- Quotes: medio de solicitud, soporte, contactos snapshot, condiciones comerciales, requisición
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS request_channel varchar(50),
  ADD COLUMN IF NOT EXISTS support_file_public_id varchar(255),
  ADD COLUMN IF NOT EXISTS support_file_name varchar(255),
  ADD COLUMN IF NOT EXISTS support_file_mime varchar(100),
  ADD COLUMN IF NOT EXISTS contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS payment_terms text,
  ADD COLUMN IF NOT EXISTS delivery_time text,
  ADD COLUMN IF NOT EXISTS delivery_place text,
  ADD COLUMN IF NOT EXISTS warranty text,
  ADD COLUMN IF NOT EXISTS offer_validity text,
  ADD COLUMN IF NOT EXISTS requisition_id uuid;

CREATE INDEX IF NOT EXISTS idx_quotes_requisition_id ON quotes(requisition_id);

-- Requisitions: vínculo a cotización
ALTER TABLE requisitions
  ADD COLUMN IF NOT EXISTS quote_id uuid;

CREATE INDEX IF NOT EXISTS idx_requisitions_quote_id ON requisitions(quote_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_requisitions_quote_id'
  ) THEN
    ALTER TABLE requisitions
      ADD CONSTRAINT fk_requisitions_quote_id
      FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_quotes_requisition_id'
  ) THEN
    ALTER TABLE quotes
      ADD CONSTRAINT fk_quotes_requisition_id
      FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE SET NULL;
  END IF;
END $$;
