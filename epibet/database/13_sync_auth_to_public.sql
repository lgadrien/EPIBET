-- ==========================================
-- 13_SYNC_AUTH_TO_PUBLIC.SQL
-- Synchronisation bidirectionnelle Auth -> Public
-- ==========================================

-- 1. Fonction de synchronisation
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users
  SET 
    email = new.email,
    nom = COALESCE(new.raw_user_meta_data->>'nom', nom),
    prénom = COALESCE(new.raw_user_meta_data->>'prenom', prénom),
    pseudo = COALESCE(new.raw_user_meta_data->>'pseudo', pseudo),
    avatar_url = COALESCE(new.raw_user_meta_data->>'avatar_url', avatar_url)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Création du Trigger
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_user();
