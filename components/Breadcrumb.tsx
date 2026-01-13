'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Mapping des routes vers leurs labels en français
const routeLabels: Record<string, string> = {
  '/': 'Accueil',
  '/a-propos': 'À propos',
  '/soins-massages': 'Soins & Massages',
  '/tarifs': 'Tarifs',
  '/galerie': 'Galerie',
  '/blog': 'Blog',
  '/temoignages': 'Témoignages',
  '/contact': 'Contact',
  '/reserver': 'Réserver',
  '/mes-reservations': 'Mes réservations',
  '/notifications': 'Notifications',
};

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Ne pas afficher le breadcrumb sur la page d'accueil
  if (pathname === '/') {
    return null;
  }

  // Créer les items du breadcrumb
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', href: '/' },
  ];

  // Construire les chemins progressifs
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbItems.push({
      label,
      href: currentPath,
    });
  });

  return (
    <nav
      className="bg-white border-b border-gray-100 py-4 mt-24"
      aria-label="Fil d'Ariane"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.ol
          className="flex items-center space-x-2 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            
            return (
              <li key={item.href} className="flex items-center">
                {index === 0 ? (
                  <Link
                    href={item.href}
                    className="flex items-center text-gray-500 hover:text-rose-600 transition-colors"
                    aria-label="Accueil"
                  >
                    <Home size={16} className="mr-1" />
                  </Link>
                ) : (
                  <>
                    <ChevronRight size={16} className="text-gray-300 mx-2" />
                    {isLast ? (
                      <span className="text-gray-900 font-medium" aria-current="page">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-gray-500 hover:text-rose-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </motion.ol>
      </div>
    </nav>
  );
}

