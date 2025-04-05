import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, AuthError, AuthState } from '../types';

export const useAuthStore = create<AuthState & {
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: User['role']) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      loading: false,
      error: null
    });
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      set({ 
        user: profile,
        isAuthenticated: true,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Sign in error:', error);
      set({ 
        user: null,
        isAuthenticated: false,
        loading: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to sign in'
        }
      });
    }
  },

  signUp: async (email, password, role) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name: email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // User will be created via database trigger
      set({ 
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Sign up error:', error);
      set({ 
        loading: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to sign up'
        }
      });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ 
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Sign out error:', error);
      set({ 
        loading: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to sign out'
        }
      });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      set({ loading: false, error: null });

    } catch (error) {
      console.error('Password reset error:', error);
      set({ 
        loading: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to reset password'
        }
      });
    }
  }
}));

// Initialize auth state
const initAuth = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      useAuthStore.getState().setUser(profile);
    } else {
      useAuthStore.getState().setUser(null);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuthStore.getState().setUser(null);
  }
};

// Initialize auth immediately
initAuth();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  try {
    if (event === 'SIGNED_IN' && session?.user) {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      useAuthStore.getState().setUser(profile);

    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      useAuthStore.getState().setUser(null);
    }
  } catch (error) {
    console.error('Error handling auth state change:', error);
    useAuthStore.getState().setUser(null);
  }
});