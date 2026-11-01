import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/* יוצר קובץ HTML אמיתי לכל כתובת של הבלוג, ואחריו מפת אתר ו-robots.txt */
const OUT_DIR = 'dist'
const SSR_DIR = 'dist-ssr'

const { paths, render, buildSitemap, buildRobots } = await import(
  pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href
)
const template = await readFile(join(OUT_DIR, 'blog', 'index.html'), 'utf8')

for (const path of paths) {
  const { html, head } = await render(path)
  const page = template.replace('<!--blog-head-->', () => head).replace('<!--blog-app-->', () => html)
  const dir = join(OUT_DIR, path)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), page)
}

await writeFile(join(OUT_DIR, 'sitemap.xml'), buildSitemap())
await writeFile(join(OUT_DIR, 'robots.txt'), buildRobots())
await rm(SSR_DIR, { recursive: true, force: true })

console.log(`blog: ${paths.length} pages prerendered`)
