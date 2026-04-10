-- =============================================
-- 15_RESOLVE_BETS_LOGIC.SQL
-- Logique de clôture de match et paiements auto
-- =============================================

CREATE OR REPLACE FUNCTION resolve_event(p_event_id UUID, p_winning_odd_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bet RECORD;
BEGIN
    -- 1. On vérifie que l'odd appartient bien à l'event
    IF NOT EXISTS (SELECT 1 FROM odds WHERE id = p_winning_odd_id AND event_id = p_event_id) THEN
        RAISE EXCEPTION 'Cette cote n''appartient pas à cet événement.';
    END IF;

    -- 2. On passe l'événement en statut 'finished'
    UPDATE events SET status = 'finished' WHERE id = p_event_id;

    -- 3. On traite tous les paris EN ATTENTE sur cet événement
    -- On boucle sur les paris pour cet événement
    FOR v_bet IN 
        SELECT b.id, b.user_id, b.amount_wagered, b.locked_multiplier, b.odd_id
        FROM bets b
        JOIN odds o ON b.odd_id = o.id
        WHERE o.event_id = p_event_id AND b.status = 'pending'
    LOOP
        IF v_bet.odd_id = p_winning_odd_id THEN
            -- LE PARI EST GAGNÉ
            -- a. On marque le pari comme gagné
            UPDATE bets SET status = 'won' WHERE id = v_bet.id;
            
            -- b. On crédite l'utilisateur (Mise * Multiplicateur)
            UPDATE users 
            SET epicoins = epicoins + FLOOR(v_bet.amount_wagered * v_bet.locked_multiplier)
            WHERE id = v_bet.user_id;
        ELSE
            -- LE PARI EST PERDU
            UPDATE bets SET status = 'lost' WHERE id = v_bet.id;
        END IF;
    END LOOP;
END;
$$;
