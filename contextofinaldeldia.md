# Contexto final del día — Portfolio Designer

> Estado del proyecto y decisiones tomadas. Sirve como punto de partida para la próxima sesión.

## Proyecto

Portfolio para **Aina Codina** — Diseñadora Gráfica & Motion Designer (Barcelona). Web en español, dark mode, con identidad propia (experimental, juguetona, libre).

- **Stack:** Vite + React 19 + TypeScript + Tailwind v4 + `motion/react` + react-router-dom v7
- **Gestor:** pnpm — `pnpm dev` (localhost:5173), `pnpm build` para verificar
- **Fuente:** Bricolage Grotesque Variable (autohospedada vía `@fontsource-variable`)
- **Color:** acento chartreuse `#c8ff00` sobre casi-negro `#0c0c0c`
- **Verificación:** no hay Chromium disponible en el entorno → se valida con `pnpm build` (no se pueden hacer capturas)

## Decisiones de diseño fijadas (NO cambiar sin pedirlo)

- **Tipografía y color** aprobados: Bricolage + chartreuse sobre dark. Mantener.
- **Sin bordes redondeados en ningún lado.** Estética recta/brutalista. Cero `rounded-*` en todo el proyecto (incluido el cursor, que es cuadrado).
- **Nada de vídeos a pantalla completa.** El showreel va contenido (columna de texto + vídeo con ancho limitado, click-to-play). Los vídeos enormes "dan mala impresión".
- **Legibilidad** prioritaria: `--text-muted` subido a 0.52 alpha para cumplir WCAG AA.
- **Móvil** importa: hero responsive (retrato visible en móvil), navbar con menú hamburguesa, índice de proyectos con miniaturas en móvil.
- Dials del skill *taste*: VARIANCE 8 / MOTION 7 / DENSITY 3. Register de *impeccable*: `brand`.

## Estructura de archivos clave

- `src/data/content.ts` — TODOS los textos (nombre, hero, about, servicios, social, nav). **Editado por el usuario** (datos reales de Aina).
- `src/data/media.ts` — imágenes/vídeo. 6 proyectos de ejemplo con placeholders de picsum por seed (sustituir por archivos en `/public/images/`).
- `src/index.css` — tokens CSS, `.shell` (contenedor), reset en `@layer base`, `::selection`, regla `.cursor-none`.
- `src/App.tsx` — router + `<CustomCursor />` + Navbar + Footer.
- `src/components/Navbar.tsx` — nav fija translúcida + menú móvil animado.
- `src/components/Footer.tsx` — email, copyright, redes.
- `src/components/ArrowButton.tsx` — botón de dos celdas (etiqueta + flecha) que se invierte al hover. Soporta `to` (router) o `href` (anchor), variantes `solid`/`outline`.
- `src/components/CustomCursor.tsx` — cursor diferencial cuadrado.
- `src/pages/HomePage.tsx` — Hero → SelectedWork → Showreel → AboutTeaser → ContactCTA.
- `src/pages/ProjectsPage.tsx` — índice editorial con preview flotante al cursor.
- `src/pages/AboutPage.tsx` — bio, servicios, herramientas, CTA.
- `src/pages/ContactPage.tsx` — contacto grande + redes + ubicación.

## Trabajo hecho hoy

1. **Overhaul gráfico** del home y migración de TODAS las páginas al sistema de tokens (antes Proyectos/Sobre-mí/Contacto usaban `text-white/40` plano y desentonaban).
2. **Datos ampliados:** 6 proyectos de ejemplo, servicios, bio enriquecida en `content.ts`/`media.ts`.
3. **Navbar con menú móvil** (antes los links se desbordaban en móvil).
4. **Sin redondeos:** eliminados los 17 `rounded-*` del proyecto.
5. **Bug crítico de CSS resuelto:** el reset `* { margin:0; padding:0 }` estaba *fuera de capa*, y en Tailwind v4 lo sin-capa gana a `@layer utilities` → anulaba TODAS las utilidades `pt-*`, `mb-*`, `py-*` del sitio. Por eso el header se "comía" Proyectos y Sobre-mí (que dependen de `pt-*`) pero no Home/Contacto (que centran con flex/grid). **Arreglado** metiendo la base en `@layer base`. Esto restauró el espaciado en toda la web.
6. **Marquesina eliminada** del home (la pidió quitar el usuario).
7. **ArrowButton** nuevo: el botón "Ver proyectos" del hero quedaba soso; ahora es de dos celdas con inversión al hover. Aplicado en hero y CTA de contacto.
8. **Cursor diferencial** (`CustomCursor.tsx`): punto que sigue exacto + aro cuadrado con leve retardo (spring), `mix-blend-difference`, crece sobre interactivos. Solo escritorio con puntero fino, desactivado con reduced-motion. Oculta el cursor nativo con `.cursor-none`.
9. **Preview de proyectos:** quitado el `useSpring` de la posición (resbalaba desde la esquina). Se ancla en `onMouseEnter` y solo hace fade.
10. **Centrado del preview arreglado:** el `transform` de Motion (`style={{x,y}}`) pisaba el `-translate-1/2` de Tailwind. Solución: centrado movido al elemento interno (solo anima opacity) con márgenes negativos `-mt-[190px] -ml-[150px]`. Ahora aparece centrado en el cursor desde el primer frame.

## Pendiente / posibles siguientes pasos

- Sustituir placeholders de picsum por imágenes reales del trabajo de Aina (en `/public/images/`, actualizar rutas en `media.ts`).
- Reemplazar el `youtubeId` del showreel (`dQw4w9WgXcQ`) por el real.
- Revisar la subheadline del hero en `content.ts` (ahora pone un texto de prueba: "Soy entre Jesús y cristo").
- Rellenar las URLs reales de redes sociales en `content.ts`.
- Opcional: unificar el `ArrowButton` en los CTAs de Sobre-mí y Contacto (ahora usan enlaces grandes de texto).
- Opcional: página de detalle por proyecto.
- Opcional: ajustar el "pegado" del aro del cursor (`stiffness`/`damping` en `CustomCursor.tsx`).

## Memorias guardadas

En `~/.claude/projects/.../memory/`: `portfolio-design-system.md` (font/color/legibilidad/móvil) y `no-giant-videos.md`.
