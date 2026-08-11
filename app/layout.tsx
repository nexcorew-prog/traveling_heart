import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Traveling Heart | Experiencias auténticas en La Paz, Bolivia',
  description:
    'Viaja con el corazón. Tours auténticos en La Paz, Tiwanaku, Yungas, Salar de Uyuni y Lago Titicaca. Guías locales, tours personalizados y precios justos.',
  keywords: [
    'La Paz Bolivia',
    'turismo Bolivia',
    'Salar de Uyuni',
    'Lago Titicaca',
    'Yungas',
    'Tiwanaku',
    'tours La Paz',
    'Traveling Heart',
  ],
  openGraph: {
    title: 'Traveling Heart | Experiencias auténticas en La Paz, Bolivia',
    description:
      'Viaja con el corazón. Tours auténticos en La Paz, Tiwanaku, Yungas, Salar de Uyuni y Lago Titicaca.',
    type: 'website',
    locale: 'es_BO',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
