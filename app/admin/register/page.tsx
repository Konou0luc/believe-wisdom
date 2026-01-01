'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import Button from '@/components/Button';
import { AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterForm {
  nom: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'superadmin';
}

export default function AdminRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: 'superadmin',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    // Vérification que les mots de passe correspondent
    if (data.password !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // Essayer d'abord avec registerInitial (pour créer le premier superadmin)
      // Si un superadmin existe déjà, essayer avec register (nécessite authentification)
      try {
        await authApi.registerInitial({
          nom: data.nom,
          email: data.email,
          password: data.password,
        });
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } catch (initialErr: unknown) {
        const initialError = initialErr as {
          response?: {
            data?: { message?: string };
            status?: number;
          };
        };

        // Si un superadmin existe déjà (403), essayer avec register (nécessite token)
        if (initialError.response?.status === 403) {
          // Vérifier si on a un token
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Un superadmin existe déjà. Veuillez vous connecter d\'abord pour créer un nouveau compte administrateur.');
            setLoading(false);
            return;
          }

          // Utiliser register avec authentification
          await authApi.register({
            nom: data.nom,
            email: data.email,
            password: data.password,
            role: data.role,
          });
          setSuccess(true);
          setTimeout(() => {
            router.push('/admin/login');
          }, 2000);
        } else {
          throw initialErr;
        }
      }
    } catch (err: unknown) {
      console.error('Erreur lors de la création du compte:', err);
      const error = err as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
        message?: string;
        code?: string;
      };

      // Gestion des erreurs réseau
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:3001');
      } else if (error.response?.status === 409) {
        setError('Cet email est déjà utilisé');
      } else if (error.response?.status === 401) {
        setError('Token manquant ou invalide. Veuillez vous connecter d\'abord.');
      } else if (error.response?.status === 403) {
        setError('Vous n\'avez pas les permissions nécessaires pour créer un compte.');
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Données invalides');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Erreur lors de la création du compte: ${error.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-beige-50 to-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <Link
          href="/admin/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-rose-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour à la connexion
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            BELIEVE & WISDOM
          </h1>
          <p className="text-gray-600 text-sm">Création d'un compte administrateur</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-2 text-red-700"
          >
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-2 text-green-700"
          >
            <CheckCircle2 size={20} />
            <span className="text-sm">Compte créé avec succès ! Redirection vers la page de connexion...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Nom complet *</label>
            <input
              {...register('nom', { required: 'Le nom est requis' })}
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              placeholder="Nom de l'administrateur"
            />
            {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>}
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              placeholder="admin@believe-wisdom.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Mot de passe *</label>
            <input
              {...register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
              })}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Confirmer le mot de passe *</label>
            <input
              {...register('confirmPassword', {
                required: 'La confirmation du mot de passe est requise',
                validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
              })}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={loading || success} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Création en cours...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2" size={18} />
                Compte créé !
              </>
            ) : (
              'Créer le compte'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

