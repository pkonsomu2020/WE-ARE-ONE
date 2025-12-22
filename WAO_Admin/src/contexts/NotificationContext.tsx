import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  source: 'event' | 'feedback' | 'file' | 'settings' | 'system';
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load notifications from backend
  const loadNotifications = useCallback(async () => {
    try {
      const response = await api.notifications.getAll({ limit: 50 });
      if (response.success) {
        const backendNotifications = response.data.notifications.map((n: any) => ({
          id: n.id.toString(),
          title: n.title,
          message: n.message,
          type: n.type,
          timestamp: new Date(n.createdAt),
          read: n.isRead,
          source: n.source,
          actionUrl: n.actionUrl
        }));
        setNotifications(backendNotifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Fallback to sample notifications if backend fails
      setNotifications([
        {
          id: '1',
          title: 'Welcome to Admin Portal',
          message: 'System initialized successfully. All features are ready to use.',
          type: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false,
          source: 'system',
          actionUrl: '/admin'
        }
      ]);
      setUnreadCount(1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const response = await api.notifications.create(notificationData);
      if (response.success) {
        // Reload notifications to get the latest from backend
        await loadNotifications();
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Fallback to local state if backend fails
      const newNotification: Notification = {
        ...notificationData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await api.notifications.markAsRead(parseInt(id));
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Fallback to local state update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await api.notifications.markAllAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Fallback to local state update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      const response = await api.notifications.delete(parseInt(id));
      if (response.success) {
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to remove notification:', error);
      // Fallback to local state update
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  }, [notifications]);

  const clearAllNotifications = useCallback(async () => {
    try {
      const response = await api.notifications.clearAll();
      if (response.success) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      // Fallback to local state update
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};