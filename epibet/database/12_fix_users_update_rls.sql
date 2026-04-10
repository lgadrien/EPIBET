-- ==========================================
-- 12_FIX_USERS_UPDATE_RLS.SQL
-- Autorise les utilisateurs à modifier leur propre ligne dans 'users'
-- ==========================================

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur profil" ON public.users;

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil" 
ON public.users FOR UPDATE 
USING ( auth.uid() = id );
