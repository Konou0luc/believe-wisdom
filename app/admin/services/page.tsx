'use client';

import { useState, useEffect } from 'react';
import { servicesApi, categoriesApi, Service, Category } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/Button';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/contexts/ToastContext';
import { Edit, Trash2, Plus, Loader2, X, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminServicesPage() {
  const { showSuccess, showError } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorie: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await servicesApi.getAll();
      setServices(response.data || []);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 
                          err?.message || 
                          'Impossible de charger les services. Vérifiez votre connexion internet ou réessayez plus tard.';
      setError(errorMessage);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des catégories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setValidationErrors({});
    setFormError(null);

    try {
      const data = {
        titre: formData.titre,
        description: formData.description,
        prix: Number(formData.prix),
        categorie: formData.categorie, // ID de la catégorie
      };

      if (editingService) {
        await servicesApi.update(editingService._id!, data);
        showSuccess('Service modifié avec succès');
      } else {
        await servicesApi.create(data);
        showSuccess('Service créé avec succès');
      }

      setShowForm(false);
      setEditingService(null);
      setFormData({ titre: '', description: '', prix: '', categorie: '' });
      setValidationErrors({});
      setFormError(null);
      loadServices();
    } catch (err: any) {
      const errorData = err?.response?.data;
      const errorDetails = errorData?.details;
      
      // Gérer les erreurs de validation détaillées
      if (errorDetails && Array.isArray(errorDetails)) {
        const fieldErrors: Record<string, string> = {};
        const generalErrors: string[] = [];
        
        errorDetails.forEach((detail: any) => {
          const field = detail.path?.[detail.path.length - 1] || detail.context?.key;
          const message = detail.message || detail.context?.label;
          
          if (field) {
            // Mapper les noms de champs de l'API vers les noms du formulaire
            const fieldMap: Record<string, string> = {
              'titre': 'titre',
              'description': 'description',
              'prix': 'prix',
              'categorie': 'categorie',
              'body.titre': 'titre',
              'body.description': 'description',
              'body.prix': 'prix',
              'body.categorie': 'categorie',
            };
            
            const formField = fieldMap[field] || field;
            
            // Formater le message d'erreur pour qu'il soit plus lisible
            let formattedMessage = message;
            if (detail.context?.limit) {
              formattedMessage = `Doit contenir au moins ${detail.context.limit} caractères`;
            } else if (detail.type === 'string.min') {
              formattedMessage = `Doit contenir au moins ${detail.context?.limit || 5} caractères`;
            } else if (detail.type === 'number.min') {
              formattedMessage = `La valeur doit être supérieure ou égale à ${detail.context?.limit || 0}`;
            } else if (detail.type === 'any.required') {
              formattedMessage = 'Ce champ est requis';
            }
            
            fieldErrors[formField] = formattedMessage;
          } else {
            generalErrors.push(message || 'Erreur de validation');
          }
        });
        
        setValidationErrors(fieldErrors);
        
        if (generalErrors.length > 0 || Object.keys(fieldErrors).length === 0) {
          const mainMessage = errorData?.message || 'Erreurs de validation détectées';
          setFormError(mainMessage);
          showError(mainMessage);
        }
      } else {
        // Erreur générale sans détails
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

  const handleEdit = (service: Service) => {
    setEditingService(service);
    let categorieId = '';
    if (typeof service.categorie === 'object' && service.categorie?._id) {
      categorieId = String(service.categorie._id);
    } else if (typeof service.categorie === 'string') {
      categorieId = service.categorie;
    }
    setFormData({
      titre: service.titre,
      description: service.description,
      prix: service.prix.toString(),
      categorie: categorieId,
    });
    setValidationErrors({});
    setFormError(null);
    setShowForm(true);
  };

  const getCategoryName = (categorie: string | Category): string => {
    if (typeof categorie === 'object' && categorie?.nom) {
      return categorie.nom;
    }
    // Fallback pour les anciennes catégories en string
    const cat = categories.find(c => c._id === categorie);
    return cat?.nom || (typeof categorie === 'string' ? categorie : 'Non catégorisé');
  };

  const getCategoryId = (categorie: string | Category): string => {
    if (typeof categorie === 'object' && categorie?._id) {
      return categorie._id;
    }
    return typeof categorie === 'string' ? categorie : '';
  };

  // Filtrer les services
  const filteredServices = services.filter((service) => {
    const matchesSearch = searchQuery === '' || 
      service.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      getCategoryId(service.categorie) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;

    try {
      await servicesApi.delete(id);
      showSuccess('Service supprimé avec succès');
      loadServices();
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
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">Services</h1>
          <p className="text-sm text-gray-500">Gérez vos services et leurs catégories</p>
        </div>
        {!showForm && (
          <Button 
            onClick={() => {
              setEditingService(null);
              setFormData({ titre: '', description: '', prix: '', categorie: '' });
              setValidationErrors({});
              setFormError(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="inline mr-2" size={18} />
            Ajouter un service
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
              {editingService ? 'Modifier le service' : 'Nouveau service'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
                setFormData({ titre: '', description: '', prix: '', categorie: '' });
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
              <label className="block text-gray-700 font-medium mb-2 text-sm">Titre *</label>
              <input
                type="text"
                required
                value={formData.titre}
                onChange={(e) => {
                  setFormData({ ...formData, titre: e.target.value });
                  if (validationErrors.titre) {
                    setValidationErrors({ ...validationErrors, titre: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                  validationErrors.titre
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                }`}
              />
              {validationErrors.titre && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.titre}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Description *</label>
              <textarea
                required
                rows={4}
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
              />
              {validationErrors.description && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Prix (FCFA) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.prix}
                  onChange={(e) => {
                    setFormData({ ...formData, prix: e.target.value });
                    if (validationErrors.prix) {
                      setValidationErrors({ ...validationErrors, prix: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.prix
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                />
                {validationErrors.prix && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.prix}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Catégorie *</label>
                <select
                  required
                  value={formData.categorie}
                  onChange={(e) => {
                    setFormData({ ...formData, categorie: e.target.value });
                    if (validationErrors.categorie) {
                      setValidationErrors({ ...validationErrors, categorie: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border transition-all bg-white ${
                    validationErrors.categorie
                      ? 'border-red-300 focus:ring-2 focus:ring-red-500/50 focus:border-red-400'
                      : 'border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300'
                  }`}
                  disabled={loadingCategories || categories.length === 0}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
                {validationErrors.categorie && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-red-500">•</span>
                    {validationErrors.categorie}
                  </p>
                )}
                {categories.length === 0 && !loadingCategories && !validationErrors.categorie && (
                  <p className="text-xs text-gray-500 mt-1">
                    Aucune catégorie disponible. Créez-en une d'abord.
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin inline" size={16} />
                    Enregistrement...
                  </>
                ) : editingService ? (
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
                  setEditingService(null);
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
          onRetry={loadServices}
          retryLabel="Réessayer"
        />
      ) : services.length === 0 ? (
        <EmptyState
          title="Aucun service"
          description={categories.length === 0 
            ? "Vous devez d'abord créer une catégorie avant d'ajouter un service."
            : "Commencez par ajouter votre premier service."
          }
        />
      ) : (
        <>
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
                />
              </div>
              <div className="sm:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white appearance-none"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {filteredServices.length !== services.length && (
              <p className="text-sm text-gray-500 mt-3">
                {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''} sur {services.length}
              </p>
            )}
          </div>

          {filteredServices.length === 0 ? (
            <EmptyState
              title="Aucun service trouvé"
              description={searchQuery || selectedCategory !== 'all' 
                ? "Aucun service ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre premier service."
              }
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
              <thead className="bg-beige-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Titre</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="font-medium text-gray-900">{service.titre}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{service.description}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                        {getCategoryName(service.categorie)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-medium text-rose-600">
                      {formatPrice(service.prix)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(service._id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}

