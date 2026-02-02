
# Green Hands - Configuration Supabase

## Étape 1: Créer un projet Supabase

1. Allez sur https://supabase.com
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations:
   - Name: Green Hands
   - Database Password: (choisissez un mot de passe fort)
   - Region: (choisissez la région la plus proche)
5. Attendez que le projet soit créé (2-3 minutes)

## Étape 2: Récupérer les clés API

1. Dans votre projet Supabase, allez dans Settings > API
2. Copiez les valeurs suivantes:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (la clé publique)

## Étape 3: Configurer l'application

Ouvrez le fichier `app.json` et remplacez les valeurs dans la section `extra`:

```json
"extra": {
  "supabaseUrl": "COLLEZ_VOTRE_PROJECT_URL_ICI",
  "supabaseAnonKey": "COLLEZ_VOTRE_ANON_KEY_ICI"
}
```

## Étape 4: Créer la table profiles

Le backend créera automatiquement la table, mais vous pouvez aussi la créer manuellement:

1. Dans Supabase, allez dans SQL Editor
2. Créez une nouvelle query
3. Collez ce code SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('driver', 'team_leader', 'admin')),
  phone TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  pin_hash TEXT,
  pin_attempts INTEGER DEFAULT 0,
  pin_locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins and team leaders can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'team_leader')
    )
  );

-- Create index for phone lookups
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
```

4. Cliquez sur "Run" pour exécuter

## Étape 5: Configurer l'authentification

1. Dans Supabase, allez dans Authentication > Settings
2. Configurez les options:
   - **Enable Email Confirmations**: OFF (pour simplifier le développement)
   - **Enable Phone Confirmations**: ON (si vous utilisez SMS)
3. Configurez les providers si nécessaire (Google, Apple, etc.)

## Étape 6: Tester l'application

```bash
# Installer les dépendances
npm install

# Lancer l'app
npm run ios
# ou
npm run android
```

## Vérification

L'application devrait:
1. ✅ Se connecter à Supabase sans erreur
2. ✅ Afficher la page de connexion
3. ✅ Permettre la création de compte
4. ✅ Router correctement selon le rôle

## Dépannage

### Erreur "Supabase URL or Anon Key not configured"
- Vérifiez que vous avez bien mis à jour `app.json`
- Redémarrez le serveur Expo après modification

### Erreur "relation profiles does not exist"
- La table n'a pas été créée
- Exécutez le SQL de l'Étape 4 manuellement

### Erreur de connexion
- Vérifiez votre connexion internet
- Vérifiez que l'URL Supabase est correcte
- Vérifiez que la clé anon est correcte

## Support

Pour plus d'informations:
- Documentation Supabase: https://supabase.com/docs
- Documentation Expo: https://docs.expo.dev
