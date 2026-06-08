// ============================================================
//  ARCHIVO DE MEDIOS — cambia aquí las imágenes y vídeos
//
//  Las imágenes de ejemplo usan picsum.photos (placeholders).
//  Para usar las tuyas: pon los archivos en /public/images/
//  y cambia la ruta, por ejemplo:  '/images/projects/mi-proyecto.jpg'
// ============================================================

// Helper para generar placeholders consistentes mientras no tengas imágenes.
const placeholder = (seed: string, w = 900, h = 1100) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const media = {

  // --- HERO (página de inicio) ---
  hero: {
    portrait: placeholder('motion-designer-portrait-studio-dark', 900, 1200),
  },

  // --- SOBRE MÍ ---
  about: {
    photo: placeholder('designer-workspace-portrait-dark', 900, 1200),
  },

  // --- PROYECTOS ---
  // Cada proyecto: id, title, category, year, coverImage, description, tags[], link
  projects: [
    {
      id: 'aurora',
      title: 'Aurora',
      category: 'Motion Design',
      year: '2024',
      coverImage: placeholder('aurora-motion-gradient-abstract', 1000, 1300),
      description:
        'Identidad en movimiento para un festival de música electrónica. Sistema de animaciones reactivas al sonido.',
      tags: ['After Effects', 'Cinema 4D', 'Sound Reactive'],
      link: '',
    },
    {
      id: 'meridiano',
      title: 'Meridiano',
      category: 'Identidad Visual',
      year: '2024',
      coverImage: placeholder('meridiano-brand-geometric-editorial', 1000, 800),
      description:
        'Identidad visual completa para un estudio de arquitectura. Sistema tipográfico y rejilla editorial.',
      tags: ['Branding', 'Illustrator', 'Diseño Editorial'],
      link: '',
    },
    {
      id: 'nocturno',
      title: 'Nocturno',
      category: 'Dirección de Arte',
      year: '2023',
      coverImage: placeholder('nocturno-dark-cinematic-art-direction', 1000, 800),
      description:
        'Dirección de arte y piezas audiovisuales para una campaña de lanzamiento nocturna.',
      tags: ['Art Direction', 'Premiere Pro', 'Color'],
      link: '',
    },
    {
      id: 'pulso',
      title: 'Pulso',
      category: 'Animación 2D',
      year: '2023',
      coverImage: placeholder('pulso-2d-animation-colorful-shapes', 1000, 1300),
      description:
        'Serie de animaciones 2D para redes sociales. Lenguaje gráfico modular y reutilizable.',
      tags: ['After Effects', 'Illustrator', 'Social'],
      link: '',
    },
    {
      id: 'sereno',
      title: 'Sereno',
      category: 'Diseño Editorial',
      year: '2023',
      coverImage: placeholder('sereno-editorial-magazine-layout-print', 1000, 800),
      description:
        'Diseño editorial para una revista cultural independiente. Maquetación y sistema de portadas.',
      tags: ['Diseño Editorial', 'InDesign', 'Print'],
      link: '',
    },
    {
      id: 'vertigo',
      title: 'Vértigo',
      category: 'Motion Design',
      year: '2022',
      coverImage: placeholder('vertigo-3d-motion-render-dark', 1000, 1300),
      description:
        'Spot de motion 3D para el lanzamiento de un producto tecnológico. Render y postproducción.',
      tags: ['Cinema 4D', 'Octane', 'After Effects'],
      link: '',
    },
  ],

  // --- SHOWREEL ---
  reel: {
    youtubeId: 'dQw4w9WgXcQ', // reemplaza con el ID de tu showreel en YouTube
    poster: placeholder('showreel-cinematic-motion-poster-dark', 1280, 720),
  },

}
