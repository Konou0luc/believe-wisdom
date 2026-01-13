'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import { images } from '@/lib/images';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Sublimez Vos Mains chez BELIEVE & WISDOM',
    excerpt: 'Découvrez nos services de manucure et pédicure pour des mains et des pieds parfaitement soignés.',
    content: `Chez BELIEVE & WISDOM, nous croyons que vos mains méritent le meilleur soin. Nos services de manucure et pédicure sont conçus pour vous offrir une expérience de détente complète tout en prenant soin de votre beauté.

Nos professionnels qualifiés utilisent uniquement des produits de qualité supérieure pour garantir des résultats durables et une beauté naturelle. Que vous souhaitiez une manucure classique, une pose de vernis semi-permanent ou un soin complet des pieds, nous adaptons nos services à vos besoins.

Prenez rendez-vous dès aujourd'hui et offrez à vos mains et pieds le soin qu'ils méritent.`,
    date: '2024-08-09',
    author: 'BELIEVE & WISDOM',
    category: 'Onglerie',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85',
    readTime: '3 min'
  },
  {
    id: '2',
    title: 'Choisir le Massage Idéal pour Votre Bien-Être',
    excerpt: 'Guide complet pour choisir le type de massage qui correspond le mieux à vos besoins de relaxation et de bien-être.',
    content: `Le massage est bien plus qu'un simple moment de détente. C'est une thérapie complète qui peut soulager les tensions, améliorer la circulation sanguine et favoriser votre bien-être général.

Chez BELIEVE & WISDOM, nous proposons différents types de massages adaptés à vos besoins :

**Massage Relaxant** : Parfait pour évacuer le stress et retrouver votre sérénité. Ce massage doux et enveloppant vous transporte dans un état de détente profonde.

**Massage Thérapeutique** : Idéal pour soulager les douleurs musculaires et les tensions accumulées. Nos thérapeutes utilisent des techniques ciblées pour traiter les zones spécifiques.

**Massage aux Huiles Essentielles** : Une expérience sensorielle unique qui combine les bienfaits du massage avec les propriétés thérapeutiques des huiles essentielles naturelles.

Chaque massage est personnalisé selon vos préférences et vos besoins. N'hésitez pas à consulter nos experts pour choisir le massage qui vous convient le mieux.`,
    date: '2024-08-09',
    author: 'BELIEVE & WISDOM',
    category: 'Massage',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=85',
    readTime: '5 min'
  },
  {
    id: '3',
    title: 'Secrets pour une Peau Radieuse',
    excerpt: 'Découvrez nos conseils et astuces pour obtenir une peau éclatante et en bonne santé grâce à nos soins professionnels.',
    content: `Une peau radieuse est le reflet d'un bon équilibre entre soins professionnels et routine quotidienne. Chez BELIEVE & WISDOM, nous partageons avec vous nos secrets pour une peau éclatante.

**Nettoyage en Profondeur** : Le secret d'une belle peau commence par un nettoyage efficace. Nos soins du visage incluent un nettoyage en profondeur qui élimine les impuretés et prépare votre peau aux soins suivants.

**Hydratation Intensive** : Une peau bien hydratée est une peau qui brille. Nos masques hydratants et nos soins nourrissants apportent à votre peau toute l'hydratation dont elle a besoin.

**Protection Solaire** : Protéger votre peau des rayons UV est essentiel pour préserver sa jeunesse et sa santé. Nous vous conseillons sur les meilleurs produits de protection adaptés à votre type de peau.

**Soins Personnalisés** : Chaque peau est unique. Nos esthéticiennes analysent votre type de peau et vous proposent des soins sur mesure pour répondre à vos besoins spécifiques.

Prenez rendez-vous pour une consultation personnalisée et découvrez le soin adapté à votre peau.`,
    date: '2024-08-09',
    author: 'BELIEVE & WISDOM',
    category: 'Esthétique',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85',
    readTime: '4 min'
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-rose-50/30 to-beige-50">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={images.wellness}
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
            unoptimized
          />
        </div>
        {/* Décorations comme sur la page d'accueil */}
        <div className="absolute top-32 right-20 w-[400px] h-[400px] bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 left-20 w-[500px] h-[500px] bg-beige-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
              Blog
            </p>
            <h1 className="text-4xl lg:text-6xl font-normal text-gray-900 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Conseils & Actualités
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Découvrez nos conseils beauté, nos astuces bien-être et nos actualités
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 group"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-beige-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-normal text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 font-light line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-rose-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lire la suite
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Prête à prendre soin de vous ?
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-light max-w-2xl mx-auto">
              Réservez votre rendez-vous et découvrez nos services de beauté et de bien-être
            </p>
            <Link href="/reserver">
              <Button size="lg" className="bg-rose-500 text-white hover:bg-rose-600">
                Réserver maintenant
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

