'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaMapMarkerAlt, FaClock, FaArrowRight, FaSearch } from 'react-icons/fa';
import { supabase, type Tour } from '@/lib/supabase';

const categories = ['Todos', 'Aventura', 'Cultura', 'Naturaleza', 'Gastronomía'];

export default function DestinosPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filtered, setFiltered] = useState<Tour[]>([]);
  const [active, setActive] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'activo')
        .order('created_at', { ascending: false });
      setTours((data as Tour[]) || []);
      setFiltered((data as Tour[]) || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let result = tours;
    if (active !== 'Todos') {
      result = result.filter((t) => t.category === active);
    }
    if (search) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.destination.toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFiltered(result);
  }, [active, search, tours]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative bg-gradient-to-br bg-black text-white text-center">
        <div className="absolute bg-[url(/salaruyuni.jpg)] z-0 w-full h-full opacity-50 bg-cover bg-center bg-no-repeat" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
        >
          <h1 className="font-display font-bold text-5xl sm:text-6xl mb-4">
            NUESTROS DESTINOS
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explora Bolivia con nosotros. Elige tu próxima aventura.
          </p>
        </motion.div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative w-full lg:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
              <input
                type="text"
                placeholder="Buscar destino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    active === cat
                      ? 'bg-brand-accent text-brand-dark shadow-lg scale-105'
                      : 'bg-brand-accent/15 text-brand-dark hover:bg-brand-accent/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-brand-dark/50">
              <p className="text-lg">No se encontraron destinos.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((tour, i) => (
                  <motion.div
                    key={tour.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow group">
                      <div className="relative h-56 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tour.images[0]}
                          alt={tour.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase">
                            {tour.category}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-brand-primary text-white rounded-full text-xs font-bold">
                            Desde Bs. {tour.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-brand-secondary text-sm mb-2">
                          <FaMapMarkerAlt />
                          <span>{tour.destination}</span>
                        </div>
                        <h3 className="font-display font-bold text-xl text-brand-dark mb-2">
                          {tour.name}
                        </h3>
                        <p className="text-brand-dark/60 text-sm line-clamp-2 mb-4">
                          {tour.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-brand-dark/50 text-sm">
                            <FaClock />
                            <span>{tour.duration}</span>
                          </div>
                          <Link
                            href={`/tours/${tour.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-full text-sm font-semibold hover:bg-brand-primary transition-colors"
                          >
                            Ver Tours <FaArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
