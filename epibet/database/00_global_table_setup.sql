-- ========================================================
-- 00_GLOBAL_TABLE_SETUP.SQL
-- Ce script regroupe l'intégralité du schéma de la base de données
-- ========================================================

-- RÉINITIALISATION --
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS odds CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS public_profiles CASCADE;
DROP FUNCTION IF EXISTS place_bet;
DROP FUNCTION IF EXISTS claim_daily_bonus;

-- ==========================================
-- 1. TABLES DE BASE
-- ==========================================

-- Table USERS
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

-- Table EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- Ex: "Finale Worlds LoL 2026", "Vainqueur Koh-Lanta"
  description TEXT, -- Pour donner du contexte au pari fun
  category TEXT NOT NULL, -- Ex: 'sport', 'esport', 'fun', 'politique'
  start_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'finished', 'cancelled'))
);

-- Table ODDS
CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL, -- Ex: "T1", "Fnatic", "Rouge", "Denis Brogniart"
  multiplier DECIMAL(5,2) NOT NULL CHECK (multiplier > 1.0), -- La cote
  UNIQUE(event_id, option_name) -- Empêche les doublons pour un même événement
);

-- Table BETS
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  odd_id UUID NOT NULL REFERENCES odds(id) ON DELETE RESTRICT,
  amount_wagered INTEGER NOT NULL CHECK (amount_wagered > 0), -- La mise en epicoins
  locked_multiplier DECIMAL(5,2) NOT NULL, -- CRUCIAL : La cote au moment précisément du pari
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'won', 'lost', 'refunded')),
  placed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 2. SÉCURITÉ (RLS & POLICIES)
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Nettoyage des anciennes règles
DROP POLICY IF EXISTS "Les utilisateurs voient leur propre profil" ON users;
DROP POLICY IF EXISTS "Événements visibles par tous" ON events;
DROP POLICY IF EXISTS "Cotes visibles par tous" ON odds;
DROP POLICY IF EXISTS "Paris visibles par tous" ON bets;

-- Politiques de lecture
CREATE POLICY "Les utilisateurs voient leur propre profil" ON users FOR SELECT USING ( auth.uid() = id );
CREATE POLICY "Événements visibles par tous" ON events FOR SELECT USING ( true );
CREATE POLICY "Cotes visibles par tous" ON odds FOR SELECT USING ( true );
CREATE POLICY "Paris visibles par tous" ON bets FOR SELECT USING ( true );

-- Vue publique pour les profils (vitrine)
CREATE OR REPLACE VIEW public_profiles AS
SELECT id, pseudo, streak FROM users;

-- ==========================================
-- 3. FONCTIONS (RPC)
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

CREATE OR REPLACE FUNCTION claim_daily_bonus()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- CRUCIAL : Contourne le RLS pour mettre à jour la table 'users'
AS $$
DECLARE
  v_user_id UUID;
  v_last_login TIMESTAMPTZ;
  v_current_streak INTEGER;
  v_days_diff INTEGER;
BEGIN
  -- 1. Identifier le joueur qui fait la requête
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non connecté.';
  END IF;

  -- 2. Récupérer son historique de connexion
  SELECT last_logged_in, streak INTO v_last_login, v_current_streak
  FROM users WHERE id = v_user_id FOR UPDATE;

  -- 3. Si c'est sa toute première récompense (last_logged_in est vide)
  IF v_last_login IS NULL THEN
    UPDATE users
    SET streak = 1, epicoins = epicoins + 100, last_logged_in = NOW()
    WHERE id = v_user_id;

    RETURN json_build_object('success', true, 'message', 'Premier bonus !', 'streak', 1, 'epicoins_won', 100);
  END IF;

  -- 4. Calculer le nombre de jours écoulés depuis la dernière récompense
  -- On convertit en DATE pour ignorer les heures et se baser uniquement sur les jours calendaires
  v_days_diff := (NOW() AT TIME ZONE 'UTC')::DATE - (v_last_login AT TIME ZONE 'UTC')::DATE;

  -- 5. Appliquer la logique de la Streak
  IF v_days_diff = 0 THEN
    -- Il a déjà cliqué aujourd'hui
    RAISE EXCEPTION 'Bonus déjà réclamé aujourd''hui. Reviens demain !';

  ELSIF v_days_diff = 1 THEN
    -- Il s'est connecté hier : on augmente la série (+1) et on donne l'argent (+100)
    UPDATE users
    SET streak = streak + 1, epicoins = epicoins + 100, last_logged_in = NOW()
    WHERE id = v_user_id;

    RETURN json_build_object('success', true, 'message', 'Série augmentée !', 'streak', v_current_streak + 1, 'epicoins_won', 100);

  ELSE
    -- Il a raté un ou plusieurs jours : la série est brisée, on remet à 1
    UPDATE users
    SET streak = 1, epicoins = epicoins + 100, last_logged_in = NOW()
    WHERE id = v_user_id;

    RETURN json_build_object('success', true, 'message', 'Série brisée, on recommence à 1.', 'streak', 1, 'epicoins_won', 100);
  END IF;
END;
$$;
