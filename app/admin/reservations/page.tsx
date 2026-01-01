'use client';

import { useState, useEffect, useMemo } from 'react';
import { reservationsApi, Reservation } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Check, X, Search, Filter, XCircle, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminReservationsPage() {
  const { showSuccess, showError } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'en_attente' | 'confirme' | 'annule'>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await reservationsApi.getAll();
      setReservations(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les réservations. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des réservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, statut: Reservation['statut']) => {
    try {
      await reservationsApi.updateStatus(id, statut);
      const statusMessages: Record<string, string> = {
        confirme: 'Réservation confirmée',
        annule: 'Réservation annulée',
        en_attente: 'Réservation mise en attente',
      };
      showSuccess(statut ? (statusMessages[statut] || 'Statut mis à jour') : 'Statut mis à jour');
      loadReservations();
    } catch (err: any) {
      const errorData = err?.response?.data;
      const errorDetails = errorData?.details;
      
      // Gérer les erreurs de validation détaillées
      if (errorDetails && Array.isArray(errorDetails)) {
        const validationErrors = errorDetails.map((detail: any) => {
          if (detail.path && detail.path.includes('statut')) {
            return 'Le statut fourni est invalide. Valeurs acceptées : en_attente, confirme, annule';
          }
          return detail.message || 'Erreur de validation';
        }).join('. ');
        
        showError(validationErrors || 'Erreurs de validation détectées');
      } else {
        const errorMessage = errorData?.message || 
                            err?.message || 
                            'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.';
        showError(errorMessage);
      }
      
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const getStatusBadge = (statut?: string) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirme: 'bg-green-100 text-green-800',
      confirmé: 'bg-green-100 text-green-800',
      annule: 'bg-red-100 text-red-800',
      annulé: 'bg-red-100 text-red-800',
    };
    return styles[statut as keyof typeof styles] || styles.en_attente;
  };

  const isStatusConfirmed = (statut?: string) => {
    return statut === 'confirme' || statut === 'confirmé';
  };

  const isStatusCancelled = (statut?: string) => {
    return statut === 'annule' || statut === 'annulé';
  };

  // Statistiques
  const stats = useMemo(() => {
    const enAttente = reservations.filter(r => !isStatusConfirmed(r.statut) && !isStatusCancelled(r.statut)).length;
    const confirme = reservations.filter(r => isStatusConfirmed(r.statut)).length;
    const annule = reservations.filter(r => isStatusCancelled(r.statut)).length;
    return { total: reservations.length, enAttente, confirme, annule };
  }, [reservations]);

  // Filtrer les réservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch = searchQuery === '' || 
        reservation.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.telephone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reservation.typeService && reservation.typeService.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'en_attente' && !isStatusConfirmed(reservation.statut) && !isStatusCancelled(reservation.statut)) ||
        (filterStatus === 'confirme' && isStatusConfirmed(reservation.statut)) ||
        (filterStatus === 'annule' && isStatusCancelled(reservation.statut));
      
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">Réservations</h1>
          <p className="text-sm text-gray-500">Gérez les réservations de vos clients</p>
        </div>
      </div>

      {/* Statistiques */}
      {!loading && !error && reservations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-medium text-gray-900">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">En attente</p>
            <p className="text-2xl font-medium text-yellow-600">{stats.enAttente}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Confirmées</p>
            <p className="text-2xl font-medium text-green-600">{stats.confirme}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Annulées</p>
            <p className="text-2xl font-medium text-red-600">{stats.annule}</p>
          </motion.div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      {!loading && !error && reservations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone ou service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              />
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'en_attente' | 'confirme' | 'annule')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="confirme">Confirmées</option>
                  <option value="annule">Annulées</option>
                </select>
              </div>
            </div>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors flex items-center space-x-2"
              >
                <XCircle size={16} />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
          {filteredReservations.length !== reservations.length && (
            <p className="text-sm text-gray-500 mt-3">
              {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''} trouvée{filteredReservations.length > 1 ? 's' : ''} sur {reservations.length}
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-rose-500" size={32} />
        </div>
      ) : error ? (
        <ErrorState
          title="Erreur de chargement"
          message={error}
          onRetry={loadReservations}
          retryLabel="Réessayer"
        />
      ) : filteredReservations.length === 0 ? (
        <EmptyState
          title={searchQuery || filterStatus !== 'all' ? "Aucune réservation trouvée" : "Aucune réservation"}
          description={searchQuery || filterStatus !== 'all'
            ? "Aucune réservation ne correspond à vos critères de recherche."
            : "Aucune réservation n'a été effectuée pour le moment."
          }
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-beige-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Service</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date & Heure</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-gray-900">{reservation.nom}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">{reservation.typeService}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-600">
                      {reservation.date && reservation.heure && (
                        <div>
                          <div>{new Date(reservation.date).toLocaleDateString('fr-FR')}</div>
                          <div className="text-sm">{reservation.heure}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-gray-600">{reservation.email}</div>
                      <div className="text-sm text-gray-600">{reservation.telephone}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(reservation.statut)}`}>
                        {reservation.statut || 'en_attente'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-2">
                      {!isStatusConfirmed(reservation.statut) && !isStatusCancelled(reservation.statut) && (
                        <button
                          onClick={() => handleStatusChange(reservation._id!, 'confirme')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Confirmer"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {!isStatusConfirmed(reservation.statut) && !isStatusCancelled(reservation.statut) && (
                        <button
                          onClick={() => handleStatusChange(reservation._id!, 'annule')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Annuler"
                        >
                          <X size={18} />
                        </button>
                      )}
                      {isStatusConfirmed(reservation.statut) && (
                        <span className="text-xs text-gray-500 italic">Confirmée</span>
                      )}
                      {isStatusCancelled(reservation.statut) && (
                        <span className="text-xs text-gray-500 italic">Annulée</span>
                      )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

