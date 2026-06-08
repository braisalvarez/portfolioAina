import { motion, useReducedMotion } from 'motion/react'
import { content } from '../data/content'

const ease = [0.16, 1, 0.3, 1] as const

const socialLinks = (social: typeof content.social) =>
  [
    { label: 'Instagram', href: social.instagram },
    { label: 'Behance', href: social.behance },
    { label: 'Vimeo', href: social.vimeo },
    { label: 'LinkedIn', href: social.linkedin },
  ].filter((s) => s.href)

export default function ContactPage() {
  const { email, social, contact, available, location } = content
  const reduce = useReducedMotion()

  return (
    <main className="shell min-h-[100dvh] flex flex-col justify-center pt-28 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-end">
        {/* Bloque principal */}
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-3 mb-7"
          >
            {available && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full bg-[var(--accent)] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 bg-[var(--accent)]" />
              </span>
            )}
            <p className="text-[var(--text-muted)] text-[11px] tracking-[0.22em] uppercase">
              {available ? 'Disponible para proyectos' : 'Contacto'}
            </p>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.06, ease }}
            className="text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.035em] leading-[0.92] mb-8"
          >
            {contact.heading}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease }}
            className="text-[var(--text-muted)] text-lg leading-[1.65] max-w-[46ch] mb-12"
          >
            {contact.body}
          </motion.p>

          <motion.a
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-3
                       text-[clamp(1.5rem,4vw,2.5rem)] font-medium tracking-[-0.02em]
                       text-[var(--text)] transition-colors duration-200"
          >
            <span className="border-b border-[var(--border-mid)] group-hover:border-[var(--accent)] transition-colors duration-200 pb-1">
              {email}
            </span>
            <span className="text-[var(--accent)] text-2xl transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </motion.a>
        </div>

        {/* Redes + ubicación */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.4, ease }}
          className="flex flex-col gap-8"
        >
          <div>
            <p className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-4">
              Redes
            </p>
            <ul className="flex flex-col gap-2.5">
              {socialLinks(social).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 text-[var(--text-muted)]
                               hover:text-[var(--text)] transition-colors duration-200"
                  >
                    {s.label}
                    <span className="text-[var(--accent)] opacity-0 -translate-x-1
                                     group-hover:opacity-100 group-hover:translate-x-0
                                     transition-all duration-200">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[var(--text-faint)] text-[11px] tracking-[0.22em] uppercase mb-4">
              Ubicación
            </p>
            <p className="text-[var(--text-muted)]">{location}</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
