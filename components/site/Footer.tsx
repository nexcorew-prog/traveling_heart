'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  FaHeart,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,

  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaEnvelope,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FaHeart className="text-white text-2xl" />
              <span className="font-display font-bold text-xl">
                Traveling Heart
              </span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Experiencias auténticas en La Paz, Bolivia. Viaja con el corazón
              y descubre lo más profundo de la cultura andina.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: FaFacebookF, url: 'https://www.facebook.com/share/17CMH1mynD/' },
                { Icon: FaInstagram, url: 'https://www.instagram.com/traveling_heart1?igsh=NXY3Y2drOWQwOWUw' },
                { Icon: FaTiktok, url: 'https://www.tiktok.com/@traveling_heart1/' },
                { Icon: FaWhatsapp, url: 'https://wa.me/64292424' },
              ].map(
                ({ Icon, url }, i) => (
                  <motion.a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:bg-brand-accent hover:text-brand-dark transition-colors"
                  >
                    <Icon size={16} />
                  </motion.a>
                ),
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-brand-accent">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Nosotros', href: '/nosotros' },
                { name: 'Destinos', href: '/destinos' },
                { name: 'Tours', href: '/tours' },
                { name: 'Galería', href: '/galeria' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-brand-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-brand-accent">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-brand-accent shrink-0" />
                <span>las brujas, C/ Jose, Linares y, La Paz</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-brand-accent shrink-0" />
                <span>+591 758 421 09</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-brand-accent shrink-0" />
                <span>travelingh69@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaClock className="mt-1 text-brand-accent shrink-0" />
                <span>
                  Lun - Sáb: 9:00 - 19:30
                  <br />
                  Dom: 9:00 - 18:00
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-brand-accent">
              Recibe nuestras ofertas
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Suscríbete y recibe los mejores planes de viaje en tu correo.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Tu correo"
                className="px-4 py-2.5 rounded-lg bg-white/15 text-white placeholder-white/50 text-sm outline-none focus:bg-white/25 transition-colors"
              />
              <button className="px-4 py-2.5 bg-brand-accent text-brand-dark rounded-lg text-sm font-semibold hover:bg-white transition-colors">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/70">
          <p>
            © {new Date().getFullYear()} Traveling Heart. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="hover:text-brand-accent transition-colors">
              Acceso Admin
            </Link>
            <a href="#" className="hover:text-brand-accent transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
