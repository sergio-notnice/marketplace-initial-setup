import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  branding: {
    logo_url: string | null;
    primary_color: string | null;
    accent_color: string | null;
  };
  metadata: {
    type: 'free' | 'pro';
    features: string[];
  };
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  setActiveWorkspace: (workspace: Workspace) => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    try {
      set({ loading: true, error: null });
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error('No authenticated user');
      }

      // Get all workspaces where user is a member
      const { data: memberWorkspaces, error: memberError } = await supabase
        .from('workspace_members')
        .select(`
          workspace:workspaces (
            id,
            name,
            description,
            branding,
            metadata
          )
        `)
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // Get all workspaces created by the user
      const { data: ownedWorkspaces, error: ownedError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'active');

      if (ownedError) throw ownedError;

      // Combine and deduplicate workspaces
      const allWorkspaces = [
        ...(memberWorkspaces?.map(m => m.workspace) || []),
        ...(ownedWorkspaces || [])
      ];

      // Remove duplicates based on workspace ID
      const uniqueWorkspaces = Array.from(
        new Map(allWorkspaces.map(w => [w.id, w])).values()
      );

      set({ workspaces: uniqueWorkspaces });

      // Set active workspace if not already set
      if (!get().activeWorkspace && uniqueWorkspaces.length > 0) {
        const defaultWorkspace = uniqueWorkspaces.find(w => w.id === user.active_workspace_id) || uniqueWorkspaces[0];
        await get().setActiveWorkspace(defaultWorkspace);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      set({ error: 'Failed to load workspaces' });
    } finally {
      set({ loading: false });
    }
  },

  setActiveWorkspace: async (workspace) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      // Update user's active workspace in the database
      const { error } = await supabase
        .from('users')
        .update({ active_workspace_id: workspace.id })
        .eq('id', user.id);

      if (error) throw error;

      set({ activeWorkspace: workspace });
    } catch (error) {
      console.error('Error setting active workspace:', error);
      set({ error: 'Failed to set active workspace' });
    }
  },

  createWorkspace: async (name, description) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.rpc('create_workspace', {
        workspace_name: name,
        workspace_description: description
      });

      if (error) throw error;

      // Refresh workspaces list
      await get().fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
      set({ error: 'Failed to create workspace' });
    } finally {
      set({ loading: false });
    }
  }
}));