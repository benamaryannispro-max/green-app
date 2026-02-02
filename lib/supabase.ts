
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// AsyncStorage keys for Supabase configuration
const SUPABASE_URL_KEY = '@supabase_url';
const SUPABASE_ANON_KEY_KEY = '@supabase_anon_key';

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
 * Load Supabase configuration from AsyncStorage or app.json
 * Priority: AsyncStorage > app.json extra
 */
export async function loadSupabaseConfig(): Promise<SupabaseConfigStatus> {
  console.log('Loading Supabase configuration...');

  try {
    // 1. Try loading from AsyncStorage first
    const storedUrl = await AsyncStorage.getItem(SUPABASE_URL_KEY);
    const storedAnonKey = await AsyncStorage.getItem(SUPABASE_ANON_KEY_KEY);

    if (storedUrl && storedAnonKey) {
      console.log('Supabase config loaded from AsyncStorage');
      supabaseConfig = {
        configured: true,
        supabaseUrl: storedUrl,
        supabaseAnonKey: storedAnonKey,
      };
      // Invalidate client to force re-initialization with new config
      supabaseClient = null;
      return supabaseConfig;
    }

    // 2. Fallback to app.json extra
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
        error: "Configuration Supabase requise",
      };
      console.warn('Supabase non configuré:', supabaseConfig.error);
    } else {
      console.log('Supabase config loaded from app.json');
      supabaseConfig = {
        configured: true,
        supabaseUrl: supabaseUrl,
        supabaseAnonKey: supabaseAnonKey,
      };
    }

    return supabaseConfig;
  } catch (error) {
    console.error('Error loading Supabase config:', error);
    supabaseConfig = {
      configured: false,
      supabaseUrl: null,
      supabaseAnonKey: null,
      error: "Erreur lors du chargement de la configuration",
    };
    return supabaseConfig;
  }
}

/**
 * Get the Supabase configuration status (synchronous)
 * Returns cached config or loads from Constants if not cached
 */
export function getSupabaseConfig(): SupabaseConfigStatus {
  if (supabaseConfig) {
    return supabaseConfig;
  }

  // Synchronous fallback - only checks app.json
  const expoConfigExtra = Constants.expoConfig?.extra;
  const manifestExtra = Constants.manifest?.extra;

  const supabaseUrl = (expoConfigExtra?.supabaseUrl || manifestExtra?.supabaseUrl) as string | undefined;
  const supabaseAnonKey = (expoConfigExtra?.supabaseAnonKey || manifestExtra?.supabaseAnonKey) as string | undefined;

  if (!supabaseUrl || !supabaseAnonKey) {
    supabaseConfig = {
      configured: false,
      supabaseUrl: supabaseUrl || null,
      supabaseAnonKey: supabaseAnonKey || null,
      error: "Configuration Supabase requise",
    };
  } else {
    supabaseConfig = {
      configured: true,
      supabaseUrl: supabaseUrl,
      supabaseAnonKey: supabaseAnonKey,
    };
  }

  return supabaseConfig;
}

/**
 * Save Supabase configuration to AsyncStorage
 */
export async function saveSupabaseConfig(url: string, anonKey: string): Promise<void> {
  console.log('Saving Supabase configuration to AsyncStorage');
  await AsyncStorage.setItem(SUPABASE_URL_KEY, url);
  await AsyncStorage.setItem(SUPABASE_ANON_KEY_KEY, anonKey);
  
  supabaseConfig = {
    configured: true,
    supabaseUrl: url,
    supabaseAnonKey: anonKey,
  };
  
  // Invalidate client to force re-initialization
  supabaseClient = null;
  console.log('Supabase configuration saved successfully');
}

/**
 * Reset Supabase configuration (clear AsyncStorage)
 */
export async function resetSupabaseConfig(): Promise<void> {
  console.log('Resetting Supabase configuration');
  await AsyncStorage.removeItem(SUPABASE_URL_KEY);
  await AsyncStorage.removeItem(SUPABASE_ANON_KEY_KEY);
  
  supabaseConfig = {
    configured: false,
    supabaseUrl: null,
    supabaseAnonKey: null,
  };
  
  // Invalidate client
  supabaseClient = null;
  console.log('Supabase configuration reset successfully');
}

/**
 * Test Supabase configuration by attempting to create a client and call getSession
 */
export async function testSupabaseConfig(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
  console.log('Testing Supabase configuration...');
  
  try {
    const testClient = createClient(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    // Lightweight test call
    const { error } = await testClient.auth.getSession();
    
    if (error) {
      console.error('Supabase test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Supabase configuration test successful');
    return { success: true };
  } catch (error) {
    console.error('Supabase test exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

/**
 * Get the Supabase client instance
 * Returns null if configuration is missing
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = supabaseConfig || getSupabaseConfig();
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
