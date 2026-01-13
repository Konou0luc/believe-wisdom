'use client';

import { useEffect, useState } from 'react';
import { servicesApi, Service, Category } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

  const getCategoryName = (categorie: string | Category): string => {
    if (typeof categorie === 'string') {
      return categorie;
    }
    return categorie?.nom || '';
  };

  const getCategoryId = (categorie: string | Category): string => {
    if (typeof categorie === 'string') {
      return categorie;
    }
    return categorie?._id || categorie?.nom || '';
  };

  const categoryNames = Array.from(new Set(services.map(s => getCategoryName(s.categorie)))).filter(Boolean);
  const categories = ['all', ...categoryNames];
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => getCategoryName(s.categorie) === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section avec image visuelle */}
      <section className="relative py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-rose-50/30 via-white to-white">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-rose-100/20 via-transparent to-beige-100/20" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
            Soins & Massages
          </p>
            <h1 className="text-4xl lg:text-6xl font-normal text-gray-900 mb-6">
            Nos prestations
          </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Nous vous proposons une gamme complète de soins personnalisés pour le visage et le corps,
            ainsi que des massages bien-être adaptés à vos besoins.
          </p>
        </motion.div>

          {/* Grille d'images des catégories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85', title: 'Soins Visage', desc: 'Hydratation et éclat' },
              { image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=85', title: 'Soins Corps', desc: 'Gommage et raffermissement' },
              { image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=85', title: 'Massages', desc: 'Détente et bien-être' }
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl font-normal text-white mb-1">{cat.title}</h2>
                    <p className="text-sm text-white/90 font-light">{cat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                      ? 'bg-rose-500 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
            </motion.div>
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
      </section>
    </div>
  );
}

