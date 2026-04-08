-- ==========================================
-- 08_AUTH_TRIGGER.SQL (V4 - FIX STREAK INSCRIPTION)
-- Synchronisation automatique Auth -> Public Users
-- ==========================================

-- 1. Configuration de base
ALTER TABLE public.users ALTER COLUMN epicoins SET DEFAULT 1000;
ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;

-- 2. Fonction de synchronisation avec Initialisation de Streak
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
    1,    -- On commence la streak à 1 dès l'inscription
    NOW() -- On marque la première connexion pour aujourd'hui
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Mise en place du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
