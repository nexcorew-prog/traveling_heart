'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FaHeart, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push('/admin/dashboard');
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error || !data.user) {
      toast({
        title: 'Error de acceso',
        description: 'Credenciales incorrectas. Verifica tu correo y contraseña.',
        variant: 'destructive',
      });
      return;
    }
    toast({ title: 'Bienvenido', description: 'Acceso concedido.' });
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-secondary/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <FaHeart className="text-brand-primary text-3xl" />
              <span className="font-display font-bold text-2xl text-brand-dark">
                Traveling <span className="text-brand-primary">Heart</span>
              </span>
            </div>
            <p className="text-brand-dark/50 text-sm">Panel de administración</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Usuario / Email
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@travelingheart.bo"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Contraseña
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaSignInAlt />
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-xs text-brand-dark/40 mt-6">
            ¿Necesitas acceso? Contacta al administrador del sistema.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
