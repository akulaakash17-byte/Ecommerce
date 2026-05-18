ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to INTEGER;
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to ON inquiries(assigned_to);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  actor_id INTEGER,
  action VARCHAR(80),
  entity_type VARCHAR(80),
  entity_id INTEGER,
  entity_label VARCHAR(220),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_inquiries_assigned_to'
  ) THEN
    ALTER TABLE inquiries
      ADD CONSTRAINT fk_inquiries_assigned_to
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_audit_logs_actor'
  ) THEN
    ALTER TABLE audit_logs
      ADD CONSTRAINT fk_audit_logs_actor
      FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
  END IF;
END $$;
