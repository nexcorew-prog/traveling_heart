'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaTimes } from 'react-icons/fa';
import { supabase, type GalleryImage } from '@/lib/supabase';

const categories = ['Todos', 'paisaje', 'aventura', 'cultura', 'gastronomia'];

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filtered, setFiltered] = useState<GalleryImage[]>([]);
  const [active, setActive] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      setImages((data as GalleryImage[]) || []);
      setFiltered((data as GalleryImage[]) || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (active === 'Todos') setFiltered(images);
    else setFiltered(images.filter((img) => img.category === active));
  }, [active, images]);

  return (
    <div className="pt-20">
      <section className="relative bg-black text-white text-center">
        <div className="absolute bg-[url(/salaruyuni.jpg)] z-0 w-full h-full opacity-50 bg-cover bg-center bg-no-repeat" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-5xl sm:text-6xl mb-3 pt-16 px-4 sm:px-6 lg:px-8 z-10 relative"
        >
          GALERÍA DE FOTOS
        </motion.h1>
        <p className="text-xl text-white/80 pb-16 relative z-10 px-4 sm:px-6 lg:px-8">
          Mira la belleza de Bolivia a través de nuestros viajeros.
        </p>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${
                  active === cat
                    ? 'bg-brand-accent text-brand-dark shadow-lg scale-105'
                    : 'bg-brand-accent/15 text-brand-dark hover:bg-brand-accent/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              <AnimatePresence>
                {filtered.map((img, i) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03 }}
                    className="break-inside-avoid mb-4 relative group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow"
                    onClick={() => setLightbox(img.image_url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="text-white">
                        <p className="font-semibold text-sm">{img.title}</p>
                        <p className="text-xs text-white/70 capitalize">
                          {img.category}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white text-2xl"
            >
              <FaTimes />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={lightbox}
              alt="Galería"
              className="max-w-full max-h-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
