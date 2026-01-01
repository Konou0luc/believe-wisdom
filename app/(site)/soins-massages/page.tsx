'use client';

import { useEffect, useState } from 'react';
import { servicesApi, Service } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
                          'Impossible de charger les services. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(services.map(s => s.categorie)))];
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.categorie === selectedCategory);

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
            Soins & Massages
          </p>
          <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Nos prestations
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Nous vous proposons une gamme complète de soins personnalisés pour le visage et le corps,
            ainsi que des massages bien-être adaptés à vos besoins.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
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
            onRetry={loadServices}
            retryLabel="Réessayer"
          />
        ) : filteredServices.length === 0 ? (
          <EmptyState
            title="Aucun service disponible"
            description={
              selectedCategory === 'all'
                ? "Aucun service n'est disponible pour le moment. Veuillez réessayer plus tard."
                : `Aucun service disponible dans la catégorie "${selectedCategory}".`
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 bg-gradient-to-br from-rose-50 to-beige-50 rounded-3xl p-8 lg:p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-normal text-gray-900 mb-6">
              Chaque soin est réalisé avec douceur et professionnalisme
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Dans une ambiance zen et apaisante, nos professionnels vous accompagnent pour une expérience
              unique de détente et de bien-être.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

