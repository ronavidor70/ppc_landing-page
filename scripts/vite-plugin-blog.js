import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { marked } from 'marked'

const POST_ID = /\.md\?post-(meta|body)$/
const REQUIRED_FIELDS = ['title', 'description', 'date', 'category', 'cover', 'coverAlt']

/* מפרק קובץ מאמר לפרטים (בין שורות ה- ---) ולגוף המאמר. שדה חסר עוצר את הבנייה. */
function parsePost(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: חסר בלוק פרטים בראש הקובץ (--- ... ---)`)

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^"(.*)"$/, '$1')
  }

  const missing = REQUIRED_FIELDS.filter((field) => !meta[field])
  if (missing.length) throw new Error(`${file}: חסרים השדות ${missing.join(', ')}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: התאריך חייב להיות בפורמט YYYY-MM-DD`)

  const body = match[2]
  return {
    meta: {
      ...meta,
      slug: basename(file, '.md'),
      readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    },
    body,
  }
}

export default function blogPlugin() {
  return {
    name: 'ctr-blog',
    enforce: 'pre',

    /* פרטי המאמר וגוף המאמר נטענים בנפרד, כדי שעמוד לא ישא את הטקסט של כל המאמרים */
    load(id) {
      const match = id.match(POST_ID)
      if (!match) return null
      const file = id.split('?')[0]
      this.addWatchFile(file)
      const { meta, body } = parsePost(readFileSync(file, 'utf8'), file)
      const value = match[1] === 'meta' ? meta : marked.parse(body)
      return { code: `export default ${JSON.stringify(value)}`, moduleType: 'js' }
    },

    /* בפיתוח אין דפים סטטיים — כל כתובת של הבלוג מקבלת את אותו ה-HTML */
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url.split('?')[0]
        if (/^\/blog(\/[^.]*)?$/.test(path)) req.url = '/blog/index.html'
        next()
      })
    },
  }
}
