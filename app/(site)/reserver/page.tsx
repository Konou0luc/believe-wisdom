'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { servicesApi, reservationsApi, Service, Category } from '@/lib/api';
import Button from '@/components/Button';
import ErrorState from '@/components/ErrorState';
import { useToast } from '@/contexts/ToastContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReservationForm {
  nom: string;
  email: string;
  telephone: string;
  typeService: string;
  date: string;
  heure: string;
  message?: string;
}

function ReservationFormContent() {
  const { showSuccess, showError } = useToast();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReservationForm>();

  useEffect(() => {
    loadServices();
    if (serviceId) {
      setValue('typeService', serviceId);
    }
  }, [serviceId, setValue]);

  const loadServices = async () => {
    try {
      setServicesError(null);
      setLoadingServices(true);
      const response = await servicesApi.getAll();
      setServices(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les services. Vérifiez votre connexion internet.';
      setServicesError(errorMessage);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const onSubmit = async (data: ReservationForm) => {
    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      await reservationsApi.create(data);
      showSuccess('Votre demande de réservation a été envoyée avec succès. Nous vous contacterons bientôt pour confirmer.');
      setTimeout(() => {
        window.location.href = '/reserver';
      }, 2000);
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
            // Mapper les noms de champs de l'API vers les noms du formulaire
            const fieldMap: Record<string, string> = {
              'nom': 'nom',
              'prenom': 'nom', // prenom est inclus dans nom
              'email': 'email',
              'telephone': 'telephone',
              'service': 'typeService',
              'typeService': 'typeService',
              'date': 'date',
              'heure': 'heure',
              'body.nom': 'nom',
              'body.prenom': 'nom',
              'body.email': 'email',
              'body.telephone': 'telephone',
              'body.service': 'typeService',
              'body.typeService': 'typeService',
              'body.date': 'date',
              'body.heure': 'heure',
            };
            
            const formField = fieldMap[field] || field;
            
            // Formater le message d'erreur pour qu'il soit plus lisible
            let formattedMessage = message;
            if (detail.type === 'any.required') {
              if (field === 'prenom' || field === 'body.prenom') {
                formattedMessage = 'Le nom complet est requis';
              } else if (field === 'service' || field === 'body.service') {
                formattedMessage = 'Veuillez sélectionner un service';
              } else {
                formattedMessage = 'Ce champ est requis';
              }
            } else if (detail.type === 'string.min') {
              formattedMessage = `Doit contenir au moins ${detail.context?.limit || 5} caractères`;
            } else if (detail.type === 'string.email') {
              formattedMessage = 'Format d\'email invalide';
            }
            
            // Si l'erreur concerne un champ déjà mappé, on l'ajoute
            if (formField && !fieldErrors[formField]) {
              fieldErrors[formField] = formattedMessage;
            }
          }
        });
        
        setValidationErrors(fieldErrors);
        
        // Afficher un message d'erreur général
        const mainMessage = errorData?.message || 'Erreurs de validation détectées';
        setError(mainMessage);
        showError(mainMessage);
      } else {
        // Erreur générale sans détails
        const errorMessage = errorData?.message || 'Une erreur est survenue. Veuillez réessayer.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const heures = Array.from({ length: 11 }, (_, i) => {
    const heure = 9 + i;
    return `${heure.toString().padStart(2, '0')}:00`;
  });

  const getCategoryName = (categorie: string | Category): string => {
    if (typeof categorie === 'object' && categorie?.nom) {
      return categorie.nom;
    }
    return typeof categorie === 'string' ? categorie : 'Non catégorisé';
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <p className="text-xs font-medium text-rose-500 uppercase tracking-wider mb-4">
          Réservation
        </p>
        <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
          Réserver un rendez-vous
        </h1>
        <p className="text-lg text-gray-600 font-light">
          Réservez votre soin ou massage en ligne. Nous vous confirmerons rapidement votre rendez-vous.
        </p>
      </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-beige-50 rounded-2xl p-8 lg:p-10 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-800 font-medium mb-2">
              <AlertCircle size={20} />
              <span>{error}</span>
              </div>
              {Object.keys(validationErrors).length > 0 && (
                <ul className="list-disc list-inside text-red-700 text-sm space-y-1 mt-2">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field}>
                      <span className="font-medium capitalize">{field === 'typeService' ? 'Service' : field}:</span> {message}
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
              placeholder="Votre nom"
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
              placeholder="votre@email.com"
            />
            {(errors.email || validationErrors.email) && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {validationErrors.email || errors.email?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Téléphone *</label>
            <input
              {...register('telephone', { required: 'Le téléphone est requis' })}
              type="tel"
              onChange={(e) => {
                if (validationErrors.telephone) {
                  setValidationErrors({ ...validationErrors, telephone: '' });
                }
              }}
              className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                validationErrors.telephone || errors.telephone
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                  : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
              }`}
              placeholder="+225 XX XX XX XX XX"
            />
            {(errors.telephone || validationErrors.telephone) && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <span className="text-red-500">•</span>
                {validationErrors.telephone || errors.telephone?.message}
              </p>
            )}
          </div>

          {servicesError ? (
            <ErrorState
              title="Erreur de chargement des services"
              message={servicesError}
              onRetry={loadServices}
              retryLabel="Réessayer"
            />
          ) : (
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Type de soin ou massage *</label>
              {loadingServices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-rose-500" size={24} />
                  <span className="ml-2 text-gray-600">Chargement des services...</span>
                </div>
              ) : services.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm">
                  Aucun service disponible pour le moment. Veuillez contacter l&apos;institut directement.
                </div>
              ) : (
                <select
                  {...register('typeService', { required: 'Veuillez sélectionner un service' })}
                  onChange={(e) => {
                    if (validationErrors.typeService) {
                      setValidationErrors({ ...validationErrors, typeService: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.typeService || errors.typeService
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                >
                  <option value="">Sélectionnez un service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.titre} - {getCategoryName(service.categorie)}
                    </option>
                  ))}
                </select>
              )}
              {(errors.typeService || validationErrors.typeService) && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.typeService || errors.typeService?.message}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Date souhaitée *</label>
              <input
                {...register('date', { required: 'La date est requise' })}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  if (validationErrors.date) {
                    setValidationErrors({ ...validationErrors, date: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                  validationErrors.date || errors.date
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                }`}
              />
              {(errors.date || validationErrors.date) && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.date || errors.date?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Heure souhaitée *</label>
              <select
                {...register('heure', { required: 'L\'heure est requise' })}
                onChange={(e) => {
                  if (validationErrors.heure) {
                    setValidationErrors({ ...validationErrors, heure: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                  validationErrors.heure || errors.heure
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                }`}
              >
                <option value="">Sélectionnez une heure</option>
                {heures.map((heure) => (
                  <option key={heure} value={heure}>
                    {heure}
                  </option>
                ))}
              </select>
              {(errors.heure || validationErrors.heure) && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.heure || errors.heure?.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Message (optionnel)</label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white resize-none"
              placeholder="Bonjour, Je souhaite réserver un rendez-vous..."
            />
          </div>

          <Button type="submit" disabled={loading || loadingServices || services.length === 0 || !!servicesError} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Envoi en cours...
              </>
            ) : (
              'Envoyer la réservation'
            )}
          </Button>
        </motion.form>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <div className="bg-white min-h-screen py-20">
      <Suspense fallback={<div className="text-center py-20">Chargement...</div>}>
        <ReservationFormContent />
      </Suspense>
    </div>
  );
}

