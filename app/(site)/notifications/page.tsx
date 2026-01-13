'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { formatDateTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Trash2, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  // Supprimé : ne plus marquer automatiquement toutes les notifications comme lues

  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      removeNotification(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer toutes les notifications (${notifications.length}) ?`)) {
      clearAll();
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return CheckCircle2;
      default:
        return Bell;
    }
  };

  const getStatusColor = (type: string, title?: string) => {
    // Vérifier si c'est une notification de confirmation
    const isConfirmed = title?.toLowerCase().includes('confirmé') || title?.toLowerCase().includes('confirme');
    
    switch (type) {
      case 'status_change':
        if (isConfirmed) {
          return 'bg-green-50 border-green-200 text-green-800';
        }
        return 'bg-rose-50 border-rose-200 text-rose-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-lg text-gray-600 font-light">
                {notifications.length === 0
                  ? 'Aucune notification'
                  : `${notifications.length} notification${notifications.length > 1 ? 's' : ''}`}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCheck size={16} />
                  Tout marquer comme lu
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Tout supprimer
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {notifications.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => {
                const Icon = getStatusIcon(notification.type);
                const isConfirmed = notification.title?.toLowerCase().includes('confirmé') || 
                                   notification.title?.toLowerCase().includes('confirme');
                const colorClass = getStatusColor(notification.type, notification.title);

                return (
                  <motion.div
                    key={`notification-${notification.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-xl p-6 ${colorClass} ${
                      !notification.read 
                        ? isConfirmed 
                          ? 'ring-2 ring-green-200' 
                          : 'ring-2 ring-rose-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          isConfirmed
                            ? 'bg-green-100'
                            : notification.type === 'status_change'
                            ? 'bg-rose-100'
                            : 'bg-gray-100'
                        }`}>
                          <Icon
                            className={
                              isConfirmed
                                ? 'text-green-600'
                                : notification.type === 'status_change'
                                ? 'text-rose-600'
                                : 'text-gray-600'
                            }
                            size={20}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className={`w-2 h-2 rounded-full ${
                                isConfirmed ? 'bg-green-500' : 'bg-rose-500'
                              }`}></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          {notification.reservation && (
                            <div className="text-xs text-gray-500 mb-2">
                              Réservation du{' '}
                              {formatDateTime(
                                notification.reservation.date,
                                notification.reservation.heure
                              )}
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                            title="Marquer comme lu"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white/50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Link
              href="/mes-reservations"
              className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium"
            >
              Voir toutes mes réservations →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}


