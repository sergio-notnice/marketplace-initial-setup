import { db } from './supabase';
import type { User } from '../types';

export const api = {
  auth: {
    getSession: async () => {
      const { data: { session }, error } = await db.auth.getSession();
      if (error) throw error;
      return session;
    },

    getUser: async () => {
      const { data: { user }, error } = await db.auth.getUser();
      if (error) throw error;
      return user;
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },

    signUp: async (email: string, password: string, role: User['role']) => {
      const { data, error } = await db.auth.signUp({
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
      return data;
    },

    signOut: async () => {
      const { error } = await db.auth.signOut();
      if (error) throw error;
    },

    resetPassword: async (email: string) => {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
    }
  },

  users: {
    getProfile: async (userId: string) => {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },

    updateProfile: async (userId: string, updates: Partial<User>) => {
      const { data, error } = await db
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }
};