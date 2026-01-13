'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers le dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-rose-500 mx-auto mb-4" size={32} />
        <p className="text-gray-600">Redirection vers le dashboard...</p>
      </div>
    </div>
  );
}

