CREATE TABLE matches
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_home TEXT NOT NULL,
  team_away TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'finished', 'cancelled'))
);