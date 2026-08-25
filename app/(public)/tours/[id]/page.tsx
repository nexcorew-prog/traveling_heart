'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheck,
  FaCalendarAlt,
  FaChevronDown,
  FaArrowRight,
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase, type Tour } from '@/lib/supabase';

const faqs = [
  {
    q: '¿Qué debo llevar al tour?',
    a: 'Recomendamos llevar ropa abrigada (temperaturas pueden bajar de 0°C), protector solar, gafas de sol, agua, cámara y calzado cómodo. Para tours de varios días, incluye ropa de cambio.',
  },
  {
    q: '¿Cuál es la política de cancelación?',
    a: 'Cancelaciones con más de 7 días de anticipación: reembolso del 100%. Entre 3 y 7 días: 50%. Menos de 48 horas: no reembolsable. Por clima extremo, reprogramamos sin costo.',
  },
  {
    q: '¿Necesito experiencia previa?',
    a: 'No. La mayoría de nuestros tours son aptos para todos los niveles. Los tours de aventura tienen opciones para principiantes y avanzados.',
  },
  {
    q: '¿El precio incluye todo?',
    a: 'Sí, el precio incluye transporte, guía, entradas, alimentación según el itinerario y seguro. No incluye gastos personales ni propinas.',
  },
  {
    q: '¿Puedo viajar con niños?',
    a: '¡Por supuesto! Contamos con tarifas especiales para niños y adaptamos las actividades para familias. Consulta al hacer tu reserva.',
  },
];

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setTour(data as Tour | null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-display text-3xl text-brand-primary mb-4">
            Tour no encontrado
          </h1>
          <p className="text-brand-dark/60 mb-6">
            El tour que buscas no existe o no está disponible.
          </p>
          <button
            onClick={() => router.push('/tours')}
            className="px-6 py-3 bg-brand-primary text-white rounded-full font-semibold"
          >
            Ver todos los tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Gallery */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(119,64,16,0.16)] bg-white">
              <motion.img
                key={activeImage}
                src={tour.images[activeImage]}
                alt={`${tour.name} - ${activeImage + 1}`}
                initial={{ opacity: 0, scale: 1.08, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full h-[400px] sm:h-[550px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase">
                  {tour.category}
                </span>
                <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                  {tour.destination}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {tour.images.map((img, i) => (
                <motion.button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImage === i ? 'border-brand-primary shadow-md' : 'border-transparent opacity-80'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${tour.name} - vista ${i + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase">
                  {tour.category}
                </span>
                <span className="flex items-center gap-1 text-brand-secondary text-sm">
                  <FaMapMarkerAlt /> {tour.destination}
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl text-brand-dark mb-4">
                {tour.name}
              </h1>
              <div className="flex items-center gap-5 text-sm text-brand-dark/60 mb-6">
                <span className="flex items-center gap-2">
                  <FaClock /> {tour.duration}
                </span>
                <span className="flex items-center gap-2">
                  <FaStar className="text-brand-accent" /> 
                </span>
                <span className="flex items-center gap-2">
                  <FaUsers /> Grupo pequeño
                </span>
              </div>
              <p className="text-brand-dark/70 leading-relaxed text-lg">
                {tour.description}
              </p>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h2 className="font-display font-bold text-2xl text-brand-primary mb-5">
                {tour.itinerary.length > 0 ? 'Itinerario' : ''}
              </h2>
              <div className="space-y-4">
                {tour.itinerary.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -22, y: 10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-orange-50/50 rounded-xl p-4">
                      <p className="text-brand-dark/80 text-sm leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Includes */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h2 className="font-display font-bold text-2xl text-brand-primary mb-5">
                Qué incluye
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {tour.includes.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95, x: i % 2 === 0 ? -8 : 8 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: i * 0.06, duration: 0.42, ease: 'easeOut' }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <FaCheck className="text-brand-primary text-sm" />
                    </div>
                    <span className="text-brand-dark/70 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {tour.excludes?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <h2 className="font-display font-bold text-2xl text-brand-primary mb-5">
                  No incluye
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tour.excludes.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, x: i % 2 === 0 ? -8 : 8 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ delay: i * 0.06, duration: 0.42, ease: 'easeOut' }}
                      className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-accent/30 flex items-center justify-center shrink-0">
                        <span className="text-brand-dark text-sm font-bold">-</span>
                      </div>
                      <span className="text-brand-dark/70 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h2 className="font-display font-bold text-2xl text-brand-primary mb-5">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border border-gray-200 rounded-xl px-5 !border-b"
                  >
                    <AccordionTrigger className="text-brand-dark font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-brand-dark/60 text-sm leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="sticky top-28 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="text-center mb-6">
                <p className="text-brand-dark/50 text-sm">Precio por persona</p>
                <div className="font-display font-bold text-4xl text-brand-primary my-1">
                  {tour.price}$
                </div>
                <div className="flex items-center justify-center gap-1 text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                  
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl">
                  <FaClock className="text-brand-primary" />
                  <span className="text-sm text-brand-dark/70">
                    {tour.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl">
                  <FaMapMarkerAlt className="text-brand-primary" />
                  <span className="text-sm text-brand-dark/70">
                    {tour.destination}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl">
                  <FaCalendarAlt className="text-brand-primary" />
                  <span className="text-sm text-brand-dark/70">
                    Fechas disponibles
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-brand-dark mb-2">
                  Próximas fechas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tour.available_dates.slice(0, 4).map((date) => (
                    <span
                      key={date}
                      className="px-3 py-1.5 bg-brand-accent/20 text-brand-dark rounded-lg text-xs font-medium"
                    >
                      {new Date(date).toLocaleDateString('es-BO', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() =>
                  router.push(`/reservas?tour=${tour.id}`)
                }
                className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-secondary transition-all hover:scale-[1.02]"
              >
                Reservar este Tour
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
