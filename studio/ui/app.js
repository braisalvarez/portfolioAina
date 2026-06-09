// Editor visual del contenido del portfolio.
// Carga /api/data, pinta formularios enlazados al estado en memoria y guarda
// con /api/data (PUT) o publica con /api/publish.

const state = { content: null, media: null }
let savedSnapshot = ''

// --- Mini hyperscript ---
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v)
    else if (v === true) el.setAttribute(k, '')
    else el.setAttribute(k, v)
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue
    el.append(kid.nodeType ? kid : document.createTextNode(kid))
  }
  return el
}

// --- API ---
const api = {
  async get() {
    const r = await fetch('/api/data')
    return r.json()
  },
  async save() {
    const r = await fetch('/api/data', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: state.content, media: state.media }),
    })
    if (!r.ok) throw new Error('No se pudo guardar')
    return r.json()
  },
  async upload(folder, file) {
    const dataUrl = await fileToDataUrl(file)
    const r = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ folder, filename: file.name, dataUrl }),
    })
    const j = await r.json()
    if (!r.ok) throw new Error(j.error || 'Error al subir')
    return j
  },
  async publish(message) {
    const r = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    return r.json()
  },
}

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader()
    fr.onload = () => res(fr.result)
    fr.onerror = rej
    fr.readAsDataURL(file)
  })
}

// --- Estado de la UI ---
const statusEl = () => document.getElementById('status')
function setStatus(msg, kind = '') {
  const el = statusEl()
  el.textContent = msg
  el.className = 'status ' + kind
}
function dirty() {
  setStatus('Cambios sin guardar')
}

// --- Helpers de formulario ---
function field(label, control, cls = '') {
  return h('label', { class: 'field ' + cls }, label ? h('span', {}, label) : null, control)
}

function textInput(obj, key, opts = {}) {
  const inp = h('input', { type: opts.type || 'text', placeholder: opts.placeholder || '' })
  inp.value = obj[key] ?? ''
  inp.addEventListener('input', () => {
    obj[key] = inp.value
    dirty()
  })
  return inp
}

function textArea(obj, key, opts = {}) {
  const t = h('textarea', { placeholder: opts.placeholder || '', rows: opts.rows || 3 })
  t.value = obj[key] ?? ''
  t.addEventListener('input', () => {
    obj[key] = t.value
    dirty()
  })
  return t
}

function checkbox(obj, key, label) {
  const c = h('input', { type: 'checkbox' })
  c.checked = !!obj[key]
  c.addEventListener('change', () => {
    obj[key] = c.checked
    dirty()
  })
  return h('label', { class: 'field check' }, c, h('span', {}, label))
}

function sizeInput(inp) {
  inp.size = Math.max(4, (inp.value || '').length + 1)
}

function tagList(arr) {
  const wrap = h('div', { class: 'tags' })
  function draw() {
    wrap.replaceChildren()
    arr.forEach((val, i) => {
      const inp = h('input', { type: 'text', class: 'tag-input' })
      inp.value = val
      sizeInput(inp)
      inp.addEventListener('input', () => {
        arr[i] = inp.value
        sizeInput(inp)
        dirty()
      })
      const rm = h(
        'button',
        { type: 'button', title: 'Quitar', onClick: () => { arr.splice(i, 1); draw(); dirty() } },
        '×',
      )
      wrap.append(h('span', { class: 'tag' }, inp, rm))
    })
    wrap.append(
      h('button', { class: 'tag-add', type: 'button', onClick: () => { arr.push(''); draw(); dirty() } }, '+ Añadir'),
    )
  }
  draw()
  return wrap
}

function previewSrc(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return '/' + path.replace(/^\/+/, '')
}

function imageField(obj, key, folder, label) {
  const preview = h('div', { class: 'image-preview' })
  function drawPreview() {
    const src = previewSrc(obj[key])
    preview.replaceChildren(src ? h('img', { src, alt: '' }) : 'sin imagen')
  }

  const urlInp = h('input', { type: 'text', placeholder: 'URL o ruta de la imagen' })
  urlInp.value = obj[key] ?? ''
  urlInp.addEventListener('input', () => {
    obj[key] = urlInp.value
    drawPreview()
    dirty()
  })

  const file = h('input', { type: 'file', accept: 'image/*', style: 'display:none' })
  const uploadBtn = h('button', { class: 'btn btn-icon', type: 'button', onClick: () => file.click() }, 'Subir imagen')
  file.addEventListener('change', async () => {
    const f = file.files[0]
    if (!f) return
    uploadBtn.disabled = true
    uploadBtn.textContent = 'Subiendo…'
    try {
      const { path } = await api.upload(folder, f)
      obj[key] = path
      urlInp.value = path
      drawPreview()
      dirty()
      setStatus('Imagen subida ✓', 'ok')
    } catch (e) {
      setStatus('Error al subir: ' + e.message, 'err')
    } finally {
      uploadBtn.disabled = false
      uploadBtn.textContent = 'Subir imagen'
      file.value = ''
    }
  })

  drawPreview()
  const controls = h('div', { class: 'image-controls' }, urlInp, h('div', { class: 'row' }, uploadBtn, file))
  return h(
    'div',
    { class: 'field' },
    label ? h('span', {}, label) : null,
    h('div', { class: 'image-field' }, preview, controls),
  )
}

