'use client';

import { useEffect, useRef } from 'react';
import { reservationsApi, Reservation } from '@/lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDateTime } from '@/lib/utils';

export function useReservationWatcher() {
  const { addNotification } = useNotifications();
  const lastReservationsRef = useRef<Reservation[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Récupérer l'email depuis localStorage
    const email = typeof window !== 'undefined' 
      ? localStorage.getItem('reservation_email') 
      : null;

    if (!email) {
      return;
    }

    // Fonction pour charger et comparer les réservations
    const checkReservations = async () => {
      try {
        const response = await reservationsApi.getByEmail(email);
        const currentReservations = response.data || [];

        // Si on a des réservations précédentes, comparer pour détecter les changements
        if (lastReservationsRef.current.length > 0) {
          currentReservations.forEach((newReservation) => {
            const oldReservation = lastReservationsRef.current.find(
              (r) => r._id === newReservation._id
            );

            // Détecter uniquement les changements de statut (pas les nouvelles réservations)
            if (oldReservation && oldReservation.statut !== newReservation.statut) {
              // Normaliser le statut pour gérer avec et sans accents
              const normalizedStatut = (newReservation.statut || 'en_attente').toLowerCase();
              const statusKey = normalizedStatut === 'confirmé' ? 'confirme' : 
                               normalizedStatut === 'annulé' ? 'annule' : 
                               normalizedStatut;
              
              const statusMessages: Record<string, { title: string; message: string }> = {
                confirme: {
                  title: 'Réservation confirmée',
                  message: `Votre réservation du ${formatDateTime(newReservation.date, newReservation.heure)} a été confirmée.`,
                },
                annule: {
                  title: 'Réservation annulée',
                  message: `Votre réservation du ${formatDateTime(newReservation.date, newReservation.heure)} a été annulée.`,
                },
                en_attente: {
                  title: 'Réservation en attente',
                  message: `Votre réservation du ${formatDateTime(newReservation.date, newReservation.heure)} est en attente de confirmation.`,
                },
              };

              const statusInfo = statusMessages[statusKey] || statusMessages['en_attente'];
              if (statusInfo) {
                // La vérification des doublons est maintenant gérée dans addNotification
                addNotification({
                  reservationId: newReservation._id || '',
                  type: 'status_change',
                  title: statusInfo.title,
                  message: statusInfo.message,
                  reservation: newReservation,
                });
              }
            }
          });
        }

        // Mettre à jour la référence avec les réservations actuelles
        lastReservationsRef.current = currentReservations;
      } catch (err) {
        // Ignorer les erreurs silencieusement pour ne pas perturber l'utilisateur
        console.debug('Erreur lors de la vérification des réservations:', err);
      }
    };

    // Charger une première fois immédiatement
    checkReservations();

    // Vérifier toutes les 30 secondes
    intervalRef.current = setInterval(checkReservations, 30000);

    // Nettoyer l'intervalle au démontage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [addNotification]);
}

