-- ==========================================
-- 09_STREAK_SYSTEM.SQL (VERSION AUTOMATIQUE CORRIGÉE)
-- Mise à jour systématique de last_logged_in
-- ==========================================

CREATE OR REPLACE FUNCTION public.proc_daily_streak_update()
RETURNS trigger AS $$
DECLARE
  v_last_login TIMESTAMPTZ;
  v_current_streak INTEGER;
  v_days_diff INTEGER;
  v_reward INTEGER := 100;
BEGIN
  -- Récupérer les infos actuelles
  SELECT last_logged_in, streak INTO v_last_login, v_current_streak
  FROM public.users WHERE id = new.id;

  IF NOT FOUND THEN RETURN new; END IF;

  -- Calculer l'écart de jours (UTC)
  v_days_diff := (NOW() AT TIME ZONE 'UTC')::DATE - (v_last_login AT TIME ZONE 'UTC')::DATE;

  -- GESTION DU BONUS ET DE LA SÉRIE (Une seule fois par jour calendaire)
  IF v_days_diff = 1 THEN
    UPDATE public.users SET streak = streak + 1, epicoins = epicoins + v_reward WHERE id = new.id;
  ELSIF v_days_diff > 1 THEN
    UPDATE public.users SET streak = 1, epicoins = epicoins + v_reward WHERE id = new.id;
  END IF;

  -- MISE À JOUR SYSTÉMATIQUE DE LA DERNIÈRE ACTIVITÉ (Même si days_diff = 0)
  UPDATE public.users SET last_logged_in = NOW() WHERE id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_auth_login ON auth.users;
CREATE TRIGGER tr_on_auth_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.proc_daily_streak_update();
