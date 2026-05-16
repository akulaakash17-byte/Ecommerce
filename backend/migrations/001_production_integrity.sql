CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(220) NOT NULL UNIQUE,
  run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status_note TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE inquiries ALTER COLUMN status SET DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

CREATE TABLE IF NOT EXISTS notification_logs (
  id SERIAL PRIMARY KEY,
  inquiry_id INTEGER,
  channel VARCHAR(40),
  recipient VARCHAR(180),
  status VARCHAR(20) NOT NULL DEFAULT 'skipped',
  provider_response TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_inquiry ON notification_logs(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_users_role'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'agent')) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_properties_status'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT chk_properties_status CHECK (status IN ('available', 'sold')) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_inquiries_status'
  ) THEN
    ALTER TABLE inquiries ADD CONSTRAINT chk_inquiries_status CHECK (status IN ('new', 'contacted', 'closed')) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_agent_followups_status'
  ) THEN
    ALTER TABLE agent_followups ADD CONSTRAINT chk_agent_followups_status CHECK (status IN ('pending', 'accepted', 'rejected')) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_notification_logs_status'
  ) THEN
    ALTER TABLE notification_logs ADD CONSTRAINT chk_notification_logs_status CHECK (status IN ('sent', 'failed', 'skipped')) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_properties_created_by'
  ) THEN
    ALTER TABLE properties
      ADD CONSTRAINT fk_properties_created_by
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_inquiries_property'
  ) THEN
    ALTER TABLE inquiries
      ADD CONSTRAINT fk_inquiries_property
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_agent_followups_agent'
  ) THEN
    ALTER TABLE agent_followups
      ADD CONSTRAINT fk_agent_followups_agent
      FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_agent_followups_property'
  ) THEN
    ALTER TABLE agent_followups
      ADD CONSTRAINT fk_agent_followups_property
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_agent_followups_inquiry'
  ) THEN
    ALTER TABLE agent_followups
      ADD CONSTRAINT fk_agent_followups_inquiry
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_notification_logs_inquiry'
  ) THEN
    ALTER TABLE notification_logs
      ADD CONSTRAINT fk_notification_logs_inquiry
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE SET NULL NOT VALID;
  END IF;
END $$;
