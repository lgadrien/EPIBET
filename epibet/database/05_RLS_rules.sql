-- ==========================================
-- 1. ACTIVATION DU RLS SUR TOUTES LES TABLES
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. NETTOYAGE DES ANCIENNES RÈGLES
-- ==========================================
-- (Permet de relancer ce script sans erreur si tu fais des modifications)
DROP POLICY IF EXISTS "Les utilisateurs voient leur propre profil" ON users;
DROP POLICY IF EXISTS "Événements visibles par tous" ON events;
DROP POLICY IF EXISTS "Cotes visibles par tous" ON odds;
DROP POLICY IF EXISTS "Paris visibles par tous" ON bets;
DROP POLICY IF EXISTS "Profils utilisateurs visibles par tous" ON users;

-- ==========================================
-- 3. CRÉATION DES RÈGLES DE LECTURE (SELECT)
-- ==========================================
-- Note : L'écriture (INSERT, UPDATE, DELETE) est bloquée par défaut pour toutes les tables.

-- Table USERS : Le coffre-fort
-- Les joueurs ne peuvent lire que leurs propres données complètes (email, solde, etc.).
CREATE POLICY "Les utilisateurs voient leur propre profil"
ON users FOR SELECT
USING ( auth.uid() = id );

-- Table EVENTS : Le catalogue
-- Tout le monde (même non connecté) peut voir la liste des événements.
CREATE POLICY "Événements visibles par tous"
ON events FOR SELECT
USING ( true );

-- Table ODDS : Les cotes
-- Tout le monde peut voir les cotes associées aux événements.
CREATE POLICY "Cotes visibles par tous"
ON odds FOR SELECT
USING ( true );

-- Table BETS : Les tickets
-- L'historique des paris est public pour le côté social de la plateforme.
CREATE POLICY "Paris visibles par tous"
ON bets FOR SELECT
USING ( true );

-- ==========================================
-- 4. CRÉATION DE LA VUE PUBLIQUE (VITRINE)
-- ==========================================
-- Expose uniquement les données non sensibles des utilisateurs pour le frontend.
-- Cette vue permet d'afficher qui a parié quoi sans exposer les emails ou les soldes.

CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  pseudo,
  streak
FROM users;