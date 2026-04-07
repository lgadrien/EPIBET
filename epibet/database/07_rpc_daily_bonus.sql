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
  FROM users WHERE id = v_user_id;

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