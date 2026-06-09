// ============================================================
//  MEDIOS (imágenes, proyectos, showreel)
//
//  No edites este archivo a mano: usa el editor visual.
//  Arráncalo con:  npm run studio
//  Los datos viven en media.json (se escriben desde el Studio).
// ============================================================

import data from './media.json'

const base = import.meta.env.BASE_URL

/**
 * Resuelve la URL de un medio. Las URLs absolutas (http…, //…, data:) se
 * dejan tal cual; las rutas locales (p. ej. "images/foo.jpg") se prefijan con
 * el base de Vite para que funcionen también en GitHub Pages.
 */
export function asset(path: string): string {
  if (!path) return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return base + path.replace(/^\//, '')
}

export const media = {
  ...data,
  hero: { ...data.hero, portrait: asset(data.hero.portrait) },
  about: { ...data.about, photo: asset(data.about.photo) },
  projects: data.projects.map((p) => ({ ...p, coverImage: asset(p.coverImage) })),
  reel: { ...data.reel, poster: asset(data.reel.poster) },
}
