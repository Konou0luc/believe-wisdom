'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Image from 'next/image';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '+33780807662'; // Format sans espaces pour le lien WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Bonjour%2C%20je%20souhaite%20obtenir%20plus%20d%27informations%20sur%20vos%20services.`;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Chat Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-16 md:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/believe.jpeg"
                    alt="BELIEVE & WISDOM"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm truncate">BELIEVE & WISDOM</h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
                    <span className="text-white/95 text-xs font-medium">En ligne</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors flex-shrink-0 ml-2"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Content */}
            <div className="p-4 bg-[#ECE5DD]">
              <div className="mb-4 space-y-2">
                <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm">
                  <p className="text-gray-800 text-sm font-medium">Salut! 👋</p>
                </div>
                <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-sm">
                  <p className="text-gray-800 text-sm">
                    Écrivez-nous sur WhatsApp
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-[#25D366]/30 shadow-sm">
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Envoyez-nous un message à tout moment sur WhatsApp. Nous répondons rapidement.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-[#25D366] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#20BA5A] transition-colors text-sm shadow-md hover:shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle size={18} className="mr-2" />
                  Ouvrir WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-[#25D366] text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir WhatsApp"
        style={{ boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)' }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md"
            >
              1
            </motion.div>
          )}
        </AnimatePresence>
        {isOpen ? (
          <X size={20} className="md:w-6 md:h-6" />
        ) : (
          <MessageCircle size={20} className="md:w-6 md:h-6" />
        )}
      </motion.button>
    </div>
  );
}


