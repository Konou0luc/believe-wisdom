'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/lib/images';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-rose-50/30 to-beige-50 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
              À propos
            </p>
            <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
              BELIEVE & WISDOM
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
              Votre institut de beauté et de bien-être dédié à la détente, à la beauté et à l&apos;équilibre intérieur.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-normal text-gray-900 mb-6">Notre Mission</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Bienvenue chez <strong className="text-gray-900">BELIEVE & WISDOM</strong>, votre institut de beauté et de bien-être.
                  Nous vous proposons un espace apaisant dédié à la détente, à la beauté et à l&apos;équilibre intérieur.
                </p>
                <p className="text-lg">
                  Nos soins du visage, du corps et nos massages sont conçus pour vous offrir un moment unique,
                  alliant expertise, douceur et écoute.
                </p>
                <p className="text-lg">
                  Chez <strong className="text-gray-900">BELIEVE & WISDOM</strong>, chaque client est accueilli avec bienveillance,
                  dans une ambiance zen et chaleureuse. Notre mission : révéler votre beauté naturelle,
                  apaiser votre esprit, et vous reconnecter à vous-même.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src={images.spa}
                alt="BELIEVE & WISDOM - Espace de bien-être"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Bienveillance',
                description: 'Chaque client est accueilli avec attention et respect, dans un environnement chaleureux et apaisant.',
              },
              {
                icon: Award,
                title: 'Expertise',
                description: 'Des soins professionnels réalisés avec douceur et savoir-faire, pour votre bien-être et votre beauté.',
              },
              {
                icon: Users,
                title: 'Écoute',
                description: 'Nous prenons le temps de comprendre vos besoins pour vous proposer des soins personnalisés.',
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-center p-8 bg-beige-50 rounded-2xl"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500 text-white mb-6 shadow-sm">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-normal text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

