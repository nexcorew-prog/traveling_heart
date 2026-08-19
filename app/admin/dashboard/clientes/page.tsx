'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

type ClientRow = {
  email: string;
  full_name: string;
  phone: string;
  total_spent: number;
  num_reservations: number;
  last_reservation: string;
};

export default function AdminClientesPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('reservations')
        .select('full_name, email, phone, total, created_at')
        .order('created_at', { ascending: false });

      const map = new Map<string, ClientRow>();
      (data || []).forEach((r: any) => {
        const key = r.email;
        if (!map.has(key)) {
          map.set(key, {
            email: r.email,
            full_name: r.full_name,
            phone: r.phone || '',
            total_spent: 0,
            num_reservations: 0,
            last_reservation: r.created_at,
          });
        }
        const c = map.get(key)!;
        c.total_spent += Number(r.total);
        c.num_reservations += 1;
      });

      setClients(Array.from(map.values()));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-brand-dark mb-1">
          Clientes
        </h1>
        <p className="text-brand-dark/50 text-sm">
          Lista de clientes que han realizado reservas
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-brand-dark/20 text-4xl mx-auto mb-3" />
            <p className="text-brand-dark/40">No hay clientes registrados aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-brand-dark/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Contacto</th>
                  <th className="px-6 py-3 font-semibold">Reservas</th>
                  <th className="px-6 py-3 font-semibold">Total gastado</th>
                  <th className="px-6 py-3 font-semibold">Última reserva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((c) => (
                  <tr key={c.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                          {c.full_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-brand-dark">
                          {c.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-brand-dark/60">
                        <FaEnvelope size={12} /> {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-2 text-sm text-brand-dark/60 mt-1">
                          <FaPhone size={12} /> {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark">
                      {c.num_reservations}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-primary">
                      $ {c.total_spent}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-dark/60">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt size={12} />
                        {new Date(c.last_reservation).toLocaleDateString('es-BO')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
