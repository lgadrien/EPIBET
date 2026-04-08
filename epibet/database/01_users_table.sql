CREATE TABLE users
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT DEFAULT 'user' NOT NULL CHECK (user_type IN ('user', 'admin')),
  nom TEXT NOT NULL,
  prénom TEXT NOT NULL,
  pseudo TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- Optionnel
  registration_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_logged_in TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active' NOT NULL CHECK (account_status IN ('active', 'inactive', 'banned')),
  epicoins INTEGER DEFAULT 1000 NOT NULL CHECK (epicoins >= 0),
  streak INTEGER DEFAULT 0 NOT NULL CHECK (streak >= 0)
);