function move(arr, from, to) {
  const [x] = arr.splice(from, 1)
  arr.splice(to, 0, x)
}

function listEditor(arr, opts) {
  const container = h('div', {})
  function draw() {
    container.replaceChildren()
    arr.forEach((item, i) => {
      const head = h(
        'div',
        { class: 'item-head' },
        h('span', { class: 'idx' }, opts.titleOf ? opts.titleOf(item, i) : '#' + (i + 1)),
        h(
          'div',
          { class: 'item-actions' },
          h('button', { class: 'btn btn-icon btn-ghost', type: 'button', title: 'Subir', disabled: i === 0, onClick: () => { move(arr, i, i - 1); draw(); dirty() } }, '↑'),
          h('button', { class: 'btn btn-icon btn-ghost', type: 'button', title: 'Bajar', disabled: i === arr.length - 1, onClick: () => { move(arr, i, i + 1); draw(); dirty() } }, '↓'),
          h('button', { class: 'btn btn-icon btn-danger', type: 'button', onClick: () => { arr.splice(i, 1); draw(); dirty() } }, 'Eliminar'),
        ),
      )
      container.append(h('div', { class: 'item' }, head, ...opts.render(item, i)))
    })
    container.append(h('button', { class: 'add-item', type: 'button', onClick: () => { arr.push(opts.makeNew()); draw(); dirty() } }, opts.addLabel))
  }
  draw()
  return container
}

function card(title, hint, ...nodes) {
  return h('section', { class: 'card' }, h('h2', {}, title), hint ? h('p', { class: 'hint' }, hint) : null, ...nodes)
}

// --- Render principal ---
function render() {
  const c = state.content
  const m = state.media
  const app = document.getElementById('app')
  app.replaceChildren(
    card(
      'Perfil',
      'Datos básicos que aparecen en varias páginas.',
      h('div', { class: 'grid-2' },
        field('Nombre', textInput(c, 'name')),
        field('Rol / título', textInput(c, 'role')),
        field('Ubicación', textInput(c, 'location')),
        field('Email', textInput(c, 'email', { type: 'text' })),
      ),
      checkbox(c, 'available', 'Disponible para proyectos (muestra el indicador)'),
    ),

    card(
      'Hero (portada)',
      'Usa saltos de línea (Enter) en el titular para controlar dónde corta.',
      field('Titular', textArea(c.hero, 'headline', { rows: 2 })),
      field('Subtítulo', textArea(c.hero, 'subheadline', { rows: 2 })),
      h('div', { class: 'grid-2' },
        field('Texto del botón', textInput(c.hero, 'ctaLabel')),
        field('Enlace del botón', textInput(c.hero, 'ctaLink')),
      ),
    ),

    card(
      'Imágenes principales',
      'Sube tus archivos; se guardan en public/images y la ruta se rellena sola.',
      imageField(m.hero, 'portrait', '', 'Retrato del hero'),
      imageField(m.about, 'photo', '', 'Foto de «Sobre mí»'),
    ),

    card(
      'Proyectos',
      'Arrastra el orden con las flechas. La portada se ve en el índice y en la previsualización.',
      listEditor(m.projects, {
        addLabel: '+ Añadir proyecto',
        titleOf: (p) => p.title || 'Proyecto sin título',
        makeNew: () => ({ id: '', title: 'Nuevo proyecto', category: '', year: String(new Date().getFullYear()), coverImage: '', description: '', tags: [], link: '' }),
        render: (p) => [
          field('Título', textInput(p, 'title')),
          h('div', { class: 'grid-2' },
            field('Categoría', textInput(p, 'category')),
            field('Año', textInput(p, 'year')),
          ),
          field('ID (clave interna, sin espacios ni acentos)', textInput(p, 'id')),
          imageField(p, 'coverImage', 'projects', 'Imagen de portada'),
          field('Descripción', textArea(p, 'description')),
          field('Etiquetas', tagList(p.tags)),
          field('Enlace (opcional)', textInput(p, 'link', { type: 'text', placeholder: 'https://…' })),
        ],
      }),
    ),

    card(
      'Disciplinas',
      'Lista que recorre la marquesina del hero.',
      tagList(c.disciplines),
    ),

    card(
      'Sobre mí',
      null,
      field('Introducción', textArea(c.about, 'intro', { rows: 2 })),
      field('Biografía', textArea(c.about, 'bio', { rows: 5 })),
      field('Herramientas / skills', tagList(c.about.skills)),
      h('p', { class: 'hint', style: 'margin:18px 0 8px' }, 'Servicios'),
      listEditor(c.about.services, {
        addLabel: '+ Añadir servicio',
        titleOf: (s) => s.title || 'Servicio',
        makeNew: () => ({ title: '', description: '' }),
        render: (s) => [
          field('Título', textInput(s, 'title')),
          field('Descripción', textArea(s, 'description')),
        ],
      }),
    ),

    card(
      'Showreel',
      'ID del vídeo de YouTube (la parte después de v=) y su miniatura.',
      h('div', { class: 'grid-2' },
        field('YouTube ID', textInput(m.reel, 'youtubeId')),
        null,
      ),
      imageField(m.reel, 'poster', '', 'Póster del showreel'),
    ),

    card(
      'Contacto',
      null,
      field('Encabezado', textInput(c.contact, 'heading')),
      field('Texto', textArea(c.contact, 'body')),
    ),

    card(
      'Redes sociales',
      'Deja vacío el que no quieras mostrar.',
      h('div', { class: 'grid-2' },
        field('Instagram', textInput(c.social, 'instagram', { type: 'text' })),
        field('LinkedIn', textInput(c.social, 'linkedin', { type: 'text' })),
        field('Behance', textInput(c.social, 'behance', { type: 'text' })),
        field('Vimeo', textInput(c.social, 'vimeo', { type: 'text' })),
      ),
    ),
  )
}

