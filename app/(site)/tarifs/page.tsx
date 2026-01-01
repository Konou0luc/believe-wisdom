'use client';

import { useEffect, useState } from 'react';
import { servicesApi, Service } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TarifsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await servicesApi.getAll();
      setServices(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les tarifs. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.categorie]) {
      acc[service.categorie] = [];
    }
    acc[service.categorie].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const fallbackData = {
    'Soins visage': [
      { titre: 'Nettoyage profond', prix: 10000 },
      { titre: 'Soin hydratant', prix: 12000 },
      { titre: 'Soin anti-âge', prix: 15000 },
    ],
    'Soins du corps': [
      { titre: 'Gommage corporel', prix: 8000 },
      { titre: 'Enveloppement raffermissant', prix: 12000 },
      { titre: 'Soin complet corps', prix: 18000 },
    ],
    'Massages bien-être': [
      { titre: 'Massage relaxant 30 min', prix: 10000 },
      { titre: 'Massage relaxant 1h', prix: 18000 },
      { titre: 'Massage aux pierres chaudes', prix: 20000 },
      { titre: 'Réflexologie plantaire', prix: 12000 },
    ],
    'Beauté & esthétique': [
      { titre: 'Épilation (jambes complètes)', prix: 7000 },
      { titre: 'Manucure + vernis', prix: 5000 },
      { titre: 'Pédicure spa', prix: 8000 },
    ],
  };

  const displayData = Object.keys(groupedServices).length > 0 ? groupedServices : fallbackData;

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
            Nos Tarifs
          </p>
          <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Tarifs transparents
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Chez BELIEVE & WISDOM, nous vous offrons des prestations de qualité à des tarifs accessibles,
            pour prendre soin de vous en toute sérénité.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : error ? (
          <ErrorState
            title="Erreur de chargement"
            message={error}
            onRetry={loadServices}
            retryLabel="Réessayer"
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(displayData).map(([category, items], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-beige-50 rounded-2xl p-8 lg:p-10"
              >
                <h2 className="text-2xl lg:text-3xl font-normal text-rose-600 mb-8">{category}</h2>
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4 border-b border-rose-200/50 last:border-0"
                    >
                      <span className="text-lg text-gray-700">{item.titre}</span>
                      <span className="text-2xl font-normal text-rose-600">
                        {formatPrice(item.prix)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 italic font-light">
            Tarifs indicatifs. Des forfaits personnalisés peuvent être proposés selon vos besoins.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

