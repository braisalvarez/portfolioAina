# Studio — editor de contenido

Editor visual **local** para cambiar textos, imágenes y proyectos del portfolio
sin tocar código.

## Uso

```bash
npm run studio
```

Se abre solo en el navegador (`http://127.0.0.1:4321`). Desde ahí:

- **Editar**: cambia textos, sube imágenes (se guardan en `public/images/`),
  añade/ordena/borra proyectos y servicios.
- **Guardar** (o `Ctrl/Cmd+S`): escribe los cambios en `src/data/content.json`
  y `src/data/media.json`.
- **Publicar**: guarda y hace `git add` + `commit` + `push`. Tu GitHub Action
  se encarga del resto y la web se actualiza sola en uno o dos minutos.

## Cómo funciona

- El contenido vive en `src/data/content.json` (textos) y `src/data/media.json`
  (imágenes, proyectos, showreel). La web los lee a través de
  `src/data/content.ts` y `src/data/media.ts`.
- Las rutas de imágenes subidas se guardan como `images/...` y se ajustan solas
  al `base` de Vite, así que funcionan también en GitHub Pages.
- El servidor (`studio/server.mjs`) es Node puro, sin dependencias, y solo
  escucha en `localhost`. No se despliega: es una herramienta de tu máquina.

> Define `STUDIO_NO_OPEN=1` si no quieres que abra el navegador automáticamente.
