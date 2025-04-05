import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Workspace {
  id: string;
  name: string;
  description: string;
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

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  onSelect: (workspace: Workspace) => void;
  onCreateNew: () => void;
}

export function WorkspaceModal({
  isOpen,
  onClose,
  workspaces,
  selectedWorkspace,
  onSelect,
  onCreateNew
}: WorkspaceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Switch Workspace
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Workspace List */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  {workspaces.map(workspace => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        onSelect(workspace);
                        onClose();
                      }}
                      className={cn(
                        "w-full p-3 flex items-center gap-3 rounded-lg transition-colors",
                        workspace.id === selectedWorkspace?.id
                          ? "bg-indigo-50 dark:bg-indigo-900/50"
                          : "hover:bg-gray-50 dark:hover:bg-neutral-700"
                      )}
                    >
                      {workspace.branding?.logo_url ? (
                        <img
                          src={workspace.branding.logo_url}
                          alt={workspace.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <Building className="w-10 h-10 p-2 bg-gray-100 dark:bg-neutral-700 rounded-lg" />
                      )}
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {workspace.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {workspace.description}
                        </p>
                      </div>
                      {workspace.metadata?.type === 'free' && (
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-neutral-700 rounded">
                          Free
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
                <button
                  onClick={() => {
                    onCreateNew();
                    onClose();
                  }}
                  className="w-full px-4 py-2 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create New Workspace</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}