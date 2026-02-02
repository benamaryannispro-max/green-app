
# Green Hands - Foundation (Page 0)

Mobile app for iOS and Android built with React Native + Expo 54 and Supabase backend.

## 🏗️ Architecture

This is the foundation setup with:
- ✅ Supabase client configured
- ✅ Database schema ready (profiles table)
- ✅ Navigation structure in place
- ✅ Authentication context
- ✅ Bootstrap utility for first leader

## 📱 Pages Structure

- **Index** (`/`) - Initial loading and auth check
- **Page 1** (`/login`) - Connexion (to be implemented)
- **Page 2** (`/router`) - Profile loading and routing logic
- **Page 3** (`/admin-home`) - Admin/Team Leader home (to be implemented)
- **Page 5** (`/driver-dashboard`) - Driver dashboard (to be implemented)

## 🔧 Setup Instructions

### 1. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Update `app.json` with your credentials:

```json
"extra": {
  "supabaseUrl": "https://your-project.supabase.co",
  "supabaseAnonKey": "your-anon-key-here"
}
```

### 2. Database Setup

The backend will automatically create the `profiles` table with this schema:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
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
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔐 Authentication Flow

1. User opens app → redirected to `/login`
2. After login → redirected to `/router`
3. Router loads profile and checks:
   - If no leaders exist → bootstrap first user as team_leader
   - Route based on role:
     - `admin` or `team_leader` → `/admin-home`
     - `driver` → `/driver-dashboard`

## 📦 Key Files

- `lib/supabase.ts` - Supabase client configuration
- `contexts/AuthContext.tsx` - Authentication state management
- `utils/bootstrap.ts` - First leader bootstrap logic
- `styles/commonStyles.ts` - App-wide color palette and styles

## 🎨 Design System

**Colors:**
- Primary: `#10B981` (Green)
- Secondary: `#3B82F6` (Blue)
- Accent: `#F59E0B` (Amber)

**Roles:**
- `driver` - Chauffeur
- `team_leader` - Chef d'équipe
- `admin` - Administrateur

## 🚀 Next Steps (Not in this version)

- Page 1: Implement login UI with phone number
- Page 2: Complete profile creation flow
- Page 3: Build admin/team leader interface
- Page 5: Build driver dashboard

## 📝 Notes

- No QR code functionality in V1
- Role is NOT determined by email domain
- Phone numbers must be in international format (+33...)
- PIN security with attempt tracking and lockout
- All pages have back button except Page 2 (router)
