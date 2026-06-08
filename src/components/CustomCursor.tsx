import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/**
 * Cursor diferencial discreto: un punto que sigue al ratón con precisión
 * y un aro cuadrado que lo persigue con un leve retardo. Usa
 * mix-blend-difference para verse sobre cualquier fondo. Crece al pasar
 * sobre elementos interactivos.
 *
 * Solo se activa en escritorio (puntero fino con hover) y se desactiva
 * con prefers-reduced-motion, dejando el cursor nativo.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false) // sobre enlace/botón

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduce.matches) return

    setEnabled(true)
    document.documentElement.classList.add('cursor-none')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement | null
      setActive(Boolean(t?.closest('a, button, [data-cursor], input, textarea, label')))
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('cursor-none')
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference" aria-hidden="true">
      {/* Punto: sigue al ratón con precisión */}
      <motion.span
        style={{ x, y }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 block bg-white"
        animate={{ width: active ? 0 : 7, height: active ? 0 : 7, opacity: active ? 0 : 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      {/* Aro cuadrado: persigue con leve retardo, crece al hover */}
      <motion.span
        style={{ x: ringX, y: ringY }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 block border border-white"
        animate={{
          width: active ? 52 : 28,
          height: active ? 52 : 28,
          opacity: active ? 1 : 0.55,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
    </div>
  )
}
