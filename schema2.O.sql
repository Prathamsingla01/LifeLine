-- ──────────────────────────────────────────────────────────────
--  LifeLine  ·  Supabase PostgreSQL Schema
--  Run in Supabase SQL editor (or via supabase/migrations/)
-- ──────────────────────────────────────────────────────────────

-- Enable PostGIS for geography distance functions
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── PROFILES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  role          TEXT NOT NULL DEFAULT 'paramedic'
                  CHECK (role IN ('admin','hospital_staff','paramedic','patient')),
  hospital_id   UUID,
  phone         TEXT,
  fcm_token     TEXT,          -- Firebase Cloud Messaging device token
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── HOSPITALS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  address         TEXT NOT NULL,
  phone           TEXT,
  latitude        DOUBLE PRECISION NOT NULL,
  longitude       DOUBLE PRECISION NOT NULL,
  available_beds  INTEGER DEFAULT 0,
  icu_beds        INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD CONSTRAINT fk_hospital
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL;

-- ── AMBULANCES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ambulances (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number   TEXT UNIQUE NOT NULL,
  paramedic_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  hospital_id   UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  status        TEXT DEFAULT 'available'
                  CHECK (status IN ('available','dispatched','en_route','at_scene','transporting','offline')),
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  speed         DOUBLE PRECISION,
  heading       DOUBLE PRECISION,
  last_seen     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── INCIDENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ambulance_id  UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  hospital_id   UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  patient_name  TEXT,
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  description   TEXT,
  severity      TEXT DEFAULT 'high'
                  CHECK (severity IN ('low','medium','high','critical')),
  status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','dispatched','en_route','arrived','resolved','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── NEAREST HOSPITALS RPC ─────────────────────────────────────
-- Used by GET /api/hospitals/nearest
CREATE OR REPLACE FUNCTION nearest_hospitals(p_lat FLOAT, p_lng FLOAT, p_limit INT DEFAULT 5)
RETURNS TABLE (
  id UUID, name TEXT, address TEXT, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION,
  available_beds INT, icu_beds INT, distance_km FLOAT
) AS $$
  SELECT
    id, name, address, latitude, longitude, available_beds, icu_beds,
    (6371 * acos(
      cos(radians(p_lat)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(latitude))
    )) AS distance_km
  FROM hospitals
  WHERE is_active = TRUE
  ORDER BY distance_km
  LIMIT p_limit;
$$ LANGUAGE SQL STABLE;

-- ── ROW-LEVEL SECURITY ────────────────────────────────────────
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own row; admins read all
CREATE POLICY "own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Incidents: hospital staff see only their hospital's incidents
CREATE POLICY "hospital_incidents" ON incidents
  FOR SELECT USING (
    hospital_id = (SELECT hospital_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','paramedic')
  );

-- ── REALTIME ──────────────────────────────────────────────────
-- Enable Supabase Realtime on key tables
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE ambulances;
ALTER PUBLICATION supabase_realtime ADD TABLE hospitals;
