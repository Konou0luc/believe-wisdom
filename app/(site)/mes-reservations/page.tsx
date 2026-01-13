'use client';

import { useState, useEffect } from 'react';
import { reservationsApi, servicesApi, Reservation, Service } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { Loader2, Calendar, Clock, Mail, Phone, CheckCircle2, XCircle, AlertCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MesReservationsPage() {
  const { notifications, unreadCount } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    // Essayer de récupérer l'email depuis localStorage (si l'utilisateur a déjà fait une réservation)
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('reservation_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setEmailInput(savedEmail);
      }
    }
    // Charger les services pour pouvoir afficher les noms
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesApi.getAll();
      setServices(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des services:', err);
    }
  };

  const getServiceName = (typeService: string): string => {
    if (!typeService) return 'Service inconnu';
    
    // Vérifier si c'est un ID (format MongoDB ObjectId)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(typeService);
    
    if (isObjectId) {
      // Chercher le service par ID
      const service = services.find(s => s._id === typeService);
      return service ? service.titre : typeService;
    }
    
    // Si ce n'est pas un ID, vérifier si c'est déjà un nom de service
    const service = services.find(s => s.titre === typeService || s._id === typeService);
    return service ? service.titre : typeService;
  };

  useEffect(() => {
    if (email) {
      loadReservations();
      // Vérifier les changements de statut toutes les 30 secondes
      const interval = setInterval(loadReservations, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const loadReservations = async () => {
    if (!email) return;
    
    try {
      setError(null);
      setLoading(true);
      const response = await reservationsApi.getByEmail(email);
      const loadedReservations = response.data || [];
      
      // Mettre à jour les réservations (la détection des changements est gérée globalement par ReservationWatcher)
      setReservations(loadedReservations);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Aucune réservation trouvée pour cet email.');
      } else {
        const errorMessage = err?.response?.data?.message || 
                            err?.message || 
                            'Impossible de charger les réservations. Vérifiez votre connexion internet.';
        setError(errorMessage);
      }
      console.error('Erreur lors du chargement des réservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmail(emailInput.trim());
      if (typeof window !== 'undefined') {
        localStorage.setItem('reservation_email', emailInput.trim());
      }
    }
  };

  const getStatusBadge = (statut?: string) => {
    // Normaliser le statut (gérer avec et sans accents)
    const normalizedStatut = statut?.toLowerCase();
    
    if (normalizedStatut === 'confirme' || normalizedStatut === 'confirmé') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="mr-1" size={14} />
          Confirmée
        </span>
      );
    }
    if (normalizedStatut === 'annule' || normalizedStatut === 'annulé') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="mr-1" size={14} />
          Annulée
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-beige-200 text-beige-800">
        <AlertCircle className="mr-1" size={14} />
        En attente
      </span>
    );
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-4">
            Mes réservations
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Suivez l&apos;état de vos réservations
          </p>
        </motion.div>

        {/* Lien vers les notifications */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link
              href="/notifications"
              className="inline-flex items-center px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Bell className="mr-2" size={18} />
              <span className="font-medium">
                {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            </Link>
          </motion.div>
        )}

        {/* Formulaire de recherche par email */}
        {!email && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-rose-50 to-beige-50 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-xl font-normal text-gray-900 mb-4">
              Entrez votre email
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Utilisez l&apos;adresse email que vous avez utilisée pour faire votre réservation.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex gap-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="votre@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
              >
                Rechercher
              </button>
            </form>
          </motion.div>
        )}

        {/* Bouton pour changer d'email */}
        {email && (
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Réservations pour : <span className="font-medium text-gray-900">{email}</span>
            </p>
            <button
              onClick={() => {
                setEmail('');
                setEmailInput('');
                setReservations([]);
              }}
              className="text-sm text-rose-600 hover:text-rose-700"
            >
              Changer d&apos;email
            </button>
          </div>
        )}

        {/* Liste des réservations */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : error ? (
          <ErrorState
            title="Erreur"
            message={error}
            onRetry={email ? loadReservations : undefined}
            retryLabel="Réessayer"
          />
        ) : reservations.length === 0 && email ? (
          <EmptyState
            title="Aucune réservation"
            description="Vous n&apos;avez pas encore de réservation avec cet email."
          />
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation, index) => (
              <motion.div
                key={reservation._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-normal text-gray-900 mb-1">
                          Réservation #{reservation._id?.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Service: {getServiceName(reservation.typeService)}
                        </p>
                      </div>
                      {getStatusBadge(reservation.statut)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2 text-rose-500" size={16} />
                        <span>{formatDateTime(reservation.date, reservation.heure)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="mr-2 text-rose-500" size={16} />
                        <span>{reservation.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="mr-2 text-rose-500" size={16} />
                        <span>{reservation.telephone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2 text-rose-500" size={16} />
                        <span>
                          {reservation.createdAt
                            ? new Date(reservation.createdAt).toLocaleDateString('fr-FR')
                            : 'Date inconnue'}
                        </span>
                      </div>
                    </div>

                    {reservation.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Message :</span> {reservation.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

