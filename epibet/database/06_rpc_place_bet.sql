CREATE OR REPLACE FUNCTION place_bet(p_odd_id UUID, p_amount INTEGER)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- CRUCIAL : Permet à la fonction de contourner le RLS pour écrire dans la table bets
AS $$
DECLARE
  v_user_id UUID;
  v_current_epicoins INTEGER;
  v_event_status TEXT;
  v_multiplier DECIMAL(5,2);
  v_new_bet_id UUID;
BEGIN
  -- 1. Récupérer l'ID de l'utilisateur qui fait la requête depuis son navigateur
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non connecté.';
  END IF;

  -- 2. Vérifier le solde de l'utilisateur
  SELECT epicoins INTO v_current_epicoins FROM users WHERE id = v_user_id FOR UPDATE;
  IF v_current_epicoins < p_amount THEN
    RAISE EXCEPTION 'Solde insuffisant.';
  END IF;

  -- 3. Vérifier que le match n'a pas commencé et récupérer la cote actuelle
  SELECT e.status, o.multiplier INTO v_event_status, v_multiplier
  FROM odds o
  JOIN events e ON o.event_id = e.id
  WHERE o.id = p_odd_id;

  IF v_event_status != 'scheduled' THEN
    RAISE EXCEPTION 'Les paris sont fermés pour cet événement.';
  END IF;

  -- 4. Tout est bon : On débite les epicoins du joueur
  UPDATE users SET epicoins = epicoins - p_amount WHERE id = v_user_id;

  -- 5. On crée le ticket de pari avec la cote figée
  INSERT INTO bets (user_id, odd_id, amount_wagered, locked_multiplier)
  VALUES (v_user_id, p_odd_id, p_amount, v_multiplier)
  RETURNING id INTO v_new_bet_id;

  -- On renvoie l'ID du nouveau ticket au front
  RETURN v_new_bet_id;
END;
$$;