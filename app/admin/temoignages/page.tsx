'use client';

import { useState, useEffect, useMemo } from 'react';
import { temoignagesApi, Temoignage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Check, Trash2, Star, Search, Filter, XCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminTemoignagesPage() {
  const { showSuccess, showError } = useToast();
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approuve' | 'en_attente'>('all');
  const [filterNote, setFilterNote] = useState<number | 'all'>('all');

  useEffect(() => {
    loadTemoignages();
  }, []);

  const loadTemoignages = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await temoignagesApi.getAllAdmin();
      setTemoignages(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les témoignages. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des témoignages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, approuve: boolean) => {
    try {
      await temoignagesApi.moderate(id, approuve);
      showSuccess(approuve ? 'Témoignage approuvé' : 'Témoignage rejeté');
      loadTemoignages();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Une erreur est survenue lors de la modération. Veuillez réessayer.';
      showError(errorMessage);
      console.error('Erreur lors de la modération:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    try {
      await temoignagesApi.delete(id);
      showSuccess('Témoignage supprimé avec succès');
      loadTemoignages();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Une erreur est survenue lors de la suppression. Veuillez réessayer.';
      showError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const approuves = temoignages.filter(t => t.approuve).length;
    const enAttente = temoignages.filter(t => !t.approuve).length;
    const moyenneNote = temoignages.length > 0
      ? temoignages.reduce((sum, t) => sum + (t.note || 0), 0) / temoignages.length
      : 0;
    
    return { total: temoignages.length, approuves, enAttente, moyenneNote: Math.round(moyenneNote * 10) / 10 };
  }, [temoignages]);

  // Filtrer les témoignages
  const filteredTemoignages = useMemo(() => {
    return temoignages.filter((temoignage) => {
      const matchesSearch = searchQuery === '' || 
        temoignage.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temoignage.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temoignage.commentaire.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'approuve' && temoignage.approuve) ||
        (filterStatus === 'en_attente' && !temoignage.approuve);
      
      const matchesNote = filterNote === 'all' || temoignage.note === filterNote;
      
      return matchesSearch && matchesStatus && matchesNote;
    });
  }, [temoignages, searchQuery, filterStatus, filterNote]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">Témoignages</h1>
          <p className="text-sm text-gray-500">Gérez et modérez les témoignages de vos clients</p>
        </div>
      </div>

      {/* Statistiques */}
      {!loading && !error && temoignages.length > 0 && (
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
            <p className="text-sm text-gray-600 mb-1">Approuvés</p>
            <p className="text-2xl font-medium text-green-600">{stats.approuves}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">En attente</p>
            <p className="text-2xl font-medium text-yellow-600">{stats.enAttente}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400 fill-current" size={18} />
              <p className="text-2xl font-medium text-gray-900">{stats.moyenneNote.toFixed(1)}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      {!loading && !error && temoignages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou commentaire..."
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'approuve' | 'en_attente')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="approuve">Approuvés</option>
                  <option value="en_attente">En attente</option>
                </select>
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={filterNote}
                  onChange={(e) => setFilterNote(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white appearance-none"
                >
                  <option value="all">Toutes les notes</option>
                  <option value="5">5 étoiles</option>
                  <option value="4">4 étoiles</option>
                  <option value="3">3 étoiles</option>
                  <option value="2">2 étoiles</option>
                  <option value="1">1 étoile</option>
                </select>
              </div>
            </div>
            {(searchQuery || filterStatus !== 'all' || filterNote !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterNote('all');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors flex items-center space-x-2"
              >
                <XCircle size={16} />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
          {filteredTemoignages.length !== temoignages.length && (
            <p className="text-sm text-gray-500 mt-3">
              {filteredTemoignages.length} témoignage{filteredTemoignages.length > 1 ? 's' : ''} trouvé{filteredTemoignages.length > 1 ? 's' : ''} sur {temoignages.length}
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
          onRetry={loadTemoignages}
          retryLabel="Réessayer"
        />
      ) : filteredTemoignages.length === 0 ? (
        <EmptyState
          title={searchQuery || filterStatus !== 'all' || filterNote !== 'all' ? "Aucun témoignage trouvé" : "Aucun témoignage"}
          description={searchQuery || filterStatus !== 'all' || filterNote !== 'all' 
            ? "Aucun témoignage ne correspond à vos critères de recherche."
            : "Aucun témoignage n'a été soumis pour le moment."
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredTemoignages.map((temoignage, index) => (
            <motion.div
              key={temoignage._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-sm p-6 border ${
                !temoignage.approuve ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{temoignage.nom}</h3>
                    <span className="text-sm text-gray-500">({temoignage.email})</span>
                    {temoignage.approuve && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Approuvé
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= temoignage.note ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({temoignage.note}/5)</span>
                  </div>
                  <p className="text-gray-700 italic mb-2">&quot;{temoignage.commentaire}&quot;</p>
                  {temoignage.createdAt && (
                    <p className="text-sm text-gray-500">{formatDate(temoignage.createdAt)}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!temoignage.approuve && (
                    <button
                      onClick={() => handleModerate(temoignage._id!, true)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approuver"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(temoignage._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {!temoignage.approuve && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm text-yellow-800">
                  En attente de modération
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
