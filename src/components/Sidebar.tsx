import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
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
import { cn } from '../lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const { user, previewMode } = useAuthStore();
  const isBrand = user?.role === 'brand' || previewMode === 'brand';

  const brandNavigation = [
    { name: 'My Campaigns', href: '/brand/campaigns', icon: LayoutIcon },
    { name: 'Creators', href: '/brand/creators', icon: Search },
    { name: 'Creator Pool', href: '/brand/pool', icon: Users },
    { name: 'Create Campaign', href: '/brand/campaign/new', icon: PlusCircle },
    { name: 'Cooperations', href: '/brand/cooperations', icon: Briefcase },
    { name: 'Chat', href: '/brand/chat', icon: MessageSquare },
    { name: 'Invoices', href: '/brand/invoices', icon: FileText },
    { name: 'Company', href: '/brand/company', icon: Building },
    { name: 'Settings', href: '/brand/settings', icon: Settings },
  ];

  const creatorNavigation = [
    { name: 'Campaigns', href: '/creator/campaigns', icon: Briefcase },
    { name: 'Cooperations', href: '/creator/cooperations', icon: Users },
    { name: 'Payments', href: '/creator/payments', icon: DollarSign },
    { name: 'Profile', href: '/creator/profile', icon: UserCircle },
    { name: 'Chat', href: '/creator/chat', icon: MessageSquare },
    { name: 'Settings', href: '/creator/settings', icon: Settings },
  ];

  const navigation = isBrand ? brandNavigation : creatorNavigation;

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 px-6">
        <div className="h-16 shrink-0 flex items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Creator Marketplace"
          />
          {previewMode === 'brand' && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              Brand Preview
            </span>
          )}
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors',
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                            : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-50 dark:hover:bg-neutral-800'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-6 w-6 shrink-0 transition-colors',
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 py-3 text-sm">
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`}
                  alt={user?.name}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}