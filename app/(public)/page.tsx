'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  FaUsers,
  FaThumbsUp,
  FaAward,
  FaClock,
  FaHeart,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaHandshake,
  FaRoute,
} from 'react-icons/fa';
import { supabase, type Tour, type Testimonial, type BlogPost } from '@/lib/supabase';

const heroSlides = [
  'https://images.pexels.com/photos/30929501/pexels-photo-30929501.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/36303146/pexels-photo-36303146.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/7406503/pexels-photo-7406503.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

const whyUs = [
  {
    icon: FaUsers,
    title: 'Guías locales y apasionados',
    desc: 'Nuestros guías nacieron en estas tierras y conocen cada rincón, cada historia y cada secreto.',
  },
  {
    icon: FaRoute,
    title: 'Tours personalizados',
    desc: 'Adaptamos cada experiencia a tus intereses, ritmo y presupuesto. Tu viaje, tu manera.',
  },
  {
    icon: FaShieldAlt,
    title: 'Seguridad y confianza',
    desc: 'Equipos certificados, vehículos revisados y protocolos de seguridad en cada aventura.',
  },
  {
    icon: FaHandshake,
    title: 'Precios justos y transparentes',
    desc: 'Sin costos ocultos. El precio que ves es el precio que pagas, con todo incluido.',
  },
];

const stats = [
  { icon: FaUsers, value: '+2,500', label: 'Viajeros que confían en nosotros' },
  { icon: FaThumbsUp, value: '98%', label: 'De clientes nos recomiendan' },
  { icon: FaAward, value: '+15', label: 'Años de experiencia en turismo' },
  { icon: FaClock, value: '<30 min', label: 'Respuesta por WhatsApp' },
];

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [toursRes, testRes, blogRes] = await Promise.all([
        supabase.from('tours').select('*').eq('featured', true).limit(3),
        supabase.from('testimonials').select('*').limit(5),
        supabase.from('blog_posts').select('*').order('published_date', { ascending: false }).limit(3),
      ]);
      setFeaturedTours((toursRes.data as Tour[]) || []);
      setTestimonials((testRes.data as Testimonial[]) || []);
      setBlogPosts((blogRes.data as BlogPost[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-10">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1400}
            loop
            className="relative inset-0 z-0 w-full h-full"
          >
            {heroSlides.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className="hero-slide w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${img})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hero-overlay-enhanced absolute inset-0 z-10 pointer-events-none" />

        <div className="relative z-30 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6">
                <FaHeart className="text-brand-accent" />
                <span className="text-white text-sm font-medium">
                  Agencia de turismo en La Paz, Bolivia
                </span>
              </div>
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6 text-balance">
                Viaja con el{' '}
                <span className="text-brand-accent">corazón</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experiencias auténticas en Bolivia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/destinos"
                  className="px-8 py-4 bg-brand-primary text-white rounded-full font-semibold text-lg shadow-xl shadow-brand-primary/40 hover:bg-brand-secondary transition-all hover:scale-105"
                >
                  Ver Destinos
                </Link>
                <Link
                  href="/contacto"
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-brand-primary transition-all"
                >
                  Contáctanos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DESTINOS DESTACADOS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-2">
              Descubre Bolivia
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-brand-primary mb-4">
              DESTINOS QUE TE ESPERAN
            </h2>
            <p className="text-brand-dark/60 max-w-2xl mx-auto">
              Los lugares más extraordinarios de Bolivia, cuidadosamente
              seleccionados para vivir una experiencia inolvidable.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTours.map((tour, i) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="group block">
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                      <Link
                        href={`/tours/${tour.id}`}
                        aria-label={`Ver tour ${tour.name}`}
                        className="absolute inset-0 z-10"
                      />
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${tour.images[0]})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase tracking-wide">
                          {tour.category}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-6 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                          <FaMapMarkerAlt />
                          <span>{tour.destination}</span>
                        </div>
                        <h3 className="font-display font-bold text-2xl mb-2">
                          {tour.name}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">
                          {tour.description}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm group-hover:gap-3 transition-all">
                            Ver Tours <FaArrowRight />
                          </span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              const text = encodeURIComponent(
                                `Hola Traveling Heart, quiero consultar la disponibilidad del tour ${tour.name} en ${tour.destination}`,
                              );
                              window.open(
                                `https://wa.me/64292424?text=${text}`,
                                '_blank',
                                'noopener,noreferrer'
                              );
                            }}
                            className="pointer-events-auto inline-flex shrink-0 items-center rounded-full bg-brand-accent px-3 py-2 text-xs font-bold text-brand-dark transition-transform hover:scale-105"
                          >
                            Consultar disponibilidad
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us-scene relative isolate overflow-hidden bg-gradient-to-b from-orange-50/70 to-white">
        <div className="absolute bg-[url(https://images.pexels.com/photos/36303146/pexels-photo-36303146.jpeg?auto=compress&cs=tinysrgb&w=1920)] z-0 w-full h-full" />
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-2">
              Por qué elegirnos
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-brand-primary mb-4">
              Por qué Traveling Heart
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/70 bg-white/55 p-8 shadow-[0_16px_42px_rgba(75,47,24,0.18)] backdrop-blur-md hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary flex items-center justify-center">
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-display font-semibold text-lg text-brand-dark mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-scene relative isolate overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
        <div className="stats-scene-image" />
        <div className="stats-scene-light" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="text-brand-accent text-3xl mx-auto mb-3" />
                <div className="font-display font-bold text-4xl sm:text-5xl mb-2">
                  {stat.value}
                </div>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-scene relative isolate overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="testimonials-orb testimonials-orb-one" />
        <div className="testimonials-orb testimonials-orb-two" />
        <div className="testimonials-orb testimonials-orb-three" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-2">
              Testimonios
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-brand-primary mb-4">
              Lo que dicen nuestros viajeros
            </h2>
          </motion.div>

          {testimonials.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((t) => (
                  <div key={t.id} className="rounded-3xl border border-white/70 bg-white/65 p-8 shadow-[0_18px_50px_rgba(89,56,29,0.10)] backdrop-blur-xl h-full flex flex-col transition-transform duration-300 hover:-translate-y-1">
                    <FaQuoteLeft className="text-brand-accent text-3xl mb-4" />
                    <p className="text-brand-dark/70 leading-relaxed flex-1 mb-6">
                      "{t.comment}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-primary/10 shrink-0">
                        {t.avatar && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-brand-dark">
                          {t.name}
                        </h4>
                        <p className="text-brand-secondary text-sm">
                          {t.destination}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <FaStar key={i} className="text-brand-accent text-xs" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-orange-50/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-secondary font-semibold text-sm uppercase tracking-widest mb-2">
              Blog y consejos
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-brand-primary mb-4">
              Consejos para tu viaje
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/blog" className="group block">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-brand-secondary text-xs font-medium mb-2">
                        {new Date(post.published_date).toLocaleDateString('es-BO', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <h3 className="font-display font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-brand-dark/60 text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all">
                        Leer más <FaArrowRight />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
