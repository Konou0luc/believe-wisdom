import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Gérer les erreurs d'authentification (401/403)
    if (status === 401 || status === 403) {
      // Supprimer le token invalide
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Rediriger vers la page de login si on est sur une route admin
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin') && !currentPath.includes('/login') && !currentPath.includes('/register')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    // Log des erreurs pour le débogage (sauf les erreurs 401/403 qui sont gérées ci-dessus)
    if (process.env.NODE_ENV === 'development') {
      if (status !== 401 && status !== 403) {
        const errorInfo: Record<string, any> = {};
        if (error.config?.url) errorInfo.url = error.config.url;
        if (error.config?.method) errorInfo.method = error.config.method;
        if (status) errorInfo.status = status;
        if (error.message) errorInfo.message = error.message;
        if (error.response?.data) errorInfo.data = error.response.data;
        
        // Ne logger que si on a au moins une information
        if (Object.keys(errorInfo).length > 0) {
          console.error('API Error:', errorInfo);
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface Category {
  _id?: string;
  nom: string;
  description?: string;
  couleur?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  _id?: string;
  titre: string;
  description: string;
  prix: number;
  categorie: string | Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  _id?: string;
  nom: string;
  email: string;
  telephone: string;
  typeService: string;
  date: string;
  heure: string;
  message?: string;
  statut?: 'en_attente' | 'confirme' | 'annule';
  createdAt?: string;
}

export interface Temoignage {
  _id?: string;
  nom: string;
  email: string;
  note: number;
  commentaire: string;
  approuve?: boolean;
  createdAt?: string;
}

export interface Contact {
  _id?: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  lu?: boolean;
  createdAt?: string;
}

export const servicesApi = {
  getAll: () => api.get<Service[]>('/services'),
  create: (data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Service>('/services', data),
  update: (id: string, data: Partial<Service>) => 
    api.put<Service>(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => 
    api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const reservationsApi = {
  create: (data: Omit<Reservation, '_id' | 'statut' | 'createdAt'>) => 
    api.post<Reservation>('/reservations', data),
  getAll: () => api.get<Reservation[]>('/reservations'),
  getByEmail: (email: string) => api.get<Reservation[]>(`/reservations/email/${encodeURIComponent(email)}`),
  updateStatus: (id: string, statut: Reservation['statut']) => 
    api.put<Reservation>(`/reservations/${id}`, { statut }),
};

export const temoignagesApi = {
  getAll: () => api.get<Temoignage[]>('/temoignages/public'),
  getAllAdmin: () => api.get<Temoignage[]>('/temoignages'),
  create: (data: Omit<Temoignage, '_id' | 'approuve' | 'createdAt'>) => 
    api.post<Temoignage>('/temoignages', data),
  moderate: (id: string, approuve: boolean) => 
    api.put<Temoignage>(`/temoignages/${id}`, { approuve }),
  delete: (id: string) => api.delete(`/temoignages/${id}`),
};

export const contactApi = {
  getAll: () => api.get<Contact[]>('/contact'),
  create: (data: Omit<Contact, '_id' | 'lu' | 'createdAt'>) => 
    api.post<Contact>('/contact', data),
  markAsRead: (id: string) => 
    api.put<Contact>(`/contact/${id}/lu`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

export const authApi = {
  login: (email: string, password: string) => 
    api.post<{ token: string; user: Record<string, unknown> }>('/auth/login', { email, motDePasse: password }),
  register: (data: { email: string; password: string; nom: string; role?: string }) => 
    api.post('/auth/register', { 
      email: data.email, 
      motDePasse: data.password, 
      nom: data.nom,
      role: data.role || 'admin'
    }),
  registerInitial: (data: { email: string; password: string; nom: string }) => 
    api.post('/auth/register-initial', { 
      email: data.email, 
      motDePasse: data.password, 
      nom: data.nom
    }),
};

export default api;

