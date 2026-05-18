CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(120);
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(160);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(160);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'agent';
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY
);

ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug VARCHAR(220);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title VARCHAR(180);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price NUMERIC(14, 2) DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS district VARCHAR(100) DEFAULT 'Siddipet';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS mandal VARCHAR(120);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS village VARCHAR(120);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(60);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_area VARCHAR(100);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_name VARCHAR(140);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'available';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_by INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug_unique ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(mandal, village);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY
);

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS property_id INTEGER;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS name VARCHAR(120);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status_note TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to INTEGER;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to ON inquiries(assigned_to);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

CREATE TABLE IF NOT EXISTS agent_followups (
  id SERIAL PRIMARY KEY
);

ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS agent_id INTEGER;
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS property_id INTEGER;
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS inquiry_id INTEGER;
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS customer_name VARCHAR(120);
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS email VARCHAR(160);
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS next_action VARCHAR(180);
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending';
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE agent_followups ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_agent_followups_agent ON agent_followups(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_followups_status ON agent_followups(status);
CREATE INDEX IF NOT EXISTS idx_agent_followups_created_at ON agent_followups(created_at);

CREATE TABLE IF NOT EXISTS notification_logs (
  id SERIAL PRIMARY KEY
);

ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS inquiry_id INTEGER;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS channel VARCHAR(40);
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS recipient VARCHAR(180);
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'skipped';
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS provider_response TEXT;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_notification_logs_inquiry ON notification_logs(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY
);

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id INTEGER;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(80);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_type VARCHAR(80);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_id INTEGER;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_label VARCHAR(220);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
