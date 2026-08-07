'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaDollarSign,
  FaUsers,
  FaArrowUp,
  FaClock,
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

type Stats = {
  totalTours: number;
  reservationsThisMonth: number;
  revenue: number;
  totalClients: number;
  recentReservations: {
    id: string;
    full_name: string;
    tour_name: string;
    travel_date: string;
    total: number;
    status: string;
    reservation_code: string;
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

      const [toursRes, reservationsRes, monthReservationsRes, clientsRes] =
        await Promise.all([
          supabase.from('tours').select('id', { count: 'exact', head: true }),
          supabase
            .from('reservations')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', firstDay.toISOString()),
          supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('reservations')
            .select('email', { count: 'exact', head: true }),
        ]);

      const revenue = (monthReservationsRes.data || []).reduce(
        (sum, r) => sum + Number(r.total),
        0,
      );

      setStats({
        totalTours: toursRes.count || 0,
        reservationsThisMonth: reservationsRes.count || 0,
        revenue,
        totalClients: clientsRes.count || 0,
        recentReservations: (monthReservationsRes.data || []) as Stats['recentReservations'],
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    {
      label: 'Total de Tours',
      value: stats?.totalTours ?? 0,
      icon: FaMapMarkedAlt,
      color: 'from-brand-primary to-brand-secondary',
    },
  ];

  const statusColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    confirmada: 'bg-blue-100 text-blue-700',
    pagada: 'bg-green-100 text-green-700',
    cancelada: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">
          Resumen
        </h1>
        <p className="text-brand-dark/50 text-sm">
          Vista general de tu agencia de viajes
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white animate-pulse" />
            ))
          : cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <card.icon className="text-white text-xl" />
                  </div>
                  <span className="text-green-500 text-xs font-semibold flex items-center gap-1">
                    <FaArrowUp /> 12%
                  </span>
                </div>
                <div className="font-display font-bold text-3xl text-brand-dark mb-1">
                  {card.value}
                </div>
                <p className="text-brand-dark/50 text-sm">{card.label}</p>
              </motion.div>
            ))}
      </div>

      {/* Recent reservations */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-dark">
            Reservas recientes
          </h2>
          <FaClock className="text-brand-dark/30" />
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : stats?.recentReservations.length === 0 ? (
          <div className="p-12 text-center text-brand-dark/40">
            No hay reservas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-brand-dark/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Código</th>
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Tour</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats?.recentReservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-brand-primary">
                      {r.reservation_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark">
                      {r.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {r.tour_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      {new Date(r.travel_date).toLocaleDateString('es-BO')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-dark">
                      ${r.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
    </div>
  );
}
