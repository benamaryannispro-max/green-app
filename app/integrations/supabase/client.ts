import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jxseegqhcycwkofbdceo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4c2VlZ3FoY3ljd2tvZmJkY2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDc4NzYsImV4cCI6MjA4NTYyMzg3Nn0.4Ksi1h1sblqA_h9j8q597VJ3h4JxMUPRXq5FyafYMVU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
