import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, X, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { WorkspaceSelector } from './ui/workspace-selector';
import { ThemeToggle } from './ui/theme-toggle';
import { supabase } from '../lib/supabase';

// Mock notifications for development
const mockNotifications = [
  {
    id: 'notif1',
    type: 'campaign_invite',
    title: 'New Campaign Invitation',
    message: 'Nike has invited you to their Summer Sports Collection campaign',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 'notif2',
    type: 'message',
    title: 'New Message',
    message: 'Adidas: The storyboard looks great! Please proceed with the shooting.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'notif3',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received a payment of $2,500 for the Under Armour campaign',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

// Mock messages for development
const mockMessages = [
  {
    id: 'msg1',
    sender: {
      id: 'brand1',
      name: 'Nike Marketing',
      avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
    },
    message: 'The storyboard looks great! Please proceed with the shooting.',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: 'msg2',
    sender: {
      id: 'brand2',
      name: 'Adidas Sports',
      avatar: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100&h=100',
    },
    message: 'When can we expect the first draft of the video?',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'msg3',
    sender: {
      id: 'brand3',
      name: 'Puma Lifestyle',
      avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
    },
    message: 'Great work! The campaign exceeded our expectations. Looking forward to working with you again.',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'campaign_invite':
      return <Bell className="w-4 h-4 text-indigo-500" />;
    case 'message':
      return <MessageSquare className="w-4 h-4 text-green-500" />;
    case 'payment':
      return <div className="w-4 h-4 flex items-center justify-center text-yellow-500 font-bold">$</div>;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
}

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Count unread notifications and messages
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  const unreadMessages = mockMessages.filter(m => !m.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    setShowProfileMenu(false);
  };

  const handleMessageClick = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
    setShowMessages(false);
  };

  const markAllNotificationsAsRead = () => {
    // In a real app, this would call an API to mark notifications as read
    console.log('Marking all notifications as read');
  };

  const markAllMessagesAsRead = () => {
    // In a real app, this would call an API to mark messages as read
    console.log('Marking all messages as read');
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user from store
      setUser(null);
      
      // Redirect to login
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={handleNotificationClick}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {mockNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={cn(
                            "p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer",
                            !notification.read && "bg-indigo-50 dark:bg-indigo-900/50"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                              <NotificationIcon type={notification.type} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium text-gray-900 dark:text-gray-100",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-neutral-700">
                  <button className="w-full text-center p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors flex items-center justify-center">
                    View all notifications
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              type="button"
              className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={handleMessageClick}
            >
              <span className="sr-only">Messages</span>
              <MessageSquare className="h-6 w-6" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadMessages}
                </span>
              )}
            </button>

            {/* Messages Dropdown */}
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
                    <button
                      onClick={markAllMessagesAsRead}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockMessages.length === 0 ? (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                      No messages
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                      {mockMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={cn(
                            "p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer",
                            !message.read && "bg-indigo-50 dark:bg-indigo-900/50"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <img 
                                src={message.sender.avatar} 
                                alt={message.sender.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium text-gray-900 dark:text-gray-100",
                                !message.read && "font-semibold"
                              )}>
                                {message.sender.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {message.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {formatTimestamp(message.timestamp)}
                              </p>
                            </div>
                            {!message.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-neutral-700">
                  <button className="w-full text-center p-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-md transition-colors flex items-center justify-center">
                    View all messages
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-x-4 lg:gap-x-6 hover:opacity-80 transition-opacity"
            >
              <img
                className="h-8 w-8 rounded-full bg-gray-50"
                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`}
                alt={user?.name}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-2">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    Signed in as
                  </div>
                  <div className="px-4 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user?.email}
                  </div>
                  <div className="border-t border-gray-100 dark:border-neutral-700 my-2"></div>
                  <a
                    href="/creator/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                  >
                    <User className="w-4 h-4" />
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <div className="border-t border-gray-100 dark:border-neutral-700 my-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}