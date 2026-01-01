'use client';

import { useState, useEffect } from 'react';
import { categoriesApi, Category } from '@/lib/api';
import Button from '@/components/Button';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { Edit, Trash2, Plus, Loader2, X, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCategoriesPage() {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    couleur: '#ec4899',
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les catégories. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des catégories:', err);
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
      if (editingCategory) {
        await categoriesApi.update(editingCategory._id!, formData);
        showSuccess('Catégorie modifiée avec succès');
      } else {
        await categoriesApi.create(formData);
        showSuccess('Catégorie créée avec succès');
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ nom: '', description: '', couleur: '#ec4899' });
      setValidationErrors({});
      setFormError(null);
      loadCategories();
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
            const fieldMap: Record<string, string> = {
              'nom': 'nom',
              'description': 'description',
              'couleur': 'couleur',
              'body.nom': 'nom',
              'body.description': 'description',
              'body.couleur': 'couleur',
            };
            
            const formField = fieldMap[field] || field;
            
            let formattedMessage = message;
            if (detail.type === 'any.required') {
              formattedMessage = 'Ce champ est requis';
            } else if (detail.type === 'string.min') {
              formattedMessage = `Doit contenir au moins ${detail.context?.limit || 3} caractères`;
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
                            'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.';
        setFormError(errorMessage);
        showError(errorMessage);
      }
      
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nom: category.nom,
      description: category.description || '',
      couleur: category.couleur || '#ec4899',
    });
    setValidationErrors({});
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Les services associés devront être mis à jour.')) return;

    try {
      await categoriesApi.delete(id);
      showSuccess('Catégorie supprimée avec succès');
      loadCategories();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Une erreur est survenue lors de la suppression. Veuillez réessayer.';
      showError(errorMessage);
      console.error('Erreur lors de la suppression:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">Catégories</h1>
          <p className="text-sm text-gray-500">Gérez les catégories de vos services</p>
        </div>
        {!showForm && (
          <Button onClick={() => {
            setEditingCategory(null);
            setFormData({ nom: '', description: '', couleur: '#ec4899' });
            setValidationErrors({});
            setFormError(null);
            setShowForm(true);
          }} className="w-full sm:w-auto">
            <Plus className="inline mr-2" size={18} />
            Ajouter une catégorie
          </Button>
        )}
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-normal text-gray-900">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCategory(null);
                setFormData({ nom: '', description: '', couleur: '#ec4899' });
                setValidationErrors({});
                setFormError(null);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Ex: Soins visage"
              />
              {validationErrors.nom && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.nom}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (validationErrors.description) {
                    setValidationErrors({ ...validationErrors, description: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border transition-all bg-white resize-none ${
                  validationErrors.description
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                }`}
                placeholder="Description de la catégorie (optionnel)"
              />
              {validationErrors.description && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Couleur</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={formData.couleur}
                  onChange={(e) => {
                    setFormData({ ...formData, couleur: e.target.value });
                    if (validationErrors.couleur) {
                      setValidationErrors({ ...validationErrors, couleur: '' });
                    }
                  }}
                  className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.couleur}
                  onChange={(e) => {
                    setFormData({ ...formData, couleur: e.target.value });
                    if (validationErrors.couleur) {
                      setValidationErrors({ ...validationErrors, couleur: '' });
                    }
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all bg-white font-mono text-sm ${
                    validationErrors.couleur
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                  placeholder="#ec4899"
                />
              </div>
              {validationErrors.couleur && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.couleur}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin inline" size={16} />
                    Enregistrement...
                  </>
                ) : editingCategory ? (
                  'Modifier'
                ) : (
                  'Créer'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  setValidationErrors({});
                  setFormError(null);
                }}
              >
                Annuler
              </Button>
            </div>
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
          onRetry={loadCategories}
          retryLabel="Réessayer"
        />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Aucune catégorie"
          description="Commencez par créer votre première catégorie pour organiser vos services."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:border-rose-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.couleur || '#ec4899' }}
                  >
                    <Tag className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.nom}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

