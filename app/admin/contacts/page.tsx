'use client';

import { useState, useEffect, useMemo } from 'react';
import { contactApi, Contact } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Trash2, Check, Loader2, Search, Filter, XCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminContactsPage() {
  const { showSuccess, showError } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'lu' | 'non_lu'>('all');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await contactApi.getAll();
      setContacts(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les messages. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactApi.markAsRead(id);
      showSuccess('Message marqué comme lu');
      loadContacts();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.';
      showError(errorMessage);
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      await contactApi.delete(id);
      showSuccess('Message supprimé avec succès');
      loadContacts();
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
    const nonLus = contacts.filter(c => !c.lu).length;
    const lus = contacts.filter(c => c.lu).length;
    return { total: contacts.length, nonLus, lus };
  }, [contacts]);

  // Filtrer les contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = searchQuery === '' || 
        contact.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.sujet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'lu' && contact.lu) ||
        (filterStatus === 'non_lu' && !contact.lu);
      
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">Messages de contact</h1>
          <p className="text-sm text-gray-500">Gérez les messages reçus depuis le formulaire de contact</p>
        </div>
      </div>

      {/* Statistiques */}
      {!loading && !error && contacts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Non lus</p>
                <p className="text-2xl font-medium text-rose-600">{stats.nonLus}</p>
              </div>
              {stats.nonLus > 0 && (
                <Bell className="text-rose-500" size={24} />
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-1">Lus</p>
            <p className="text-2xl font-medium text-green-600">{stats.lus}</p>
          </motion.div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      {!loading && !error && contacts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, email, sujet ou message..."
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'lu' | 'non_lu')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white appearance-none"
                >
                  <option value="all">Tous les messages</option>
                  <option value="non_lu">Non lus</option>
                  <option value="lu">Lus</option>
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
          {filteredContacts.length !== contacts.length && (
            <p className="text-sm text-gray-500 mt-3">
              {filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''} trouvé{filteredContacts.length > 1 ? 's' : ''} sur {contacts.length}
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
          onRetry={loadContacts}
          retryLabel="Réessayer"
        />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          icon={<Mail className="text-gray-300" size={64} />}
          title={searchQuery || filterStatus !== 'all' ? "Aucun message trouvé" : "Aucun message"}
          description={searchQuery || filterStatus !== 'all'
            ? "Aucun message ne correspond à vos critères de recherche."
            : "Aucun message de contact n'a été reçu pour le moment."
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-sm border p-6 ${
                !contact.lu ? 'border-rose-200 bg-rose-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{contact.nom}</h3>
                    {!contact.lu && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full font-medium">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span>{contact.email}</span>
                    </p>
                    {contact.telephone && (
                      <p className="flex items-center space-x-2">
                        <span>📞</span>
                        <span>{contact.telephone}</span>
                      </p>
                    )}
                    {contact.createdAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(contact.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!contact.lu && (
                    <button
                      onClick={() => handleMarkAsRead(contact._id!)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Sujet
                </p>
                <p className="text-gray-900 mb-4">{contact.sujet}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Message
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
