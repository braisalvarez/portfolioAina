import { Link } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  to?: string
  href?: string
  variant?: 'solid' | 'outline'
}

const Arrow = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * Botón de dos celdas (etiqueta + flecha) con borde recto.
 * - solid:   relleno chartreuse que se invierte a contorno al hover.
 * - outline: contorno tenue que se ilumina en chartreuse al hover.
 */
export default function ArrowButton({ children, to, href, variant = 'solid' }: Props) {
  const shell =
    variant === 'solid'
      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-transparent hover:text-[var(--accent)]'
      : 'border-[var(--border-mid)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]'

  const className =
    `group inline-flex items-stretch border text-sm font-semibold tracking-wide ` +
    `transition-colors duration-300 active:translate-y-px ${shell}`

  const inner = (
    <>
      <span className="px-5 py-3 leading-none flex items-center">{children}</span>
      <span className="grid place-items-center px-3.5 border-l border-current">
        <Arrow />
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}
