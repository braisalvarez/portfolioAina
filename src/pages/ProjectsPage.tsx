import { useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react'
import { content } from '../data/content'
import { media } from '../data/media'

const ease = [0.16, 1, 0.3, 1] as const

export default function ProjectsPage() {
  const { projects } = media
  const reduce = useReducedMotion()

  // Preview flotante anclada al cursor (solo escritorio).
  // Posición directa (sin spring) para que aparezca centrada en el ratón.
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMove = (e: React.MouseEvent) => {
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <main className="shell pt-32 md:pt-44 pb-24 min-h-[100dvh]">
      {/* Encabezado */}
      <header className="mb-12 md:mb-16">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-4"
        >
          {projects.length} proyectos · 2022—2024
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease }}
          className="text-[clamp(2.75rem,8vw,6rem)] font-semibold tracking-[-0.03em] leading-[0.95]"
        >
          Proyectos
        </motion.h1>
      </header>

      {/* Índice editorial */}
      <ul
        className="border-t border-[var(--border)]"
        onMouseLeave={() => setActive(null)}
      >
        {projects.map((project, i) => (
          <motion.li
            key={project.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: i * 0.04, ease }}
            className="border-b border-[var(--border)]"
            onMouseEnter={(e) => { x.set(e.clientX); y.set(e.clientY); setActive(i) }}
            onMouseMove={handleMove}
          >
            <a
              href={project.link || undefined}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noreferrer' : undefined}
              className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto]
                         items-center gap-4 md:gap-8 py-5 md:py-7
                         transition-colors duration-300"
            >
              {/* Número */}
              <span className="text-[var(--text-faint)] text-sm tabular-nums w-7">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Miniatura (solo móvil) + título */}
              <span className="flex items-center gap-4 min-w-0">
                <img
                  src={project.coverImage}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                  className="md:hidden w-14 h-14 object-cover shrink-0 bg-[var(--bg-raised)]"
                />
                <span className="text-2xl md:text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.02em]
                                 text-[var(--text)] md:text-[var(--text-muted)]
                                 md:group-hover:text-[var(--text)] transition-colors duration-300 truncate">
                  {project.title}
                </span>
              </span>

              {/* Categoría (desde md) */}
              <span className="hidden md:block text-[var(--text-muted)] text-sm tracking-wide">
                {project.category}
              </span>

              {/* Año */}
              <span className="text-[var(--text-faint)] text-sm tabular-nums">
                {project.year}
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      {/* Preview flotante (solo escritorio con puntero fino) */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          style={{ x, y }}
          className="pointer-events-none fixed top-0 left-0 z-40 hidden lg:block"
        >
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-0 left-0 -mt-[190px] -ml-[150px]
                           w-[300px] h-[380px] overflow-hidden shadow-2xl shadow-black/50"
              >
                <img
                  src={projects[active].coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Cierre */}
      <p className="mt-16 text-[var(--text-muted)] text-base max-w-[48ch] leading-[1.6]">
        ¿Quieres ver un proyecto en detalle o hablar del tuyo?{' '}
        <a href={`mailto:${content.email}`} className="text-[var(--accent)] hover:underline underline-offset-4">
          Escríbeme
        </a>
        .
      </p>
    </main>
  )
}
