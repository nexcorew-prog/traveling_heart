'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaHeart, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Destinos', href: '/destinos' },
  { name: 'Tours', href: '/tours' },
  { name: 'Galería', href: '/galeria' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(45,45,45,0.14)]'
          : 'bg-white/55 backdrop-blur-md shadow-[0_4px_22px_rgba(45,45,45,0.10)] z-70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2"
            >
              {/* <div className="relative">
                <FaHeart className="text-brand-primary text-2xl" />
                <motion.div
                  className="absolute inset-0 text-brand-primary text-2xl"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaHeart />
                </motion.div>
              </div>
              <span className="font-display font-bold text-xl text-brand-dark tracking-tight drop-shadow-sm">
                Traveling <span className="text-brand-primary">Heart</span>
              </span> */}
              <Image src="/logo.png" alt="Traveling Heart" width={80} height={80} />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-brand-primary'
                    : 'text-brand-dark drop-shadow-sm hover:text-brand-primary'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              href="/reservas"
              className="ml-3 px-6 py-2.5 bg-brand-primary text-white rounded-full text-sm font-semibold ring-1 ring-white/50 shadow-lg shadow-brand-primary/40 hover:bg-brand-secondary transition-all hover:shadow-xl hover:scale-105"
            >
              Reserva Ahora
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-brand-dark"
            aria-label="Menú"
          >
            {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-brand-dark hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/reservas"
                className="block mt-2 px-4 py-3 bg-brand-primary text-white rounded-lg text-center text-sm font-semibold"
              >
                Reserva Ahora
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
