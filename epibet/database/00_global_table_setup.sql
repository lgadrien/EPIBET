-- ========================================================
-- 00_GLOBAL_TABLE_SETUP.SQL
-- Version Master : Système Auth, Streaks, Paris et Bonus
-- ========================================================

-- RÉINITIALISATION --
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS odds CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS public_profiles CASCADE;
DROP FUNCTION IF EXISTS place_bet;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS proc_daily_streak_update CASCADE;

-- ==========================================
-- 1. TABLES DE BASE
-- ==========================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT DEFAULT 'user' NOT NULL CHECK (user_type IN ('user', 'admin')),
  nom TEXT NOT NULL,
  prénom TEXT NOT NULL,
  pseudo TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- Optionnel car géré par Supabase Auth
  avatar_url TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_logged_in TIMESTAMPTZ,
  account_status TEXT DEFAULT 'active' NOT NULL CHECK (account_status IN ('active', 'inactive', 'banned')),
  epicoins INTEGER DEFAULT 1000 NOT NULL CHECK (epicoins >= 0),
  streak INTEGER DEFAULT 0 NOT NULL CHECK (streak >= 0)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'finished', 'cancelled'))
);

CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL,
  multiplier DECIMAL(5,2) NOT NULL CHECK (multiplier > 1.0),
  UNIQUE(event_id, option_name)
);

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  odd_id UUID NOT NULL REFERENCES odds(id) ON DELETE RESTRICT,
  amount_wagered INTEGER NOT NULL CHECK (amount_wagered > 0),
  locked_multiplier DECIMAL(5,2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  placed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 2. SÉCURITÉ & VUES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs voient leur propre profil" ON users FOR SELECT USING ( auth.uid() = id );
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil" ON users FOR UPDATE USING ( auth.uid() = id );
CREATE POLICY "Événements visibles par tous" ON events FOR SELECT USING ( true );
CREATE POLICY "Cotes visibles par tous" ON odds FOR SELECT USING ( true );
CREATE POLICY "Paris visibles par tous" ON bets FOR SELECT USING ( true );

-- Vue pour le classement (Leaderboard)
CREATE OR REPLACE VIEW public_profiles AS
SELECT id, pseudo, streak, epicoins FROM users;

-- ==========================================
-- 3. SYNCHRONISATION AUTOMATIQUE (TRIGGER)
-- ==========================================

-- Fonction pour créer l'utilisateur public après inscription Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, nom, prénom, pseudo, email, password, epicoins, streak, last_logged_in)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nom', 'Utilisateur'),
    COALESCE(new.raw_user_meta_data->>'prenom', 'Nouveau'),
    COALESCE(new.raw_user_meta_data->>'pseudo', 'user_' || substr(new.id::text, 1, 8)),
    new.email,
    'managed-by-supabase-auth',
    1000, -- Bonus de bienvenue
    1,    -- Streak commence à 1
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 4. SYSTÈME DE STREAK AUTOMATIQUE AU LOGIN
-- ==========================================

CREATE OR REPLACE FUNCTION public.proc_daily_streak_update()
RETURNS trigger AS $$
DECLARE
  v_last_login TIMESTAMPTZ;
  v_current_streak INTEGER;
  v_days_diff INTEGER;
  v_reward INTEGER := 100;
BEGIN
  SELECT last_logged_in, streak INTO v_last_login, v_current_streak
  FROM public.users WHERE id = new.id;

  IF NOT FOUND THEN RETURN new; END IF;

  v_days_diff := (NOW() AT TIME ZONE 'UTC')::DATE - (v_last_login AT TIME ZONE 'UTC')::DATE;

  IF v_days_diff = 1 THEN
    -- Suite de la série
    UPDATE public.users SET streak = streak + 1, epicoins = epicoins + v_reward WHERE id = new.id;
  ELSIF v_days_diff > 1 THEN
    -- Série brisée
    UPDATE public.users SET streak = 1, epicoins = epicoins + v_reward WHERE id = new.id;
  END IF;

  -- On met à jour la date de connexion dans TOUS les cas (même si v_days_diff = 0)
  UPDATE public.users SET last_logged_in = NOW() WHERE id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_on_auth_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.proc_daily_streak_update();

-- ==========================================
-- 5. FONCTIONS MÉTIER (PARIS)
-- ==========================================

CREATE OR REPLACE FUNCTION place_bet(p_odd_id UUID, p_amount INTEGER)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_epicoins INTEGER;
  v_event_status TEXT;
  v_multiplier DECIMAL(5,2);
  v_new_bet_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Utilisateur non connecté.'; END IF;

  SELECT epicoins INTO v_current_epicoins FROM users WHERE id = v_user_id FOR UPDATE;
  IF v_current_epicoins < p_amount THEN RAISE EXCEPTION 'Solde insuffisant.'; END IF;

  SELECT e.status, o.multiplier INTO v_event_status, v_multiplier
  FROM odds o JOIN events e ON o.event_id = e.id WHERE o.id = p_odd_id;

  IF v_event_status != 'scheduled' THEN RAISE EXCEPTION 'Les paris sont fermés.'; END IF;

  UPDATE users SET epicoins = epicoins - p_amount WHERE id = v_user_id;

  INSERT INTO bets (user_id, odd_id, amount_wagered, locked_multiplier)
  VALUES (v_user_id, p_odd_id, p_amount, v_multiplier)
  RETURNING id INTO v_new_bet_id;

  RETURN v_new_bet_id;
END;
$$;

-- ==========================================
-- 6. STOCKAGE (STORAGE BUCKETS & POLICIES)
-- ==========================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );

