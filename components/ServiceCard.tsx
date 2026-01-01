'use client';

import { Service } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/lib/images';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

const getServiceImage = (categorie: string) => {
  const lowerCat = categorie.toLowerCase();
  if (lowerCat.includes('visage') || lowerCat.includes('face')) return images.facial;
  if (lowerCat.includes('corps') || lowerCat.includes('body')) return images.body;
  if (lowerCat.includes('massage') || lowerCat.includes('bien-être')) return images.massage;
  return images.spa;
};

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const serviceImage = getServiceImage(service.categorie);
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-rose-200 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={serviceImage}
          alt={service.titre}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-rose-600 rounded-lg text-xs font-medium uppercase tracking-wider shadow-sm">
            {service.categorie}
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-normal text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
            {service.titre}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-2xl font-normal text-rose-600">
            {formatPrice(service.prix)}
          </span>
          <Link
            href={`/reserver?service=${service._id}`}
            className="group/link inline-flex items-center space-x-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>Réserver</span>
            <ArrowRight 
              size={14} 
              className="transition-transform duration-200 group-hover/link:translate-x-1" 
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
