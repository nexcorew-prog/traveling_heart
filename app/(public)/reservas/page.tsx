'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaCreditCard,
  FaUniversity,
  FaCheckCircle,
  FaReceipt,
} from 'react-icons/fa';
import { supabase, type Tour } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ReservasPage() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tour');
  const { toast } = useToast();

  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [numPeople, setNumPeople] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'activo');
      setTours((data as Tour[]) || []);
      if (tourId) {
        const found = (data as Tour[])?.find((t) => t.id === tourId);
        if (found) setSelectedTour(found);
      }
    })();
  }, [tourId]);

  const total = selectedTour ? selectedTour.price * numPeople : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTour || !travelDate || !fullName || !email || !phone) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor completa todos los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    const text = encodeURIComponent(
      `Hola Traveling Heart, quiero reservar:\n- Tour: ${selectedTour.name}\n- Destino: ${selectedTour.destination}\n- Fecha: ${travelDate}\n- Personas: ${numPeople}\n- Nombre: ${fullName}\n- Email: ${email}\n- Teléfono: ${phone}\n- Mensaje: ${message}\n- Total: Bs. ${total}`,
    );

    const waUrl = `https://wa.me/64292424?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSubmitting(false);
    setSuccess(true);
    toast({
      title: 'Reserva enviada a WhatsApp',
      description: 'Se abrió WhatsApp con los datos de tu reserva.',
    });
  };

  if (success) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <FaCheckCircle className="text-green-500 text-5xl" />
          </motion.div>
          <h1 className="font-display font-bold text-3xl text-brand-primary mb-3">
            ¡Reserva lista para enviar!
          </h1>
          <p className="text-brand-dark/60 mb-6">
            Se abrió WhatsApp con los datos de tu reserva. Completa el envío en el chat para confirmar.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedTour(null);
              setNumPeople(1);
              setTravelDate('');
              setFullName('');
              setEmail('');
              setPhone('');
              setMessage('');
            }}
            className="px-6 py-3 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-secondary transition-colors"
          >
            Hacer otra reserva
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-5xl sm:text-6xl mb-3"
        >
          RESERVA TU AVENTURA
        </motion.h1>
        <p className="text-xl text-white/80">Completa el formulario y vive Bolivia.</p>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            {/* Tour select */}
            <div>
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Tour seleccionado *
              </label>
              <select
                value={selectedTour?.id || ''}
                onChange={(e) => {
                  const found = tours.find((t) => t.id === e.target.value);
                  setSelectedTour(found || null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                required
              >
                <option value="">Selecciona un tour...</option>
                {tours.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Fecha de viaje *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
              {/* People */}
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Número de personas *
                </label>
                <div className="relative">
                  <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={numPeople}
                    onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Nombre completo *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Teléfono *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+591 ..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Mensaje o requisitos especiales
                </label>
                <div className="relative">
                  <FaComment className="absolute left-4 top-3 text-brand-dark/30" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={1}
                    placeholder="Alergias, movilidad reducida, etc."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-display font-bold text-xl text-brand-primary mb-5">
                Resumen del tour
              </h3>
              {selectedTour ? (
                <>
                  {selectedTour.images[0] && (
                    <div className="rounded-xl overflow-hidden mb-4 h-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedTour.images[0]}
                        alt={selectedTour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-brand-dark mb-1">
                    {selectedTour.name}
                  </h4>
                  <p className="text-brand-dark/50 text-sm mb-4">
                    {selectedTour.destination}
                  </p>
                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-brand-dark/60">
                      <span>Precio por persona</span>
                      <span>Bs. {selectedTour.price}</span>
                    </div>
                    <div className="flex justify-between text-brand-dark/60">
                      <span>Personas</span>
                      <span>{numPeople}</span>
                    </div>
                    {travelDate && (
                      <div className="flex justify-between text-brand-dark/60">
                        <span>Fecha</span>
                        <span>
                          {new Date(travelDate).toLocaleDateString('es-BO')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-brand-primary text-lg pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span>Bs. {total}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-brand-dark/40 text-sm text-center py-8">
                  Selecciona un tour para ver el resumen
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
