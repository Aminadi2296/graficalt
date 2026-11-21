/**
 * Migra las `externalImages` de todos los productos de Payload hacia la colección `media`
 * (almacenada en Cloudflare R2 y convertida automáticamente a WebP en 3 tamaños).
 *
 * Uso:
 *   npm run migrate:images -- --limite=3    (prueba con 3 productos)
 *   npm run migrate:images                  (migra todos los pendientes)
 *
 * Es idempotente/reanudable: omite productos que ya tienen `images` cargadas.
 */
import 'dotenv/config'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const args = process.argv.slice(2)
const LIMIT = Number(args.find((a) => a.startsWith('--limite='))?.split('=')[1]) || Infinity

if (!process.env.R2_BUCKET || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error('Faltan variables R2_* en .env. Configura R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY y R2_PUBLIC_URL.')
  process.exit(1)
}

function guessMime(url: string, contentType: string | null): { mime: string; ext: string } {
  const ct = (contentType || '').split(';')[0].trim().toLowerCase()
  if (ct.startsWith('image/')) {
    const ext = ct.replace('image/', '').replace('jpeg', 'jpg').replace('svg+xml', 'svg')
    return { mime: ct, ext }
  }
  const urlExt = path.extname(new URL(url).pathname).toLowerCase().replace('.', '')
  if (urlExt === 'png') return { mime: 'image/png', ext: 'png' }
  if (urlExt === 'webp') return { mime: 'image/webp', ext: 'webp' }
  return { mime: 'image/jpeg', ext: 'jpg' }
}

async function run() {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 5000,
    depth: 0,
    pagination: false,
  })

  const pending = products.filter(
    (p) => (!p.images || p.images.length === 0) && p.externalImages && p.externalImages.length > 0,
  )

  console.log(`Productos totales: ${products.length} | Pendientes de migrar: ${pending.length}`)
  const toProcess = pending.slice(0, LIMIT)
  const uploadedByUrl = new Map<string, number>()

  let ok = 0
  let failed = 0

  for (let idx = 0; idx < toProcess.length; idx++) {
    const p = toProcess[idx]
    const mediaIds: { image: number }[] = []

    for (let j = 0; j < (p.externalImages?.length ?? 0); j++) {
      const extImg = p.externalImages![j]
      if (!extImg?.url) continue

      const cached = uploadedByUrl.get(extImg.url)
      if (cached) {
        mediaIds.push({ image: cached })
        continue
      }

      try {
        const res = await fetch(extImg.url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        const { mime, ext } = guessMime(extImg.url, res.headers.get('content-type'))
        const filename = `${p.slug}-${j + 1}.${ext}`

        const media = await payload.create({
          collection: 'media',
          data: { alt: extImg.alt || p.title },
          file: {
            data: buf,
            mimetype: mime,
            name: filename,
            size: buf.length,
          },
        })

        uploadedByUrl.set(extImg.url, media.id)
        mediaIds.push({ image: media.id })
      } catch (err) {
        console.warn(`  [!] Error descargando/subiendo imagen de ${p.slug}:`, err instanceof Error ? err.message : err)
      }
    }

    if (mediaIds.length > 0) {
      await payload.update({
        collection: 'products',
        id: p.id,
        data: { images: mediaIds },
      })
      ok++
      console.log(`[${idx + 1}/${toProcess.length}] OK: ${p.slug} (${mediaIds.length} img)`)
    } else {
      failed++
      console.warn(`[${idx + 1}/${toProcess.length}] SIN IMÁGENES: ${p.slug}`)
    }
  }

  console.log(`\nMigración terminada. Migrados: ${ok} | Fallidos: ${failed}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
