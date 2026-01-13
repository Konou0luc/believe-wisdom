'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Reservation } from '@/lib/api';

export interface Notification {
  id: string;
  reservationId: string;
  type: 'status_change';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  reservation?: Reservation;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  loadNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'believe_notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Charger les notifications depuis le localStorage au montage
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    }
  }, []);

  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
        setNotifications(newNotifications);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des notifications:', error);
      }
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    // Vérifier si une notification similaire existe déjà pour éviter les doublons
    setNotifications((prev) => {
      // Créer un identifiant unique basé sur le contenu pour détecter les doublons
      const duplicateKey = `${notification.reservationId}-${notification.title}-${notification.type}`;
      
      // Vérifier si une notification similaire existe déjà
      const isDuplicate = prev.some((n) => {
        const existingKey = `${n.reservationId}-${n.title}-${n.type}`;
        return existingKey === duplicateKey;
      });

      if (isDuplicate) {
        // Si c'est un doublon, ne pas l'ajouter
        return prev;
      }

      // Générer un ID unique avec timestamp et random pour éviter les collisions
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${notification.reservationId?.substring(0, 8) || 'new'}`;
      
      const newNotification: Notification = {
        ...notification,
        id: uniqueId,
        read: false,
        createdAt: new Date().toISOString(),
      };

      const updated = [newNotification, ...prev];
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({ ...notif, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notif) => notif.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}


