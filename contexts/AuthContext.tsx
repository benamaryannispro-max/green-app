
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient, Profile } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    
    const supabase = getSupabaseClient();
    
    // If Supabase is not configured, set loading to false and return
    if (!supabase) {
      console.warn('AuthProvider: Supabase client not available');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session loaded', session ? 'Session exists' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('AuthProvider: Cannot load profile - Supabase client not available');
      setLoading(false);
      return;
    }

    try {
      console.log('AuthProvider: Loading profile for user', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthProvider: Error loading profile', error);
        setProfile(null);
      } else {
        console.log('AuthProvider: Profile loaded', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('AuthProvider: Exception loading profile', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('AuthProvider: Refreshing profile');
      await loadProfile(user.id);
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    
    try {
      console.log('AuthProvider: Signing out');
      if (supabase) {
        await supabase.auth.signOut();
      }
      setProfile(null);
    } catch (error) {
      console.error('AuthProvider: Error signing out', error);
    } finally {
      // Always clear local state even if API call fails
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
