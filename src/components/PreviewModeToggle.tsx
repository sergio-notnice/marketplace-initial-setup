import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PreviewModeToggle() {
  const { previewMode, setPreviewMode } = useAuthStore();

  const togglePreviewMode = () => {
    if (previewMode === 'brand') {
      setPreviewMode(null);
    } else {
      setPreviewMode('brand');
    }
  };

  if (!previewMode && window.location.pathname.includes('/brand')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={togglePreviewMode}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors",
          previewMode === 'brand'
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        )}
      >
        {previewMode === 'brand' ? (
          <>
            <EyeOff className="w-4 h-4" />
            Exit Brand Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Preview as Brand
          </>
        )}
      </button>
    </div>
  );
}