// Builds the static site into dist/.
//
//   node scripts/build.mjs                    reads releases from the GitHub API
//   node scripts/build.mjs --strict           fails instead of building without them
//   node scripts/build.mjs --releases <file>  reads a saved API response instead
//
// GITHUB_TOKEN, when set, authenticates the API calls (CI sets it).
import { createHash } from 'node:crypto'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { site } from '../config/site.mjs'
import { resolveCaptures } from '../src/captures.mjs'
import en from '../src/i18n/en.mjs'
import es from '../src/i18n/es.mjs'
import { renderNotes } from '../src/markdown.mjs'
import { absolute, homePage, languageScript, notFoundPage, rootPage, themeScript } from '../src/pages.mjs'
import { buildDownloads, fetchReleases, stableReleases } from '../src/releases.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const locales = { es, en }

const { values: args } = parseArgs({
  options: {
    releases: { type: 'string' },
    strict: { type: 'boolean', default: false },
  },
})

async function loadReleases() {
  if (args.releases) return JSON.parse(readFileSync(resolve(args.releases), 'utf8'))
  try {
    return await fetchReleases(site.repo, { token: process.env.GITHUB_TOKEN })
  } catch (error) {
    if (args.strict) throw error
    console.warn(`warning: ${error.message}; building without release data`)
    return []
  }
}

const digest = (content, encoding = 'hex') => createHash('sha256').update(content).digest(encoding)
const scriptHash = (source) => `'sha256-${digest(source, 'base64')}'`

function contentSecurityPolicy(inlineScripts) {
  return [
    "default-src 'none'",
    `script-src 'self' ${inlineScripts.map(scriptHash).join(' ')}`,
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ')
}

// Copies a stylesheet or script and returns its path with a content hash as
// cache buster.
function emitAsset(name) {
  const content = readFileSync(join(root, 'src/assets', name))
  writeFileSync(join(dist, 'assets', name), content)
  return `assets/${name}?v=${digest(content).slice(0, 10)}`
}

function sitemap() {
  const alternates = [
    ...site.languages.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${absolute(`${code}/`)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute()}"/>`,
  ].join('\n')
  const urls = site.languages
    .map((code) => `  <url>\n    <loc>${absolute(`${code}/`)}</loc>\n${alternates}\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
}

const raw = await loadReleases()
const releases = stableReleases(raw).map((release) => ({ ...release, notes: renderNotes(release.body, release.tag) }))
const downloads = buildDownloads(releases)
const { resolved: captures, pending } = resolveCaptures(join(root, 'public/captures'), site.languages)

rmSync(dist, { recursive: true, force: true })
cpSync(join(root, 'public'), dist, { recursive: true, filter: (source) => !source.endsWith('.gitkeep') })
mkdirSync(join(dist, 'assets'), { recursive: true })
mkdirSync(join(dist, 'fonts'), { recursive: true })

const fontPackage = join(root, 'node_modules/@fontsource-variable/inter')
cpSync(join(fontPackage, 'files/inter-latin-wght-normal.woff2'), join(dist, 'fonts/inter-latin-wght-normal.woff2'))
cpSync(join(fontPackage, 'LICENSE'), join(dist, 'fonts/Inter-OFL.txt'))

const assets = {
  css: emitAsset('site.css'),
  js: emitAsset('site.js'),
  font: 'fonts/inter-latin-wght-normal.woff2',
}

for (const lang of site.languages) {
  mkdirSync(join(dist, lang), { recursive: true })
  const page = homePage({
    t: locales[lang],
    lang,
    locales,
    downloads,
    releases,
    captures,
    assets,
    csp: contentSecurityPolicy([themeScript]),
  })
  writeFileSync(join(dist, lang, 'index.html'), page)
}

writeFileSync(join(dist, 'index.html'), rootPage({ locales, assets, csp: contentSecurityPolicy([themeScript, languageScript]) }))
writeFileSync(join(dist, '404.html'), notFoundPage({ locales, assets, csp: contentSecurityPolicy([themeScript]) }))
writeFileSync(join(dist, 'sitemap.xml'), sitemap())
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absolute('sitemap.xml')}\n`)

const release = downloads.release
console.log(`site: ${site.url}`)
console.log(`releases: ${releases.length} stable${release ? `, downloads from ${release.tag} (${release.date})` : ', no downloads'}`)
for (const platform of downloads.platforms) {
  console.log(`  ${platform.label}: ${platform.formats.map((format) => `${format.label} [${format.assets.map((asset) => asset.arch).join(', ')}]`).join(', ')}`)
}
console.log(pending.length ? `pending captures: ${pending.join(', ')}` : 'pending captures: none')
