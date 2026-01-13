'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';

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

const formatContent = (content: string) => {
  // Convertir les **texte** en <strong>
  return content.split('\n\n').map((paragraph, idx) => {
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      const text = paragraph.slice(2, -2);
      return (
        <h3 key={idx} className="text-xl font-medium text-gray-900 mt-6 mb-3">
          {text}
        </h3>
      );
    }
    const formatted = paragraph.split('**').map((part, partIdx) => {
      if (partIdx % 2 === 1) {
        return <strong key={partIdx} className="text-gray-900 font-medium">{part}</strong>;
      }
      return part;
    });
    return (
      <p key={idx} className="text-gray-700 leading-relaxed mb-4 font-light">
        {formatted}
      </p>
    );
  });
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-normal text-gray-900 mb-4">Article non trouvé</h1>
          <Link href="/blog">
            <Button variant="outline">Retour au blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-rose-50/50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog">
              <Button variant="outline" size="sm" className="mb-8">
                <ArrowLeft size={16} className="mr-2" />
                Retour au blog
              </Button>
            </Link>

            <div className="mb-6">
              <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-normal text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime} de lecture</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-beige-100"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 pb-16 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <div className="text-lg text-gray-700 leading-relaxed font-light">
            {formatContent(post.content)}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-8 bg-gradient-to-br from-rose-50 to-beige-50 rounded-2xl border border-rose-100 text-center"
        >
          <h3 className="text-2xl font-normal text-gray-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Prête à prendre soin de vous ?
          </h3>
          <p className="text-gray-600 mb-6 font-light">
            Réservez votre rendez-vous et découvrez nos services
          </p>
          <Link href="/reserver">
            <Button size="lg" className="bg-rose-500 text-white hover:bg-rose-600">
              Réserver maintenant
            </Button>
          </Link>
        </motion.div>
      </article>
    </div>
  );
}

