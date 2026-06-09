// ============================================================
//  STUDIO — editor local de contenido del portfolio
//
//  Arranca con:  npm run studio
//  Abre una UI en el navegador para editar textos, imágenes y
//  proyectos. Escribe en src/data/*.json y public/images/, y puede
//  publicar (git add + commit + push) con un botón.
//
//  Servidor Node puro, sin dependencias. Solo escucha en localhost.
// ============================================================

import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, extname, basename } from 'node:path'

const execFileP = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const UI_DIR = join(__dirname, 'ui')
const CONTENT_JSON = join(ROOT, 'src', 'data', 'content.json')
const MEDIA_JSON = join(ROOT, 'src', 'data', 'media.json')
const IMAGES_DIR = join(ROOT, 'public', 'images')

const PORT = 4321
const HOST = '127.0.0.1'
const MAX_BODY = 40 * 1024 * 1024 // 40 MB (imágenes en base64)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(body)
}

function readBody(req) {
  return new Promise((res, rej) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        rej(new Error('Archivo demasiado grande (máx. 40 MB)'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => res(Buffer.concat(chunks)))
    req.on('error', rej)
  })
}

async function serveStatic(res, filePath) {
  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('No encontrado')
  }
}

// Convierte un nombre de archivo en algo seguro para el sistema de archivos.
function safeName(name) {
  const ext = extname(name).toLowerCase()
  const stem = basename(name, extname(name))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'imagen'
  return { stem, ext: ext || '.png' }
}

async function handleUpload(req, res) {
  const raw = await readBody(req)
  const { folder = '', filename = 'imagen.png', dataUrl } = JSON.parse(raw.toString('utf8'))
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return sendJson(res, 400, { error: 'dataUrl no válido' })
  }
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const buf = Buffer.from(base64, 'base64')

  const cleanFolder = String(folder).replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '')
  const dir = cleanFolder ? join(IMAGES_DIR, cleanFolder) : IMAGES_DIR
  await mkdir(dir, { recursive: true })

  let { stem, ext } = safeName(filename)
  let finalName = `${stem}${ext}`
  if (existsSync(join(dir, finalName))) finalName = `${stem}-${Date.now()}${ext}`
  await writeFile(join(dir, finalName), buf)

  const rel = ['images', cleanFolder, finalName].filter(Boolean).join('/')
  sendJson(res, 200, { path: rel })
}

async function handlePublish(req, res) {
  const raw = await readBody(req)
  const { message } = JSON.parse(raw.toString('utf8') || '{}')
  const msg = (message && String(message).trim()) || 'Actualiza contenido del portfolio'
  const log = []
  const run = async (args) => {
    try {
      const { stdout, stderr } = await execFileP('git', args, { cwd: ROOT })
      log.push(`$ git ${args.join(' ')}\n${stdout}${stderr}`.trim())
      return { ok: true, stdout, stderr }
    } catch (e) {
      log.push(`$ git ${args.join(' ')}\n${e.stdout || ''}${e.stderr || e.message}`.trim())
      return { ok: false, error: e }
    }
  }

  await run(['add', '-A'])
  const commit = await run(['commit', '-m', msg])
  // "nothing to commit" no es un error real: puede que solo falte hacer push.
  const nothingToCommit = !commit.ok && /nothing to commit/i.test((commit.error?.stdout || '') + (commit.error?.stderr || ''))
  if (!commit.ok && !nothingToCommit) {
    return sendJson(res, 500, { ok: false, log: log.join('\n\n') })
  }
  const push = await run(['push'])
  if (!push.ok) return sendJson(res, 500, { ok: false, log: log.join('\n\n') })

  sendJson(res, 200, { ok: true, nothingToCommit, log: log.join('\n\n') })
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const path = decodeURIComponent(url.pathname)

    // --- API ---
    if (path === '/api/data' && req.method === 'GET') {
      const [content, media] = await Promise.all([
        readFile(CONTENT_JSON, 'utf8').then(JSON.parse),
        readFile(MEDIA_JSON, 'utf8').then(JSON.parse),
      ])
      return sendJson(res, 200, { content, media })
    }
    if (path === '/api/data' && req.method === 'PUT') {
      const raw = await readBody(req)
      const { content, media } = JSON.parse(raw.toString('utf8'))
      await writeFile(CONTENT_JSON, JSON.stringify(content, null, 2) + '\n', 'utf8')
      await writeFile(MEDIA_JSON, JSON.stringify(media, null, 2) + '\n', 'utf8')
      return sendJson(res, 200, { ok: true })
    }
    if (path === '/api/upload' && req.method === 'POST') return handleUpload(req, res)
    if (path === '/api/publish' && req.method === 'POST') return handlePublish(req, res)

    // --- Imágenes del portfolio (para previsualizar) ---
    if (path.startsWith('/images/') && req.method === 'GET') {
      return serveStatic(res, join(ROOT, 'public', path.replace(/^\/+/, '')))
    }

    // --- UI estática ---
    if (req.method === 'GET') {
      const file = path === '/' ? 'index.html' : path.replace(/^\/+/, '')
      const full = join(UI_DIR, file)
      if (full.startsWith(UI_DIR) && existsSync(full)) return serveStatic(res, full)
      // Fallback al index para rutas desconocidas
      return serveStatic(res, join(UI_DIR, 'index.html'))
    }

    res.writeHead(405)
    res.end('Método no permitido')
  } catch (err) {
    sendJson(res, 500, { error: err.message })
  }
})

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`
  console.log(`\n  🎨  Studio del portfolio en marcha`)
  console.log(`      ${url}\n`)
  console.log(`  Edita, guarda y pulsa «Publicar» para subirlo (git push).`)
  console.log(`  Ctrl+C para parar.\n`)
  // Abrir el navegador (best-effort, según plataforma)
  if (process.env.STUDIO_NO_OPEN) return
  const opener =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]]
    : ['xdg-open', [url]]
  execFile(opener[0], opener[1], () => {})
})
