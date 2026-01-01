'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import Button from '@/components/Button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(data.email, data.password);
      localStorage.setItem('token', response.data.token);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      console.error('Erreur de connexion:', err);
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
      } else if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 404) {
        setError('Endpoint non trouvé. Vérifiez la configuration de l\'API.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Erreur de connexion: ${error.message || 'Erreur inconnue'}`);
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            BELIEVE & WISDOM
          </h1>
          <p className="text-gray-600 text-sm">Espace administrateur</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center space-x-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
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
            <label className="block text-gray-700 font-medium mb-2 text-sm">Mot de passe</label>
            <input
              {...register('password', { required: 'Le mot de passe est requis' })}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 transition-all bg-white"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/admin/register"
            className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
          >
            Créer un compte administrateur
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

