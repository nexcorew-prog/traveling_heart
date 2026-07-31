'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaEye, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import { supabase, type Reservation } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const statusOptions = ['pendiente', 'confirmada', 'pagada', 'cancelada'];
const statusColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmada: 'bg-blue-100 text-blue-700',
  pagada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
};

export default function AdminReservasPage() {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState('Todos');

  const loadReservations = async () => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    setReservations((data as Reservation[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Estado actualizado', description: `Reserva marcada como ${status}` });
      loadReservations();
      if (detail?.id === id) setDetail({ ...detail, status });
    }
  };

  const filtered = filter === 'Todos'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">
          Reservas
        </h1>
        <p className="text-brand-dark/50 text-sm">
          Gestiona todas las reservas de tus clientes
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Todos', ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              filter === s
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-white text-brand-dark/60 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FaCalendarCheck className="text-brand-dark/20 text-4xl mx-auto mb-3" />
            <p className="text-brand-dark/40">No hay reservas en esta categoría.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-brand-dark/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">N° Reserva</th>
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Tour</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
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
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border-0 cursor-pointer ${statusColors[r.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-white text-brand-dark">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDetail(r)}
                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors ml-auto"
                      >
                        <FaEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display font-bold text-xl text-brand-dark">
                  Detalle de Reserva
                </h2>
                <button
                  onClick={() => setDetail(null)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-orange-50/50 rounded-xl p-4 text-center">
                  <p className="text-brand-dark/50 text-xs uppercase tracking-wider mb-1">
                    Código de reserva
                  </p>
                  <p className="font-display font-bold text-2xl text-brand-primary font-mono">
                    {detail.reservation_code}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-brand-dark/50 mb-1">Cliente</p>
                    <p className="font-semibold text-brand-dark">{detail.full_name}</p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Email</p>
                    <p className="font-semibold text-brand-dark">{detail.email}</p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Teléfono</p>
                    <p className="font-semibold text-brand-dark">{detail.phone}</p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Personas</p>
                    <p className="font-semibold text-brand-dark">{detail.num_people}</p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Tour</p>
                    <p className="font-semibold text-brand-dark">{detail.tour_name}</p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Fecha de viaje</p>
                    <p className="font-semibold text-brand-dark">
                      {new Date(detail.travel_date).toLocaleDateString('es-BO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Pago</p>
                    <p className="font-semibold text-brand-dark capitalize">
                      {detail.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-dark/50 mb-1">Total</p>
                    <p className="font-bold text-brand-primary text-lg">
                      ${detail.total}
                    </p>
                  </div>
                </div>
                {detail.message && (
                  <div>
                    <p className="text-brand-dark/50 text-sm mb-1">Mensaje</p>
                    <p className="text-brand-dark/70 text-sm bg-gray-50 rounded-xl p-3">
                      {detail.message}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-brand-dark/50 text-sm mb-2">Estado</p>
                  <div className="flex gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(detail.id, s)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                          detail.status === s
                            ? statusColors[s]
                            : 'bg-gray-100 text-brand-dark/40 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
