
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Define a type for the Supabase configuration status
export type SupabaseConfigStatus = {
  configured: boolean;
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  error?: string;
};

let supabaseConfig: SupabaseConfigStatus | null = null;
let supabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase configuration status
 * Checks if supabaseUrl and supabaseAnonKey are properly configured
 */
export function getSupabaseConfig(): SupabaseConfigStatus {
  if (supabaseConfig) {
    return supabaseConfig;
  }

  // Try to load from expoConfig.extra first, then fallback to manifest.extra
  const expoConfigExtra = Constants.expoConfig?.extra;
  const manifestExtra = Constants.manifest?.extra;

  const supabaseUrl = (expoConfigExtra?.supabaseUrl || manifestExtra?.supabaseUrl) as string | undefined;
  const supabaseAnonKey = (expoConfigExtra?.supabaseAnonKey || manifestExtra?.supabaseAnonKey) as string | undefined;

  console.log('Supabase Config Check:', {
    hasExpoConfig: !!expoConfigExtra,
    hasManifest: !!manifestExtra,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseConfig = {
      configured: false,
      supabaseUrl: supabaseUrl || null,
      supabaseAnonKey: supabaseAnonKey || null,
      error: "supabaseUrl et supabaseAnonKey sont requis dans la section 'extra' de app.json",
    };
    console.warn('Supabase non configuré:', supabaseConfig.error);
  } else {
    supabaseConfig = {
      configured: true,
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
    };
    console.log('Supabase configuré avec succès');
  }

  return supabaseConfig;
}

/**
 * Get the Supabase client instance
 * Returns null if configuration is missing
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = getSupabaseConfig();
  if (!config.configured) {
    console.error('Impossible de créer le client Supabase: Configuration manquante');
    return null;
  }

  try {
    supabaseClient = createClient(config.supabaseUrl!, config.supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    console.log('Client Supabase créé avec succès');
    return supabaseClient;
  } catch (error) {
    console.error('Erreur lors de la création du client Supabase:', error);
    return null;
  }
}

// Export the client for backward compatibility
// This will be null if not configured
export const supabase = getSupabaseClient();

// Database types for type safety
export interface Profile {
  id: string;
  role: 'driver' | 'team_leader' | 'admin';
  phone: string;
  first_name: string;
  last_name: string;
  approved: boolean;
  status: string;
  pin_hash: string | null;
  pin_attempts: number;
  pin_locked_until: string | null;
  created_at: string;
}
