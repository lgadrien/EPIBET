CREATE TABLE odds
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  bet_type TEXT NOT NULL, -- Exemple : 'home', 'draw', 'away'
  multiplier DECIMAL(5,2) NOT NULL CHECK (multiplier > 1.0), -- La cote (ex: 1.50, 2.10)
  UNIQUE(match_id, bet_type) -- Empêche d'avoir deux cotes "home" pour le même match
);