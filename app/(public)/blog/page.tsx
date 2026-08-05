'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { supabase, type BlogPost } from '@/lib/supabase';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_date', { ascending: false });
      setPosts((data as BlogPost[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="pt-20">
      <section className="relative bg-black text-white text-center">
        <div className="absolute bg-[url(/salaruyuni.jpg)] z-0 w-full h-full opacity-50 bg-cover bg-center bg-no-repeat" />
        <div className="relative z-10  py-16 px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-5xl sm:text-6xl mb-3"
        >
          BLOG DE VIAJES
        </motion.h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Consejos, historias y guías para que aproveches al máximo tu viaje por
          Bolivia.
        </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href="/blog" className="group block">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow h-full flex flex-col">
                      <div className="h-52 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs text-brand-dark/50 mb-3">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt />
                            {new Date(post.published_date).toLocaleDateString('es-BO', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUser /> {post.author}
                          </span>
                        </div>
                        <h2 className="font-display font-bold text-xl text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-brand-dark/60 text-sm line-clamp-3 mb-5 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-brand-accent/20 text-brand-dark rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-2 text-brand-secondary font-semibold text-sm group-hover:gap-3 transition-all">
                          Leer más <FaArrowRight />
                        </span>
                      </div>
                    </article>
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
