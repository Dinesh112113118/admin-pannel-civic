import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, LogOut } from './icons';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import { Notification } from '../types';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchEnter: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onNotificationSelect: (notification: Notification) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  onSearchEnter, 
  notifications, 
  onMarkAllRead, 
  onNotificationSelect 
}) => {
  const { user, logout } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasUnread = notifications.some(n => !n.read);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchEnter();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationSelect(notification);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-outline/20">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search and press Enter to locate on map..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-surface-container border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-full py-2.5 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <Bell className="w-6 h-6 text-on-surface-variant" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
            )}
          </button>
          {isPanelOpen && (
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={onMarkAllRead}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-on-surface">{user?.username || 'User'}</p>
            <p className="text-on-surface-variant">{user?.department} • {user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-error-container hover:text-error transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
