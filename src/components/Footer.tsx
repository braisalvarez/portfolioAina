import { content } from '../data/content'

const socialLinks = (social: typeof content.social) =>
  [
    { label: 'Instagram', href: social.instagram },
    { label: 'Behance', href: social.behance },
    { label: 'Vimeo', href: social.vimeo },
    { label: 'LinkedIn', href: social.linkedin },
  ].filter((s) => s.href)

export default function Footer() {
  const { social, email, name } = content

  return (
    <footer className="shell border-t border-[var(--border)] py-10
                       flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-1.5">
        <a
          href={`mailto:${email}`}
          className="text-[var(--text)] text-base hover:text-[var(--accent)] transition-colors duration-200 w-fit"
        >
          {email}
        </a>
        <span className="text-[var(--text-faint)] text-sm">
          &copy; {new Date().getFullYear()} {name}
        </span>
      </div>

      <nav aria-label="Redes sociales" className="flex gap-6 flex-wrap">
        {socialLinks(social).map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--text-muted)] text-sm tracking-wide
                       hover:text-[var(--text)] transition-colors duration-200"
          >
            {s.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
