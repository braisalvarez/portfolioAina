import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { content } from '../data/content'

const ease = [0.16, 1, 0.3, 1] as const

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  // Cierra el menú al cambiar de ruta
  useEffect(() => { setOpen(false) }, [pathname])

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[var(--z-nav)]
                   bg-[#0c0c0c]/80 backdrop-blur-md
                   border-b border-[var(--border)]"
      >
        <nav className="shell flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-[var(--text)] text-sm tracking-[0.16em] uppercase font-medium
                       hover:text-[var(--accent)] transition-colors duration-200"
          >
            {content.name}
          </Link>

          {/* Desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {content.nav.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`relative text-sm tracking-wide pb-1 transition-colors duration-200 ${
                      active
                        ? 'text-[var(--text)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute -bottom-px left-0 right-0 h-px bg-[var(--accent)]" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Botón móvil */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-end gap-[5px] w-8 h-8 -mr-1"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span
              className={`block h-px bg-[var(--text)] transition-all duration-300 ${
                open ? 'w-6 translate-y-[6px] rotate-45' : 'w-6'
              }`}
            />
            <span
              className={`block h-px bg-[var(--text)] transition-all duration-300 ${
                open ? 'opacity-0' : 'w-4 opacity-100'
              }`}
            />
            <span
              className={`block h-px bg-[var(--text)] transition-all duration-300 ${
                open ? 'w-6 -translate-y-[6px] -rotate-45' : 'w-6'
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Overlay móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-0 z-[var(--z-overlay)] md:hidden
                       bg-[#0c0c0c] flex flex-col justify-center px-8"
          >
            <ul className="flex flex-col gap-2">
              {content.nav.map((item, i) => {
                const active = pathname === item.href
                return (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease }}
                  >
                    <Link
                      to={item.href}
                      className={`block py-2 text-4xl font-semibold tracking-[-0.02em] transition-colors duration-200 ${
                        active ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>

            <a
              href={`mailto:${content.email}`}
              className="mt-12 text-[var(--text-muted)] text-sm tracking-wide
                         hover:text-[var(--accent)] transition-colors duration-200"
            >
              {content.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
