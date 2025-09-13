import React from 'react';
import { Notification } from '../types';
import { CheckCheck } from './icons';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAllRead, onNotificationClick }) => {

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-surface rounded-2xl shadow-lg border border-outline/20 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline/20">
        <h3 className="font-semibold text-on-surface">Notifications</h3>
        <button
          onClick={onMarkAllRead}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => onNotificationClick(notification)}
              className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${
                notification.read ? 'hover:bg-black/5' : 'bg-primary/5 hover:bg-primary/10'
              }`}
            >
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.read ? 'bg-surface-container' : 'bg-primary/20'}`}>
                <notification.icon className={`w-5 h-5 ${notification.read ? 'text-on-surface-variant' : 'text-primary'}`} />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-on-surface text-sm">{notification.title}</p>
                <p className="text-on-surface-variant text-xs mt-1">{notification.description}</p>
                <p className="text-xs text-on-surface-variant/70 mt-2">{timeAgo(notification.timestamp)}</p>
              </div>
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <p className="font-medium">No new notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-outline/20 text-center">
        <button className="text-sm font-medium text-primary hover:bg-primary/10 w-full py-2 rounded-lg transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
