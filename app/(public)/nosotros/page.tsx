'use client';

import { motion } from 'motion/react';

export default function NosotrosPage() {
  return (
    <div className="pt-20">
      <section className="relative bg-[url('/salaruyuni.jpg')] bg-cover bg-center bg-no-repeat text-white">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl sm:text-6xl font-bold mb-4"
          >
            Sobre Nosotros
          </motion.h1>
          <p className="mx-auto max-w-3xl text-lg text-white/80">
            Traveling Heart Tour Operadora ofrece experiencias turísticas seguras,
            auténticas y de alta calidad en Bolivia. Conectamos viajeros con la
            naturaleza, la cultura y las tradiciones del país.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white text-brand-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-4 py-1 text-sm font-semibold text-brand-primary">
                Traveling Heart Tour Operadora
              </span>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-brand-dark">
                Presentación
              </h2>
              <p className="mt-4 text-base leading-8 text-brand-dark/75">
                Traveling Heart Tour Operadora es una empresa boliviana dedicada a brindar experiencias turísticas seguras, auténticas y de alta calidad. Nuestro objetivo es promover el turismo nacional e internacional, mostrando la riqueza natural, cultural e histórica de Bolivia y contribuyendo al desarrollo de las comunidades locales.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-xl">
              <h3 className="font-display text-xl font-semibold text-brand-primary mb-4">
                Datos clave
              </h3>
              <ul className="space-y-4 text-sm text-brand-dark/75">
                <li>
                  <strong className="text-brand-dark">Misión:</strong> Brindar servicios turísticos de calidad, seguros y personalizados, promoviendo el turismo sostenible en Bolivia mediante experiencias inolvidables que conecten a nuestros viajeros con la naturaleza, la cultura y las tradiciones del país.
                </li>
                <li>
                  <strong className="text-brand-dark">Visión:</strong> Ser una de las tour operadoras líderes de Bolivia, reconocida por la excelencia de nuestros servicios, la innovación, la responsabilidad social y el compromiso con el desarrollo del turismo sostenible.
                </li>
                <li>
                  <strong className="text-brand-dark">Valores:</strong> Responsabilidad, Honestidad, Calidad, Respeto por la cultura y el medio ambiente, Trabajo en equipo, Innovación y Compromiso con el cliente.
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-3xl font-bold text-brand-dark">
                Objetivo General
              </h3>
              <p className="mt-4 text-base leading-8 text-brand-dark/75">
                Posicionar a Traveling Heart Tour Operadora como una empresa confiable y competitiva, ofreciendo servicios turísticos que satisfagan las necesidades de turistas nacionales e internacionales.
              </p>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold text-brand-dark">
                Objetivos Específicos
              </h3>
              <ul className="mt-6 space-y-4 text-brand-dark/75 list-disc list-inside">
                <li>Diseñar paquetes turísticos innovadores.</li>
                <li>Incrementar la cartera de clientes.</li>
                <li>Establecer alianzas estratégicas.</li>
                <li>Promover el turismo sostenible.</li>
                <li>Garantizar la satisfacción del cliente.</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-xl">
              <h4 className="font-display text-xl font-semibold text-brand-primary mb-4">Actividades</h4>
              <p className="text-brand-dark/75 leading-7">
                Diseño y promoción de paquetes turísticos; publicidad en redes sociales; atención personalizada; organización de excursiones; capacitación del personal; evaluación de la satisfacción del cliente.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-xl">
              <h4 className="font-display text-xl font-semibold text-brand-primary mb-4">Cronograma</h4>
              <ul className="space-y-3 text-brand-dark/75 leading-7">
                <li>Primer trimestre: diseño de paquetes.</li>
                <li>Segundo trimestre: campañas de promoción.</li>
                <li>Tercer trimestre: evaluación y capacitación.</li>
                <li>Cuarto trimestre: evaluación anual y planificación.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-8 shadow-xl">
              <h4 className="font-display text-xl font-semibold text-brand-primary mb-4">Resultados Esperados</h4>
              <p className="text-brand-dark/75 leading-7">
                Incremento de clientes, mayor presencia de marca, satisfacción del cliente, fortalecimiento de alianzas y crecimiento sostenible.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-brand-primary/5 p-10 shadow-xl">
            <h3 className="font-display text-3xl font-bold text-brand-dark mb-4">Conclusión</h3>
            <p className="text-brand-dark/75 leading-8">
              Traveling Heart Tour Operadora busca consolidarse como una empresa referente del turismo en Bolivia, ofreciendo experiencias memorables y contribuyendo al desarrollo del turismo sostenible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