// --- Guardar / Publicar ---
function setBusy(busy) {
  document.getElementById('save').disabled = busy
  document.getElementById('publish').disabled = busy
}

async function doSave() {
  setBusy(true)
  setStatus('Guardando…')
  try {
    await api.save()
    savedSnapshot = JSON.stringify(state)
    setStatus('Guardado ✓', 'ok')
    return true
  } catch (e) {
    setStatus('Error al guardar: ' + e.message, 'err')
    return false
  } finally {
    setBusy(false)
  }
}

function openPublish() {
  document.getElementById('publish-log').hidden = true
  document.getElementById('publish-modal').hidden = false
  document.getElementById('commit-msg').focus()
}
function closePublish() {
  document.getElementById('publish-modal').hidden = true
}

async function doPublish() {
  const msg = document.getElementById('commit-msg').value.trim() || 'Actualiza contenido del portfolio'
  const logEl = document.getElementById('publish-log')
  const goBtn = document.getElementById('publish-go')
  goBtn.disabled = true
  goBtn.textContent = 'Publicando…'
  logEl.hidden = false
  logEl.textContent = 'Guardando cambios…'
  try {
    const ok = await doSave()
    if (!ok) {
      logEl.textContent = 'No se pudo guardar. Revisa la consola del Studio.'
      return
    }
    logEl.textContent = 'Subiendo a GitHub…'
    const res = await api.publish(msg)
    logEl.textContent = res.log || (res.ok ? 'Publicado.' : 'Error al publicar.')
    if (res.ok) {
      setStatus(res.nothingToCommit ? 'Sin cambios nuevos que publicar' : 'Publicado ✓', 'ok')
    } else {
      setStatus('Error al publicar', 'err')
    }
  } catch (e) {
    logEl.textContent = 'Error: ' + e.message
    setStatus('Error al publicar', 'err')
  } finally {
    goBtn.disabled = false
    goBtn.textContent = 'Publicar ahora'
  }
}

// --- Arranque ---
async function init() {
  try {
    const data = await api.get()
    state.content = data.content
    state.media = data.media
    savedSnapshot = JSON.stringify(state)
    render()
    setStatus('Listo', 'ok')
  } catch (e) {
    document.getElementById('app').innerHTML =
      '<p class="loading">No se pudo cargar el contenido. ¿Está corriendo el Studio?</p>'
  }

  document.getElementById('save').addEventListener('click', doSave)
  document.getElementById('publish').addEventListener('click', openPublish)
  document.getElementById('publish-cancel').addEventListener('click', closePublish)
  document.getElementById('publish-go').addEventListener('click', doPublish)
  document.getElementById('publish-modal').addEventListener('click', (e) => {
    if (e.target.id === 'publish-modal') closePublish()
  })

  // Ctrl/Cmd+S para guardar
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      doSave()
    }
  })
  // Aviso al salir con cambios sin guardar
  window.addEventListener('beforeunload', (e) => {
    if (JSON.stringify(state) !== savedSnapshot) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
}

init()
