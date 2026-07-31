'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaMapMarkerAlt, FaClock, FaArrowRight, FaStar } from 'react-icons/fa';
import { supabase, type Tour } from '@/lib/supabase';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'activo')
        .order('created_at', { ascending: false });
      setTours((data as Tour[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pt-20">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4">
            NUESTROS TOURS
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Cada tour es una experiencia única diseñada con pasión y cuidado.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {tours.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/tours/${tour.id}`} className="group block">
                    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow">
                      <div className="relative h-64 md:h-80 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tour.images[0]}
                          alt={tour.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase">
                            {tour.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-brand-secondary text-sm mb-3">
                          <FaMapMarkerAlt />
                          <span>{tour.destination}</span>
                        </div>
                        <h2 className="font-display font-bold text-2xl text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                          {tour.name}
                        </h2>
                        <p className="text-brand-dark/60 text-sm line-clamp-3 mb-5">
                          {tour.description}
                        </p>
                        <div className="flex items-center gap-4 mb-5 text-sm text-brand-dark/50">
                          <span className="flex items-center gap-2">
                            <FaClock /> {tour.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {[1,2,3,4,5].map((s) => (
                              <FaStar key={s} className="text-brand-accent text-xs" />
                            ))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-brand-dark/50 text-sm">Desde</span>
                            <div className="font-display font-bold text-3xl text-brand-primary">
                              ${tour.price}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full text-sm font-semibold group-hover:bg-brand-secondary transition-colors">
                            Ver Detalle <FaArrowRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
