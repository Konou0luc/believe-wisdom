'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useNotifications } from '@/contexts/NotificationContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu principal simplifié : on garde seulement les entrées clés
  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/soins-massages', label: 'Soins & Massages' },
    { href: '/blog', label: 'Blog' },
    { href: '/reserver', label: 'Réserver' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-md border-b border-gray-200' 
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="w-full px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative w-14 h-14 flex-shrink-0"
            >
              <Image
                src="/believe.jpeg"
                alt="BELIEVE & WISDOM"
                width={56}
                height={56}
                className="object-cover rounded-full ring-1 ring-rose-200/50 group-hover:ring-rose-300/70 transition-all"
                priority
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-normal text-gray-900 tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                BELIEVE & WISDOM
              </h1>
              <p className="text-xs text-gray-500 font-normal mt-0.5 tracking-wider uppercase">
                La beauté en équilibre
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2.5 text-base font-normal transition-colors rounded-lg"
                >
                  <span className={isActive ? 'text-rose-500' : 'text-gray-600 hover:text-gray-900'}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <div className="ml-6 flex items-center gap-3 border-l border-gray-200 pl-6">
              <Link
                href="/mes-reservations"
                className="relative px-3 py-2.5 text-base font-normal transition-colors rounded-lg text-gray-600 hover:text-gray-900"
                title="Mes réservations"
              >
                <Calendar size={20} />
              </Link>
              <Link
                href="/notifications"
                className="relative px-3 py-2.5 text-base font-normal transition-colors rounded-lg text-gray-600 hover:text-gray-900"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
              </Link>
            </div>
          </nav>

          <button
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="flex flex-col space-y-1 py-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-lg transition-colors text-base ${
                        isActive
                          ? 'text-rose-500 bg-rose-50 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href="/mes-reservations"
                    className={`px-4 py-3 rounded-lg transition-colors text-base flex items-center gap-2 ${
                      pathname === '/mes-reservations'
                        ? 'text-rose-500 bg-rose-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={20} />
                    Mes réservations
                  </Link>
                  <Link
                    href="/notifications"
                    className={`px-4 py-3 rounded-lg transition-colors text-base flex items-center gap-2 ${
                      pathname === '/notifications'
                        ? 'text-rose-500 bg-rose-50 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell size={20} />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
