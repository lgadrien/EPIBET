-- ==========================================
-- 14_SEED_DEMO_EVENTS.SQL
-- Matchs de démonstration pour le Dashboard
-- ==========================================

-- On nettoie d'abord les événements et cotes existants pour repartir propre
DELETE FROM odds;
DELETE FROM events;

-- 1. FOOTBALL
DO $$ 
DECLARE 
    v_event_id UUID;
BEGIN
    INSERT INTO events (title, description, category, start_time, status)
    VALUES ('PSG vs Marseille', 'Ligue 1 - Le Classique', 'Football', NOW() - INTERVAL '45 minutes', 'in_progress')
    RETURNING id INTO v_event_id;

    INSERT INTO odds (event_id, option_name, multiplier) VALUES 
    (v_event_id, 'PSG', 1.45),
    (v_event_id, 'Nul', 4.20),
    (v_event_id, 'Marseille', 6.50);

    INSERT INTO events (title, description, category, start_time, status)
    VALUES ('Real Madrid vs Barcelone', 'La Liga - El Clásico', 'Football', NOW() + INTERVAL '5 hours', 'scheduled')
    RETURNING id INTO v_event_id;

    INSERT INTO odds (event_id, option_name, multiplier) VALUES 
    (v_event_id, 'Real Madrid', 2.10),
    (v_event_id, 'Nul', 3.60),
    (v_event_id, 'Barcelone', 3.20);
END $$;

-- 3. TENNIS
DO $$ 
DECLARE 
    v_event_id UUID;
BEGIN
    INSERT INTO events (title, description, category, start_time, status)
    VALUES ('Djokovic vs Alcaraz', 'Wimbledon Final', 'Tennis', NOW() + INTERVAL '1 day', 'scheduled')
    RETURNING id INTO v_event_id;

    INSERT INTO odds (event_id, option_name, multiplier) VALUES 
    (v_event_id, 'Djokovic', 1.70),
    (v_event_id, 'Alcaraz', 2.15);
END $$;

