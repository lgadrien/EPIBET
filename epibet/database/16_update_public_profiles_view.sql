-- ==========================================
-- 16_UPDATE_PUBLIC_PROFILES_VIEW.SQL
-- Ajouter avatar_url à la vue pour le classement
-- ==========================================

CREATE OR REPLACE VIEW public_profiles AS
SELECT id, pseudo, streak, epicoins, avatar_url FROM users;
