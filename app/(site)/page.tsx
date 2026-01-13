'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Star, Heart, Sparkles, Check } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/lib/images';
import { useState, useRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function Home() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-rose-50/30 to-beige-50">
        <div className="absolute top-32 right-20 w-[400px] h-[400px] bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 left-20 w-[500px] h-[500px] bg-beige-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 w-full z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-rose-200/50 rounded-full shadow-sm"
              >
                <Award className="text-rose-500" size={14} />
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Institut Certifié
                </span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-normal text-gray-900 leading-[1.1] tracking-tight">
                Votre beauté,
                <br />
                <span className="text-rose-500">
                  notre passion
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl font-light">
                Découvrez un espace de bien-être où chaque soin est une expérience unique, 
                alliant expertise professionnelle et douceur apaisante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/reserver">
                  <Button size="lg" className="group">
                    Réserver maintenant
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </Button>
                </Link>
                <Link href="/soins-massages">
                  <Button variant="outline" size="lg">
                    Découvrir nos soins
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 border-2 border-white shadow-sm"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">500+ clients</p>
                    <p className="text-xs text-gray-500">satisfaits</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-rose-500">
                  <Star className="fill-current" size={18} />
                  <span className="text-base font-medium">4.9/5</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="relative h-[500px] lg:h-[600px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl"
              >
                <Image
                  src={images.hero}
                  alt="BELIEVE & WISDOM"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 max-w-[240px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ouvert aujourd&apos;hui</p>
                    <p className="text-xs text-gray-500">9h - 19h</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section - Show services directly */}
      <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
              Nos Services en Images
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto font-light">
              Découvrez visuellement ce que nous proposons
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                image: images.facial,
                title: 'Soins Visage',
                description: 'Traitements personnalisés pour votre visage'
              },
              {
                image: images.body,
                title: 'Soins Corps',
                description: 'Gommages et enveloppements raffinés'
              },
              {
                image: images.massage,
                title: 'Massages',
                description: 'Détente et bien-être garantis'
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-normal text-white mb-1">{service.title}</h3>
                    <p className="text-sm text-white/90 font-light">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-rose-50/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 lg:mb-20"
          >
            <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
              Nos Services
            </p>
            <h2 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              Une expérience sur mesure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Chaque soin est pensé pour révéler votre beauté naturelle
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: Heart,
                title: 'Soins Visage',
                description: 'Hydratants, anti-âge, éclat du teint. Chaque soin est réalisé avec douceur et professionnalisme.',
                image: images.facial,
                features: ['Nettoyage profond', 'Anti-âge', 'Éclat du teint']
              },
              {
                icon: Sparkles,
                title: 'Soins Corps',
                description: 'Gommage, enveloppement, raffermissement. Prenez soin de votre corps dans une ambiance zen.',
                image: images.body,
                features: ['Gommage', 'Enveloppement', 'Raffermissement']
              },
              {
                icon: Star,
                title: 'Massages Bien-être',
                description: 'Relaxants, aux huiles essentielles, aux pierres chaudes, réflexologie. Détente garantie.',
                image: images.massage,
                features: ['Relaxant', 'Pierres chaudes', 'Réflexologie']
              }
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute top-5 right-5">
                      <div className="w-12 h-12 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <Icon className="text-rose-500" size={22} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-normal text-white">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Check className="text-rose-500 flex-shrink-0" size={14} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link 
                      href="/soins-massages" 
                      className="inline-flex items-center text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors group/link"
                    >
                      <span>Découvrir</span>
                      <ArrowRight className="ml-1.5 group-hover/link:translate-x-1 transition-transform" size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-beige-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Heart, value: '500+', label: 'Clients satisfaits', color: 'bg-rose-400' },
              { icon: Award, value: '10+', label: 'Années d\'expérience', color: 'bg-rose-500' },
              { icon: Star, value: '4.9/5', label: 'Note moyenne', color: 'bg-rose-600' },
              { icon: Heart, value: '100%', label: 'Satisfaction', color: 'bg-rose-500' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-6 lg:p-8 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-xl ${stat.color} text-white mb-5 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-4xl lg:text-5xl font-normal text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          {/* Image de fallback par défaut */}
          <Image
            src={images.spa}
            alt="Background"
            fill
            className="absolute inset-0 object-cover"
            sizes="100vw"
            priority
          />
          {/* Video Background - se superpose à l'image si elle charge */}
          {!videoError && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => {
                setVideoError(true);
              }}
              onLoadedData={() => {
                // Vidéo chargée avec succès
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {
                    setVideoError(true);
                  });
                }
              }}
            >
              {/* Vidéo locale - Placez votre vidéo dans /public/videos/spa-background.mp4 */}
              <source src="/videos/spa-background.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/40 via-rose-500/40 to-rose-400/40" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center z-10"
        >
          <h2 className="text-4xl lg:text-6xl font-normal text-white mb-6 leading-tight">
            Prête à vivre
            <br />
            l&apos;expérience ?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Réservez votre rendez-vous et offrez-vous un moment de détente et de bien-être
          </p>
          <Link href="/reserver">
            <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-50 shadow-xl">
              Réserver maintenant
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
