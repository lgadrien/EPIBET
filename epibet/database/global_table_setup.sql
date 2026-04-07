-- RÉINITIALISATION --
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS odds CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS --
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT DEFAULT 'user' NOT NULL CHECK (user_type IN ('user', 'admin')),
  nom TEXT NOT NULL,
  prénom TEXT NOT NULL,
  pseudo TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_logged_in TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active' NOT NULL CHECK (account_status IN ('active', 'inactive', 'banned')),
  epicoins INTEGER DEFAULT 0 NOT NULL CHECK (epicoins >= 0),
  streak INTEGER DEFAULT 0 NOT NULL CHECK (streak >= 0)
);

-- 2. EVENTS --
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- Ex: "Finale Worlds LoL 2026", "Vainqueur Koh-Lanta"
  description TEXT, -- Pour donner du contexte au pari fun
  category TEXT NOT NULL, -- Ex: 'sport', 'esport', 'fun', 'politique'
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'finished', 'cancelled'))
);

-- 3. ODDS --
CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL, -- Ex: "T1", "Fnatic", "Rouge", "Denis Brogniart"
  multiplier DECIMAL(5,2) NOT NULL CHECK (multiplier > 1.0), -- La cote
  UNIQUE(event_id, option_name) -- Empêche les doublons pour un même événement
);

-- 4. BETS --
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  odd_id UUID NOT NULL REFERENCES odds(id) ON DELETE RESTRICT,
  amount_wagered INTEGER NOT NULL CHECK (amount_wagered > 0), -- La mise en epicoins
  locked_multiplier DECIMAL(5,2) NOT NULL, -- Cote fixée au moment du pari
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  placed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
