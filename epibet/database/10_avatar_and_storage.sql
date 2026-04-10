-- ==========================================
-- 10_AVATAR_AND_STORAGE.SQL
-- Migration de l'avatar et du Storage Bucket
-- ==========================================

-- 1. Ajouter la colonne avatar_url à la table users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Création du bucket 'avatars' (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Autorisation PUBLIQUE pour LIRE les images
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- 4. Autorisation pour UPLOADER une image
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'avatars' );

-- 5. Autorisation pour METTRE À JOUR une image
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );
