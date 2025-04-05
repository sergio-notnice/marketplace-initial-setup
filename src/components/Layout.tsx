import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';
import { WorkspaceModal } from './ui/workspace-modal';
import Header from './Header';
import {
  Users,
  Briefcase,
  PlusCircle,
  Layout as LayoutIcon,
  MessageSquare,
  UserCircle,
  DollarSign,
  Settings,
  Building,
  FileText,
  Search
} from 'lucide-react';
import { Logo, LogoIcon } from './ui/sidebar-demo';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const { user, previewMode } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(null);
  const isBrand = user?.role === 'brand' || previewMode === 'brand';

  React.useEffect(() => {
    if (user?.id && isBrand) {
      fetchWorkspaces();
    }
  }, [user?.id, isBrand]);

  async function fetchWorkspaces() {
    try {
      // First get all workspaces where user is a member
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
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      // Then get all workspaces created by the user
      const { data: ownedWorkspaces, error: ownedError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('created_by', user?.id)
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

      setWorkspaces(uniqueWorkspaces);
      if (uniqueWorkspaces.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(uniqueWorkspaces[0]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  }

  async function createWorkspace() {
    try {
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

      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
      alert('Failed to create workspace. Please try again.');
    }
  }

  const brandLinks = [
    { label: 'My Campaigns', href: '/brand/campaigns', icon: <LayoutIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Creators', href: '/brand/creators', icon: <Search className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Creator Pool', href: '/brand/pool', icon: <Users className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Create Campaign', href: '/brand/campaign/new', icon: <PlusCircle className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Cooperations', href: '/brand/cooperations', icon: <Briefcase className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Chat', href: '/brand/chat', icon: <MessageSquare className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Invoices', href: '/brand/invoices', icon: <FileText className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Company', href: '/brand/company', icon: <Building className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Settings', href: '/brand/settings', icon: <Settings className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> }
  ];

  const creatorLinks = [
    { label: 'Campaigns', href: '/creator/campaigns', icon: <Briefcase className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Cooperations', href: '/creator/cooperations', icon: <Users className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Payments', href: '/creator/payments', icon: <DollarSign className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Profile', href: '/creator/profile', icon: <UserCircle className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Chat', href: '/creator/chat', icon: <MessageSquare className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> },
    { label: 'Settings', href: '/creator/settings', icon: <Settings className="w-5 h-5 text-neutral-700 dark:text-neutral-200" /> }
  ];

  const links = isBrand ? brandLinks : creatorLinks;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {isBrand && (
            <div>
              <button
                onClick={() => setIsWorkspaceModalOpen(true)}
                className="flex items-center gap-2 p-2 w-full hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <img
                  src={selectedWorkspace?.branding?.logo_url || `https://ui-avatars.com/api/?name=${selectedWorkspace?.name || user?.name}`}
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  alt="Avatar"
                />
                {open && (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedWorkspace?.name || user?.name}
                  </span>
                )}
              </button>
            </div>
          )}
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {isBrand && (
        <WorkspaceModal
          isOpen={isWorkspaceModalOpen}
          onClose={() => setIsWorkspaceModalOpen(false)}
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onSelect={setSelectedWorkspace}
          onCreateNew={createWorkspace}
        />
      )}
    </div>
  );
}