'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactApi } from '@/lib/api';
import Button from '@/components/Button';
import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';
import GoogleMap from '@/components/GoogleMap';

interface ContactForm {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}

export default function ContactPage() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    setValidationErrors({});
    setFormError(null);

    try {
      await contactApi.create(data);
      showSuccess('Votre message a été envoyé avec succès !');
      reset();
      setValidationErrors({});
      setFormError(null);
    } catch (err: unknown) {
      const errorData = (err as { response?: { data?: any } })?.response?.data;
      const errorDetails = errorData?.details;
      
      // Gérer les erreurs de validation détaillées
      if (errorDetails && Array.isArray(errorDetails)) {
        const fieldErrors: Record<string, string> = {};
        
        errorDetails.forEach((detail: any) => {
          const field = detail.path?.[detail.path.length - 1] || detail.context?.key;
          const message = detail.message || detail.context?.label;
          
          if (field) {
            const fieldMap: Record<string, string> = {
              'nom': 'nom',
              'email': 'email',
              'telephone': 'telephone',
              'sujet': 'sujet',
              'message': 'message',
              'body.nom': 'nom',
              'body.email': 'email',
              'body.telephone': 'telephone',
              'body.sujet': 'sujet',
              'body.message': 'message',
            };
            
            const formField = fieldMap[field] || field;
            
            let formattedMessage = message;
            if (detail.type === 'any.required') {
              formattedMessage = 'Ce champ est requis';
            } else if (detail.type === 'string.min') {
              formattedMessage = `Doit contenir au moins ${detail.context?.limit || 5} caractères`;
            } else if (detail.type === 'string.email') {
              formattedMessage = 'Format d\'email invalide';
            }
            
            if (formField && !fieldErrors[formField]) {
              fieldErrors[formField] = formattedMessage;
            }
          }
        });
        
        setValidationErrors(fieldErrors);
        
        const mainMessage = errorData?.message || 'Erreurs de validation détectées';
        setFormError(mainMessage);
        showError(mainMessage);
      } else {
        const errorMessage = errorData?.message || 'Une erreur est survenue. Veuillez réessayer.';
        setFormError(errorMessage);
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
            Contact
          </p>
          <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner dans votre bien-être.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-normal text-gray-900 mb-6">Institut BELIEVE & WISDOM</h2>
              <p className="text-lg text-gray-600 mb-6 font-light">Soin – Beauté – Massage</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-rose-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Adresse</h3>
                  <p className="text-gray-600">N° 222, Avenue de la République, Lomé, Togo</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-rose-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Téléphone</h3>
                  <a 
                    href="tel:+33780807662" 
                    className="text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    +33 7 80 80 76 62
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-rose-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                  <a 
                    href="mailto:believe-wisdom@gmail.com" 
                    className="text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    believe-wisdom@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-rose-500 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Horaires d&apos;ouverture</h3>
                  <p className="text-gray-600">Lundi – Samedi : 9h à 19h</p>
                  <p className="text-gray-600">Dimanche : sur rendez-vous uniquement</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <GoogleMap height={450} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-beige-50 rounded-2xl p-8 lg:p-10"
          >
            <h2 className="text-2xl font-normal text-gray-900 mb-6">Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 font-medium text-sm mb-2">{formError}</p>
                  {Object.keys(validationErrors).length > 0 && (
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                      {Object.entries(validationErrors).map(([field, message]) => (
                        <li key={field}>
                          <span className="font-medium capitalize">{field}:</span> {message}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            )}

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Nom complet *</label>
                <input
                  {...register('nom', { required: 'Le nom est requis' })}
                  type="text"
                  onChange={(e) => {
                    if (validationErrors.nom) {
                      setValidationErrors({ ...validationErrors, nom: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.nom || errors.nom
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {(errors.nom || validationErrors.nom) && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.nom || errors.nom?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Email *</label>
                <input
                  {...register('email', {
                    required: 'L\'email est requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  onChange={(e) => {
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.email || errors.email
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {(errors.email || validationErrors.email) && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.email || errors.email?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Téléphone</label>
                <input
                  {...register('telephone')}
                  type="tel"
                  onChange={(e) => {
                    if (validationErrors.telephone) {
                      setValidationErrors({ ...validationErrors, telephone: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.telephone
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {validationErrors.telephone && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.telephone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Sujet *</label>
                <input
                  {...register('sujet', { required: 'Le sujet est requis' })}
                  type="text"
                  onChange={(e) => {
                    if (validationErrors.sujet) {
                      setValidationErrors({ ...validationErrors, sujet: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.sujet || errors.sujet
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {(errors.sujet || validationErrors.sujet) && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.sujet || errors.sujet?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Message *</label>
                <textarea
                  {...register('message', { required: 'Le message est requis' })}
                  rows={6}
                  onChange={(e) => {
                    if (validationErrors.message) {
                      setValidationErrors({ ...validationErrors, message: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white resize-none ${
                    validationErrors.message || errors.message
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {(errors.message || validationErrors.message) && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.message || errors.message?.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={18} />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le message'
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

