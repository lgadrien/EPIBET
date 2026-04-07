CREATE TABLE odds
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL, -- Ex: "T1", "Fnatic", "Rouge", "Denis Brogniart"
  multiplier DECIMAL(5,2) NOT NULL CHECK (multiplier > 1.0), -- La cote
  UNIQUE(event_id, option_name) -- Empêche les doublons pour un même événement
);