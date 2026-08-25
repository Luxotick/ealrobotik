import { readdirSync, copyFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'assets')
const dstDir = join(root, 'public', 'timeline')
const years = ['2021', '2022', '2023', '2024', '2025', '2026']

const map = {}
for (const year of years) {
  const yearSrc = join(srcDir, year)
  const yearDst = join(dstDir, year)

  // assets altinda klasor varsa public altina kopyalayalim
  if (existsSync(yearSrc)) {
    const files = readdirSync(yearSrc).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort()
    if (files.length) {
      mkdirSync(yearDst, { recursive: true })
      for (const f of files) copyFileSync(join(yearSrc, f), join(yearDst, f))
      map[year] = files.map((f) => `/timeline/${year}/${f}`)
    }
  } else if (existsSync(yearDst)) {
    // dogrudan public altindaki gorselleri tarayalim
    const files = readdirSync(yearDst).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort()
    if (files.length) {
      map[year] = files.map((f) => `/timeline/${year}/${f}`)
    }
  }
}

const out = join(root, 'data', 'timeline-photos.ts')
writeFileSync(out, `export const timelinePhotos: Record<string, string[]> = ${JSON.stringify(map, null, 2)}\n`)
console.log(`synced ${Object.values(map).flat().length} photos -> ${out}`)