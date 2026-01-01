'use client';

import { useEffect, useState } from 'react';
import { servicesApi, reservationsApi, temoignagesApi, contactApi, Service, Reservation, Temoignage, Contact } from '@/lib/api';
import { Package, Calendar, MessageSquare, Mail, TrendingUp, Clock, CheckCircle, XCircle, Star, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
  services: {
    total: number;
    data: Service[];
  };
  reservations: {
    total: number;
    enAttente: number;
    confirme: number;
    annule: number;
    recentes: Reservation[];
  };
  temoignages: {
    total: number;
    approuves: number;
    enAttente: number;
    moyenneNote: number;
    recents: Temoignage[];
  };
  contacts: {
    total: number;
    nonLus: number;
    recents: Contact[];
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    services: { total: 0, data: [] },
    reservations: { total: 0, enAttente: 0, confirme: 0, annule: 0, recentes: [] },
    temoignages: { total: 0, approuves: 0, enAttente: 0, moyenneNote: 0, recents: [] },
    contacts: { total: 0, nonLus: 0, recents: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [servicesRes, reservationsRes, temoignagesRes, contactsRes] = await Promise.all([
        servicesApi.getAll().catch((err) => {
          console.warn('Erreur chargement services:', err?.response?.status || err?.message);
          return { data: [] };
        }),
        reservationsApi.getAll().catch((err) => {
          console.warn('Erreur chargement réservations:', err?.response?.status || err?.message);
          return { data: [] };
        }),
        temoignagesApi.getAllAdmin().catch((err) => {
          console.warn('Erreur chargement témoignages:', err?.response?.status || err?.message);
          return { data: [] };
        }),
        contactApi.getAll().catch((err) => {
          console.warn('Erreur chargement contacts:', err?.response?.status || err?.message);
          return { data: [] };
        }),
      ]);

      const services = servicesRes?.data || [];
      const reservations = reservationsRes?.data || [];
      const temoignages = temoignagesRes?.data || [];
      const contacts = contactsRes?.data || [];

      // Calculer les statistiques des réservations
      const reservationsEnAttente = reservations.filter((r: Reservation) => r.statut === 'en_attente' || !r.statut);
      const reservationsConfirme = reservations.filter((r: Reservation) => r.statut === 'confirme');
      const reservationsAnnule = reservations.filter((r: Reservation) => r.statut === 'annule');
      const recentesReservations = reservations
        .sort((a: Reservation, b: Reservation) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);

      // Calculer les statistiques des témoignages
      const temoignagesApprouves = temoignages.filter((t: Temoignage) => t.approuve);
      const temoignagesEnAttente = temoignages.filter((t: Temoignage) => !t.approuve);
      const moyenneNote = temoignages.length > 0
        ? temoignages.reduce((sum: number, t: Temoignage) => sum + (t.note || 0), 0) / temoignages.length
        : 0;
      const recentsTemoignages = temoignages
        .sort((a: Temoignage, b: Temoignage) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);

      // Calculer les statistiques des contacts
      const contactsNonLus = contacts.filter((c: Contact) => !c.lu);
      const recentsContacts = contacts
        .sort((a: Contact, b: Contact) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5);

      setStats({
        services: {
          total: services.length,
          data: services,
        },
        reservations: {
          total: reservations.length,
          enAttente: reservationsEnAttente.length,
          confirme: reservationsConfirme.length,
          annule: reservationsAnnule.length,
          recentes: recentesReservations,
        },
        temoignages: {
          total: temoignages.length,
          approuves: temoignagesApprouves.length,
          enAttente: temoignagesEnAttente.length,
          moyenneNote: Math.round(moyenneNote * 10) / 10,
          recents: recentsTemoignages,
        },
        contacts: {
          total: contacts.length,
          nonLus: contactsNonLus.length,
          recents: recentsContacts,
        },
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Services', 
      value: stats.services.total, 
      icon: Package, 
      color: 'bg-rose-500',
      link: '/admin/services'
    },
    { 
      label: 'Réservations', 
      value: stats.reservations.total, 
      icon: Calendar, 
      color: 'bg-blue-500',
      link: '/admin/reservations',
      badge: stats.reservations.enAttente > 0 ? stats.reservations.enAttente : undefined,
      badgeColor: 'bg-yellow-500'
    },
    { 
      label: 'Témoignages', 
      value: stats.temoignages.total, 
      icon: MessageSquare, 
      color: 'bg-green-500',
      link: '/admin/temoignages',
      badge: stats.temoignages.enAttente > 0 ? stats.temoignages.enAttente : undefined,
      badgeColor: 'bg-yellow-500'
    },
    { 
      label: 'Messages', 
      value: stats.contacts.total, 
      icon: Mail, 
      color: 'bg-purple-500',
      link: '/admin/contacts',
      badge: stats.contacts.nonLus > 0 ? stats.contacts.nonLus : undefined,
      badgeColor: 'bg-red-500'
    },
  ];

  const getStatusBadge = (statut?: string) => {
    switch (statut) {
      case 'confirme':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Confirmé</span>;
      case 'annule':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Annulé</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">En attente</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-rose-500" size={32} />
        </div>
      ) : (
        <>
          {/* Cartes de statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-xl text-white`}>
                        <Icon size={24} />
                      </div>
                      {stat.badge && (
                        <span className={`${stat.badgeColor} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                          {stat.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-normal text-gray-900">{stat.value}</p>
                    </div>
                    <div className="mt-4 flex items-center text-rose-600 text-sm group-hover:text-rose-700">
                      <span>Voir tout</span>
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Réservations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Réservations</h2>
                <Link href="/admin/reservations" className="text-rose-600 text-sm hover:text-rose-700 flex items-center">
                  Voir tout <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-500" size={18} />
                    <span className="text-sm text-gray-600">En attente</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.reservations.enAttente}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.reservations.total > 0 ? (stats.reservations.enAttente / stats.reservations.total) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={18} />
                    <span className="text-sm text-gray-600">Confirmées</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.reservations.confirme}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.reservations.total > 0 ? (stats.reservations.confirme / stats.reservations.total) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="text-red-500" size={18} />
                    <span className="text-sm text-gray-600">Annulées</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.reservations.annule}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.reservations.total > 0 ? (stats.reservations.annule / stats.reservations.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Témoignages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Témoignages</h2>
                <Link href="/admin/temoignages" className="text-rose-600 text-sm hover:text-rose-700 flex items-center">
                  Voir tout <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={18} />
                    <span className="text-sm text-gray-600">Approuvés</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.temoignages.approuves}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.temoignages.total > 0 ? (stats.temoignages.approuves / stats.temoignages.total) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-500" size={18} />
                    <span className="text-sm text-gray-600">En attente</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.temoignages.enAttente}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.temoignages.total > 0 ? (stats.temoignages.enAttente / stats.temoignages.total) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400 fill-current" size={18} />
                    <span className="text-sm text-gray-600">Note moyenne</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{stats.temoignages.moyenneNote.toFixed(1)} / 5</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Listes récentes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dernières réservations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Dernières réservations</h2>
                <Link href="/admin/reservations" className="text-rose-600 text-sm hover:text-rose-700">
                  Voir tout
                </Link>
              </div>
              {stats.reservations.recentes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucune réservation récente</p>
              ) : (
                <div className="space-y-3">
                  {stats.reservations.recentes.map((reservation) => (
                    <div key={reservation._id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{reservation.nom}</p>
                        <p className="text-xs text-gray-500 mt-1">{reservation.date} à {reservation.heure}</p>
                        {reservation.createdAt && (
                          <p className="text-xs text-gray-400 mt-1">{formatDate(reservation.createdAt)}</p>
                        )}
                      </div>
                      <div className="ml-2">
                        {getStatusBadge(reservation.statut)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Derniers témoignages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Derniers témoignages</h2>
                <Link href="/admin/temoignages" className="text-rose-600 text-sm hover:text-rose-700">
                  Voir tout
                </Link>
              </div>
              {stats.temoignages.recents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucun témoignage récent</p>
              ) : (
                <div className="space-y-3">
                  {stats.temoignages.recents.map((temoignage) => (
                    <div key={temoignage._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{temoignage.nom}</p>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= (temoignage.note || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">"{temoignage.commentaire}"</p>
                      <div className="flex items-center justify-between">
                        {temoignage.createdAt && (
                          <p className="text-xs text-gray-400">{formatDate(temoignage.createdAt)}</p>
                        )}
                        {!temoignage.approuve && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            En attente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Derniers messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Derniers messages</h2>
                <Link href="/admin/contacts" className="text-rose-600 text-sm hover:text-rose-700">
                  Voir tout
                </Link>
              </div>
              {stats.contacts.recents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucun message récent</p>
              ) : (
                <div className="space-y-3">
                  {stats.contacts.recents.map((contact) => (
                    <div key={contact._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.nom}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{contact.email}</p>
                        </div>
                        {!contact.lu && (
                          <span className="ml-2 w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 font-medium mb-1">{contact.sujet}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">{contact.message}</p>
                      {contact.createdAt && (
                        <p className="text-xs text-gray-400">{formatDate(contact.createdAt)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
