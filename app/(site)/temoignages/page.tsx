'use client';

import { useState, useEffect } from 'react';
import { temoignagesApi, Temoignage } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Star, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';

export default function TemoignagesPage() {
  const { showSuccess, showError } = useToast();
  const [temoignages, setTemoignages] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    note: 5,
    commentaire: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadTemoignages();
  }, []);

  const loadTemoignages = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await temoignagesApi.getAll();
      // Le backend filtre déjà les témoignages approuvés, pas besoin de filtrer à nouveau
      setTemoignages(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les témoignages. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des témoignages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors({});
    setFormError(null);

    try {
      await temoignagesApi.create(formData);
      showSuccess('Merci pour votre témoignage ! Il sera publié après modération.');
      setFormData({ nom: '', email: '', note: 5, commentaire: '' });
      setValidationErrors({});
      setFormError(null);
        setShowForm(false);
        loadTemoignages();
    } catch (err: any) {
      const errorData = err?.response?.data;
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
              'email': 'email',
              'note': 'note',
              'commentaire': 'commentaire',
              'body.nom': 'nom',
              'body.email': 'email',
              'body.note': 'note',
              'body.commentaire': 'commentaire',
            };
            
            const formField = fieldMap[field] || field;
            
            // Formater le message d'erreur
            let formattedMessage = message;
            if (detail.type === 'any.required') {
              formattedMessage = 'Ce champ est requis';
            } else if (detail.type === 'string.min') {
              formattedMessage = `Doit contenir au moins ${detail.context?.limit || 5} caractères`;
            } else if (detail.type === 'string.email') {
              formattedMessage = 'Format d\'email invalide';
            } else if (detail.type === 'number.min' || detail.type === 'number.max') {
              formattedMessage = `La note doit être entre ${detail.context?.limit || 1} et ${detail.context?.limit || 5}`;
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
        const errorMessage = errorData?.message || 
                          err?.message || 
                          'Une erreur est survenue lors de l\'envoi de votre témoignage. Veuillez réessayer.';
        setFormError(errorMessage);
        showError(errorMessage);
      }
      
      console.error('Erreur lors de l\'envoi du témoignage:', err);
    } finally {
      setSubmitting(false);
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
            Témoignages
          </p>
          <h1 className="text-4xl lg:text-5xl font-normal text-gray-900 mb-6">
            Ce que nos clients disent
          </h1>
        </motion.div>

        {!loading && !error && temoignages.length > 0 && (
        <div className="text-center mb-12">
          <Button onClick={() => setShowForm(!showForm)} variant="outline">
            {showForm ? 'Annuler' : 'Ajouter un témoignage'}
          </Button>
        </div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 bg-beige-50 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => {
                      setFormData({ ...formData, nom: e.target.value });
                      if (validationErrors.nom) {
                        setValidationErrors({ ...validationErrors, nom: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                      validationErrors.nom
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                    }`}
                  />
                  {validationErrors.nom && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {validationErrors.nom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (validationErrors.email) {
                        setValidationErrors({ ...validationErrors, email: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                      validationErrors.email
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Note *</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, note: star });
                          if (validationErrors.note) {
                            setValidationErrors({ ...validationErrors, note: '' });
                          }
                        }}
                        className={`${
                          star <= formData.note ? 'text-rose-400' : 'text-gray-300'
                        } hover:text-rose-400 transition-colors`}
                      >
                        <Star size={32} fill={star <= formData.note ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  {validationErrors.note && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {validationErrors.note}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Commentaire *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.commentaire}
                    onChange={(e) => {
                      setFormData({ ...formData, commentaire: e.target.value });
                      if (validationErrors.commentaire) {
                        setValidationErrors({ ...validationErrors, commentaire: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl border transition-all bg-white resize-none ${
                      validationErrors.commentaire
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                        : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                    }`}
                  />
                  {validationErrors.commentaire && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <span className="text-red-500">•</span>
                      {validationErrors.commentaire}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={submitting} size="lg" className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Envoi...
                    </>
                  ) : (
                    'Envoyer'
                  )}
                </Button>
              </form>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : error ? (
          <ErrorState
            title="Erreur de chargement"
            message={error}
            onRetry={loadTemoignages}
            retryLabel="Réessayer"
          />
        ) : temoignages.length === 0 ? (
          <EmptyState
            title="Aucun témoignage pour le moment"
            description="Soyez le premier à partager votre expérience avec BELIEVE & WISDOM !"
            action={
              <Button onClick={() => setShowForm(true)} variant="outline">
                Ajouter un témoignage
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temoignages.map((temoignage, index) => (
              <motion.div
                key={temoignage._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-beige-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={star <= temoignage.note ? 'text-rose-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">&quot;{temoignage.commentaire}&quot;</p>
                <div className="border-t border-rose-200/50 pt-4">
                  <p className="font-medium text-gray-900">{temoignage.nom}</p>
                  {temoignage.createdAt && (
                    <p className="text-sm text-gray-500 mt-1">{formatDate(temoignage.createdAt)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

