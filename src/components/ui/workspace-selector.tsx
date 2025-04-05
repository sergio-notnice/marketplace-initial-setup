import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, ChevronDown, Building } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface Workspace {
  id: string;
  name: string;
  branding: {
    logo_url: string | null;
    primary_color: string | null;
    accent_color: string | null;
  };
}

export function WorkspaceSelector() {
  const { user } = useAuthStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchWorkspaces();
    }
  }, [user?.id]);

  async function fetchWorkspaces() {
    try {
      setLoading(true);
      const { data: workspaceMembers, error: membersError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user?.id);

      if (membersError) throw membersError;

      const workspaceIds = workspaceMembers?.map(m => m.workspace_id) || [];

      const { data: workspaces, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds)
        .eq('status', 'active');

      if (workspacesError) throw workspacesError;

      setWorkspaces(workspaces || []);
      if (workspaces?.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(workspaces[0]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace() {
    try {
      // Get the company name from the user's profile
      const { data: company, error: companyError } = await supabase
        .from('users')
        .select('name')
        .eq('id', user?.id)
        .single();

      if (companyError) throw companyError;

      if (!company?.name) {
        alert('Please set your company name in the company settings first.');
        return;
      }

      const { data, error } = await supabase.rpc('create_workspace', {
        workspace_name: company.name
      });

      if (error) throw error;

      // Refresh workspaces list
      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-neutral-800">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-neutral-800">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {selectedWorkspace?.branding?.logo_url ? (
            <img
              src={selectedWorkspace.branding.logo_url}
              alt={selectedWorkspace.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <Building className="w-8 h-8 p-1.5 bg-gray-100 dark:bg-neutral-700 rounded-lg" />
          )}
          <span className="font-medium">{selectedWorkspace?.name || 'Select Workspace'}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-2">
            {workspaces.map(workspace => (
              <button
                key={workspace.id}
                onClick={() => {
                  setSelectedWorkspace(workspace);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-neutral-700",
                  workspace.id === selectedWorkspace?.id && "bg-gray-50 dark:bg-neutral-700"
                )}
              >
                {workspace.branding?.logo_url ? (
                  <img
                    src={workspace.branding.logo_url}
                    alt={workspace.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <Building className="w-6 h-6 p-1 bg-gray-100 dark:bg-neutral-700 rounded" />
                )}
                <span className="text-sm">{workspace.name}</span>
              </button>
            ))}
            
            <div className="border-t border-gray-200 dark:border-neutral-700 mt-2 pt-2">
              <button
                onClick={createWorkspace}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="text-sm">Create New Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}