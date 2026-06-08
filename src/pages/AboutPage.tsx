import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { content } from '../data/content'
import { media } from '../data/media'

const ease = [0.16, 1, 0.3, 1] as const

export default function AboutPage() {
  const { about, name, role, location } = content
  const reduce = useReducedMotion()

  const fade = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.65, delay, ease },
  })

  return (
    <main className="shell pt-32 md:pt-44 pb-24 min-h-[100dvh]">
      {/* Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start mb-20 md:mb-28">
        {/* Foto */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
          className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-raised)]
                     order-1 lg:order-none max-w-md lg:max-w-none"
        >
          <img
            src={media.about.photo}
            alt={name}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Texto */}
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-5"
          >
            {role} · {location}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.06, ease }}
            style={{ textWrap: 'balance' } as React.CSSProperties}
            className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.03em] leading-[0.98] mb-8"
          >
            {name}
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease }}
            style={{ textWrap: 'pretty' } as React.CSSProperties}
            className="text-[var(--text-muted)] text-lg leading-[1.7] max-w-[60ch]"
          >
            {about.bio}
          </motion.p>
        </div>
      </div>

      {/* Servicios */}
      <motion.section {...fade()} className="border-t border-[var(--border)] pt-12 md:pt-16 mb-20 md:mb-28">
        <h2 className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-10">
          Qué hago
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
          {about.services.map((service, i) => (
            <motion.div key={service.title} {...fade(i * 0.08)}>
              <span className="text-[var(--accent)] text-sm tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl md:text-2xl font-medium tracking-[-0.015em] mt-3 mb-3">
                {service.title}
              </h3>
              <p className="text-[var(--text-muted)] text-base leading-[1.6] max-w-[34ch]">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Herramientas */}
      <motion.section {...fade()} className="border-t border-[var(--border)] pt-12 md:pt-16 mb-20 md:mb-24">
        <h2 className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-8">
          Herramientas
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {about.skills.map((skill) => (
            <li
              key={skill}
              className="px-4 py-2 border border-[var(--border-mid)]
                         text-[var(--text-muted)] text-sm tracking-wide
                         hover:border-[var(--accent)] hover:text-[var(--text)]
                         transition-colors duration-200"
            >
              {skill}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* CTA */}
      <motion.div {...fade()} className="border-t border-[var(--border)] pt-12 md:pt-16">
        <Link
          to="/contacto"
          className="group inline-flex items-baseline gap-4
                     text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.025em]
                     text-[var(--text)] transition-colors duration-200"
        >
          Hablemos
          <span className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-2">→</span>
        </Link>
      </motion.div>
    </main>
  )
}
