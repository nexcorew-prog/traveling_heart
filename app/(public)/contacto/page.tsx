'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTag,
  FaComment,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ContactoPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !message) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor completa los campos obligatorios.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('contacts').insert({
      full_name: fullName,
      email,
      phone,
      subject,
      message,
      status: 'nuevo',
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Mensaje enviado',
      description: 'Te responderemos lo antes posible.',
    });
    setFullName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="pt-20">
      <section className="relative bg-black text-white text-center">
        <div className="absolute bg-[url(/salaruyuni.jpg)] z-0 w-full h-full opacity-50 bg-cover bg-center bg-no-repeat" />
        <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-5xl sm:text-6xl mb-3"
          >
            CONTÁCTANOS
          </motion.h1>
          <p className="text-xl text-white/80">
            Estamos aquí para ayudarte a planificar tu próxima aventura.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl text-brand-primary mb-2">
              Envíanos un mensaje
            </h2>
            <p className="text-brand-dark/60 mb-8">
              Completa el formulario y te responderemos en menos de 30 minutos.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Email *
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
                    Teléfono
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+591 ..."
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Asunto *
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="¿Sobre qué nos escribes?"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Mensaje *
                </label>
                <div className="relative">
                  <FaComment className="absolute left-4 top-4 text-brand-dark/30" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Cuéntanos sobre tu viaje..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors resize-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </motion.div>

          {/* Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-orange-50/50 rounded-2xl p-8">
              <h3 className="font-display font-bold text-xl text-brand-primary mb-5">
                Información de contacto
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">Dirección</p>
                    <p className="text-brand-dark/60 text-sm">
                      Calle Sagarnaga 123, La Paz, Bolivia
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FaPhone className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">Teléfono</p>
                    <p className="text-brand-dark/60 text-sm">+591 758 421 09</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FaWhatsapp className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">WhatsApp</p>
                    <a
                      href="https://wa.me/59175842109"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-dark/60 text-sm hover:text-brand-primary"
                    >
                      Chatea con nosotros
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <FaClock className="text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">Horario</p>
                    <p className="text-brand-dark/60 text-sm">
                      Lun - Sáb: 8:00 - 20:00
                      <br />
                      Dom: 9:00 - 14:00
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-md h-64 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-brand-primary text-4xl mx-auto mb-2" />
                <p className="text-brand-dark/60 text-sm font-medium">
                  La Paz, Bolivia
                </p>
                <p className="text-brand-dark/40 text-xs">
                  Mapa interactivo disponible próximamente
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
