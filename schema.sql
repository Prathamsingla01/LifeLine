-- LifeLine PostgreSQL Schema
-- Run: psql -d lifeline -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- for geo queries on emergencies

-- Enums
CREATE TYPE user_role AS ENUM ('Child', 'Elder', 'Admin');
CREATE TYPE emergency_type AS ENUM ('Medical', 'Fire', 'Accident', 'Other');
CREATE TYPE emergency_status AS ENUM ('Pending', 'Responding', 'Resolved');

-- Families
CREATE TABLE families (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_code  VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(100),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_families_group_code ON families(group_code);

-- Users
CREATE TABLE users (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email            VARCHAR(255) UNIQUE NOT NULL,
    hashed_password  VARCHAR(255) NOT NULL,
    role             user_role NOT NULL DEFAULT 'Child',
    medical_profile  JSONB,
    family_id        UUID REFERENCES families(id) ON DELETE SET NULL,
    created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_family_id ON users(family_id);
CREATE INDEX idx_users_medical_profile ON users USING GIN(medical_profile);

-- Emergencies
CREATE TABLE emergencies (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         emergency_type NOT NULL,
    latitude     FLOAT NOT NULL,
    longitude    FLOAT NOT NULL,
    location     GEOGRAPHY(POINT, 4326),  -- PostGIS column for fast geo queries
    description  TEXT,
    status       emergency_status NOT NULL DEFAULT 'Pending',
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_emergencies_reporter ON emergencies(reporter_id);
CREATE INDEX idx_emergencies_status ON emergencies(status);
CREATE INDEX idx_emergencies_location ON emergencies USING GIST(location);

-- Auto-populate PostGIS location from lat/lng
CREATE OR REPLACE FUNCTION sync_emergency_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_emergency_location
    BEFORE INSERT OR UPDATE ON emergencies
    FOR EACH ROW EXECUTE FUNCTION sync_emergency_location();

-- Fundraisers
CREATE TABLE fundraisers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(200) NOT NULL,
    description         TEXT,
    goal_amount         NUMERIC(12, 2) NOT NULL CHECK (goal_amount > 0),
    raised_amount       NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
    verified            BOOLEAN NOT NULL DEFAULT FALSE,
    proof_document_url  VARCHAR(500),
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fundraisers_creator ON fundraisers(creator_id);
CREATE INDEX idx_fundraisers_verified ON fundraisers(verified);

-- Example geo query: emergencies within 5km of a point
-- SELECT * FROM emergencies
-- WHERE ST_DWithin(location, ST_MakePoint(76.71, 30.70)::geography, 5000);
