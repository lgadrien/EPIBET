CREATE TABLE bets
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  odd_id UUID NOT NULL REFERENCES odds(id) ON DELETE RESTRICT,
  amount_wagered INTEGER NOT NULL CHECK (amount_wagered > 0), -- La mise en epicoins
  locked_multiplier DECIMAL(5,2) NOT NULL, -- CRUCIAL : La cote au moment précis du pari
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  placed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);