import { useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/authStore';

export function useWorkspace() {
  const { user } = useAuthStore();
  const { 
    workspaces,
    activeWorkspace,
    loading,
    error,
    fetchWorkspaces,
    setActiveWorkspace,
    createWorkspace
  } = useWorkspaceStore();

  useEffect(() => {
    if (user?.id) {
      fetchWorkspaces();
    }
  }, [user?.id]);

  return {
    workspaces,
    activeWorkspace,
    loading,
    error,
    setActiveWorkspace,
    createWorkspace
  };
}