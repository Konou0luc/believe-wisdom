import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/believe.jpeg"
                  alt="BELIEVE & WISDOM"
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-base font-normal text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  BELIEVE & WISDOM
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  La beauté en équilibre
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Votre institut de beauté et de bien-être dédié à votre équilibre et à votre beauté naturelle.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-6 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/a-propos', label: 'À propos' },
                { href: '/soins-massages', label: 'Soins & Massages' },
                { href: '/tarifs', label: 'Tarifs' },
                { href: '/galerie', label: 'Galerie' },
                { href: '/temoignages', label: 'Témoignages' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-6 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Soins du visage</li>
              <li>Soins du corps</li>
              <li>Massages bien-être</li>
              <li>Esthétique</li>
              <li>
                <Link href="/reserver" className="text-rose-400 hover:text-rose-300 transition-colors">
                  Réserver →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-6 uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="text-rose-400 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-400">À confirmer</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-rose-400 flex-shrink-0" size={16} />
                <span className="text-gray-400">À confirmer</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-rose-400 flex-shrink-0" size={16} />
                <span className="text-gray-400">À confirmer</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="text-rose-400" size={14} />
                  <span className="font-medium text-white text-xs uppercase tracking-wider">Horaires</span>
                </div>
                <p className="text-gray-400 text-xs pl-6 leading-relaxed">Lundi - Samedi : 9h à 19h</p>
                <p className="text-gray-400 text-xs pl-6 leading-relaxed">Dimanche : sur rendez-vous</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} BELIEVE & WISDOM. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-xs">
              <Link href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">
                Contact
              </Link>
              <Link href="/a-propos" className="text-gray-500 hover:text-gray-300 transition-colors">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
