import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { content } from '../data/content'
import { media } from '../data/media'
import ArrowButton from '../components/ArrowButton'

const ease = [0.16, 1, 0.3, 1] as const

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="shell min-h-[100dvh] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]
                 gap-10 lg:gap-16 items-center pt-28 pb-16 lg:py-24"
      aria-label="Presentación"
    >
      {/* Texto */}
      <div className="order-2 lg:order-1">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 mb-7"
        >
          {content.available && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full bg-[var(--accent)] opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 bg-[var(--accent)]" />
            </span>
          )}
          <p className="text-[var(--text-muted)] text-[11px] tracking-[0.22em] uppercase">
            {content.available ? 'Disponible para proyectos' : content.role}
          </p>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease }}
          style={{ textWrap: 'balance' } as React.CSSProperties}
          className="text-[clamp(2.75rem,6vw,5.25rem)] font-semibold
                     leading-[0.95] tracking-[-0.025em]
                     text-[var(--text)] whitespace-pre-line mb-7"
        >
          {content.hero.headline}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease }}
          className="text-[var(--text-muted)] text-base md:text-[1.0625rem]
                     max-w-[46ch] leading-[1.65] mb-10"
        >
          {content.hero.subheadline}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease }}
          className="flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <ArrowButton to={content.hero.ctaLink} variant="solid">
            {content.hero.ctaLabel}
          </ArrowButton>
          <Link
            to="/contacto"
            className="text-[var(--text-muted)] text-sm tracking-wide
                       hover:text-[var(--text)] transition-colors duration-200"
          >
            Contacto
          </Link>
        </motion.div>
      </div>

      {/* Retrato — visible también en móvil */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease }}
        className="order-1 lg:order-2 relative overflow-hidden                   bg-[var(--bg-raised)] aspect-[4/5] lg:aspect-[3/4]"
      >
        <img
          src={media.hero.portrait}
          alt={content.name}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </motion.div>
    </section>
  )
}

// ─── Selected Work ────────────────────────────────────────────────────────────

function WorkCard({
  project,
  className = '',
  delay = 0,
}: {
  project: (typeof media.projects)[number]
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease }}
      className={`group relative overflow-hidden bg-[var(--bg-raised)] ${className}`}
    >
      <Link to="/proyectos" className="block w-full h-full">
        <img
          src={project.coverImage}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[var(--accent)] text-[11px] tracking-[0.2em] uppercase mb-1.5">
              {project.category}
            </p>
            <p className="text-white text-lg md:text-xl font-medium tracking-[-0.01em]">
              {project.title}
            </p>
          </div>
          <span className="text-white/50 text-xs tabular-nums shrink-0">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  )
}

function SelectedWork() {
  const reduce = useReducedMotion()
  const [a, b, c] = media.projects

  return (
    <section className="shell py-20 md:py-28" aria-label="Proyectos seleccionados">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease }}
        className="flex items-baseline justify-between gap-4 mb-8 md:mb-12"
      >
        <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.025em]">
          Trabajo seleccionado
        </h2>
        <Link
          to="/proyectos"
          className="shrink-0 text-[var(--text-muted)] text-sm tracking-wide
                     hover:text-[var(--accent)] transition-colors duration-200"
        >
          Ver todos
        </Link>
      </motion.div>

      {/* Grid asimétrico: 1 alto a la izquierda + 2 apilados a la derecha */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 md:gap-4 md:auto-rows-fr md:h-[640px]">
        <WorkCard project={a} className="md:row-span-2 min-h-[420px] md:min-h-0" />
        <WorkCard project={b} className="min-h-[260px] md:min-h-0" delay={0.1} />
        <WorkCard project={c} className="min-h-[260px] md:min-h-0" delay={0.18} />
      </div>
    </section>
  )
}

// ─── Showreel (contenido, no a pantalla completa) ─────────────────────────────

function Showreel() {
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()
  const { youtubeId, poster } = media.reel

  return (
    <section className="shell pb-20 md:pb-28" aria-label="Showreel">
      <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-center">
        {/* Texto */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-4">
            Showreel 2024
          </p>
          <h2 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold tracking-[-0.02em] mb-4 leading-tight">
            Un minuto de movimiento.
          </h2>
          <p className="text-[var(--text-muted)] text-base leading-[1.65] max-w-[42ch]">
            Una selección de piezas de motion design, animación y dirección de arte de los últimos dos años.
          </p>
        </motion.div>

        {/* Vídeo contenido con fachada (carga sólo al pulsar) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="relative w-full overflow-hidden bg-[var(--bg-raised)]"
          style={{ aspectRatio: '16 / 9' }}
        >
          {playing ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title="Showreel"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full flex items-center justify-center"
              aria-label="Reproducir showreel"
            >
              <img
                src={poster}
                alt="Portada del showreel"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/25" />
              <div className="relative z-10 flex items-center justify-center
                              w-14 h-14 md:w-16 md:h-16                              bg-[var(--accent)] text-[var(--accent-ink)]
                              transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 ml-0.5" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ─── About teaser ─────────────────────────────────────────────────────────────

function AboutTeaser() {
  const reduce = useReducedMotion()
  const { intro, skills } = content.about

  return (
    <section className="shell border-t border-[var(--border)] py-20 md:py-28" aria-label="Sobre mí">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-start">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease }}
        >
          <p
            style={{ textWrap: 'balance' } as React.CSSProperties}
            className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.35] tracking-[-0.015em] text-[var(--text)] max-w-[24ch]"
          >
            {intro}
          </p>
          <Link
            to="/sobre-mi"
            className="group inline-flex items-center gap-3 mt-8
                       text-[var(--accent)] text-sm tracking-[0.16em] uppercase
                       transition-colors duration-200"
          >
            Sobre mí
            <span className="block w-8 h-px bg-[var(--accent)] transition-[width] duration-300 group-hover:w-12" />
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
        >
          <p className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-5">
            Herramientas
          </p>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="px-3.5 py-1.5 border border-[var(--border-mid)]
                           text-[var(--text-muted)] text-[0.8125rem] tracking-wide"
              >
                {skill}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Contacto CTA ─────────────────────────────────────────────────────────────

function ContactCTA() {
  const reduce = useReducedMotion()
  return (
    <section className="shell border-t border-[var(--border)] py-24 md:py-32" aria-label="Contacto">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
        className="text-center"
      >
        <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-semibold tracking-[-0.03em] leading-[0.95] mb-8">
          ¿Trabajamos juntos?
        </h2>
        <div className="flex justify-center">
          <ArrowButton href={`mailto:${content.email}`} variant="solid">
            Escríbeme
          </ArrowButton>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SelectedWork />
      <Showreel />
      <AboutTeaser />
      <ContactCTA />
    </main>
  )
}
