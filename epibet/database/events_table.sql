CREATE TABLE events
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- Ex: "Finale Worlds LoL 2026", "Vainqueur Koh-Lanta"
  description TEXT, -- Pour donner du contexte au pari fun
  category TEXT NOT NULL, -- Ex: 'sport', 'esport', 'fun', 'politique'
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'finished', 'cancelled'))
);