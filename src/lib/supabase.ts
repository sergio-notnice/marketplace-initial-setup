import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Initialize Supabase client with session persistence
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    cookieOptions: {
      name: 'sb-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'Lax',
      secure: true
    }
  }
});

// Debug: Log when Supabase client is initialized
if (import.meta.env.DEV) {
  console.log('Supabase client initialized');
}

// Session refresh handler
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Auth token refreshed');
  } else if (event === 'SIGNED_OUT') {
    localStorage.removeItem('sb-auth-token');
  }
});

// Type-safe query builder
export const db = supabase;