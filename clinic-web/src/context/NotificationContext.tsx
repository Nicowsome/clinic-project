import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
  autoHideDuration?: number;
  read?: boolean;
  createdAt: Date;
  link?: string;
  linkText?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

// Load notifications from local storage
const loadNotifications = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      // Convert stored date strings back to Date objects
      return JSON.parse(storedNotifications).map((notification: any) => ({
        ...notification,
        createdAt: new Date(notification.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load notifications from local storage:', error);
  }
  return [];
};

// Save notifications to local storage
const saveNotifications = (notifications: Notification[]) => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications to local storage:', error);
  }
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  maxNotifications = 30 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Auto-remove notifications when they exceed the maximum
  useEffect(() => {
    if (notifications.length > maxNotifications) {
      const sortedNotifications = [...notifications].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      setNotifications(sortedNotifications.slice(0, maxNotifications));
    }
  }, [notifications, maxNotifications]);

  // Save notifications to local storage whenever they change
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9), // Using simple ID generator instead of UUID
      createdAt: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-hide notification if duration is provided
    if (notification.autoHideDuration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.autoHideDuration);
    }

    return newNotification.id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
