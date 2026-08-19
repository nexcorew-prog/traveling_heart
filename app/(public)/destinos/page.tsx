'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { FaMapMarkerAlt, FaClock, FaArrowRight, FaSearch } from 'react-icons/fa';
import { supabase, type Tour } from '@/lib/supabase';

function DestinationCard({ tour, index }: { tour: Tour; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const direction = index % 2 === 0 ? -1 : 1;
  const tilt = index % 2 === 0 ? -2 : 2;

  return (
    <motion.div
      ref={ref}
      layout
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
          : { opacity: 0, x: direction * 30, y: 24, rotate: tilt, scale: 0.94 }
      }
      exit={{ opacity: 0, y: -18, scale: 0.96 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={{ y: -10, x: 2, scale: 1.02, rotate: 0.7 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow group">
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
              Desde $ {tour.price}
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
  );
}

export default function DestinosPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filtered, setFiltered] = useState<Tour[]>([]);
  const [active, setActive] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'Todos',
    ...Array.from(new Set(tours.map((tour) => tour.category).filter(Boolean))).slice(-4),
  ];

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
      <section className="relative bg-gradient-to-br bg-black text-white text-center overflow-hidden">
        <div className="absolute bg-[url(/salaruyuni.jpg)] z-0 w-full h-full opacity-50 bg-cover bg-center bg-no-repeat" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="font-display font-bold text-5xl sm:text-6xl mb-4"
          >
            NUESTROS DESTINOS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Explora Bolivia con nosotros. Elige tu próxima aventura.
          </motion.p>
        </motion.div>
      </section>

      {/* Filters + Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12"
          >
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
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    active === cat
                      ? 'bg-brand-accent text-brand-dark shadow-lg scale-105'
                      : 'bg-brand-accent/15 text-brand-dark hover:bg-brand-accent/30'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center py-20 text-brand-dark/50"
            >
              <p className="text-lg">No se encontraron destinos.</p>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16">
              <AnimatePresence mode="popLayout">
                {filtered.map((tour, i) => (
                  <DestinationCard key={tour.id} tour={tour} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
