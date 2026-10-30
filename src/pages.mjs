import { basePath, site } from '../config/site.mjs'
import { platforms as platformConfig } from '../config/downloads.mjs'
import { escape, fill, html, raw } from './html.mjs'
import { icon } from './icons.mjs'

export const href = (path = '') => `${basePath}${path}`
export const absolute = (path = '') => `${site.url}/${path}`

// The pages are dark by default; this runs before the first paint so a
// stored choice of the light theme applies at once.
export const themeScript =
  "(function(){var d=document.documentElement,t;d.classList.replace('no-js','js');try{t=localStorage.getItem('chilpa-theme')}catch(e){}if(t==='light')d.setAttribute('data-theme',t)})();"

// The root page sends the visitor to the stored language, else the browser's.
export const languageScript = `(function(){var l;try{l=localStorage.getItem('chilpa-lang')}catch(e){}if(l!=='es'&&l!=='en'){var n=(navigator.languages&&navigator.languages[0])||navigator.language||'';l=/^es/i.test(n)?'es':'en'}location.replace(${JSON.stringify(basePath)}+l+'/'+location.hash)})();`

function head({ lang, title, description, canonical, ogLocale, ogAlternates = [], assets, csp, robots, extraScripts = [] }) {
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<title>${title}</title>
<meta name="description" content="${description}">
${robots ? html`<meta name="robots" content="${robots}">` : ''}
${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
${site.languages.map((code) => html`<link rel="alternate" hreflang="${code}" href="${absolute(`${code}/`)}">`)}
<link rel="alternate" hreflang="x-default" href="${absolute()}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chilpa">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical ?? absolute()}">
<meta property="og:image" content="${absolute('brand/og.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Chilpa">
${ogLocale ? html`<meta property="og:locale" content="${ogLocale}">` : ''}
${ogAlternates.map((locale) => html`<meta property="og:locale:alternate" content="${locale}">`)}
<meta name="twitter:card" content="summary_large_image">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#140A0B">
<link rel="icon" href="${href('brand/icon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${href('brand/apple-touch-icon.png')}">
<link rel="preload" href="${href(assets.font)}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${href(assets.css)}">
<script>${raw(themeScript)}</script>
${extraScripts.map((source) => html`<script>${raw(source)}</script>`)}
${lang ? html`<script src="${href(assets.js)}" defer></script>` : ''}
</head>`
}

function lockup() {
  return html`<img class="lockup lockup-light" src="${href('brand/chilpa-lockup-light.svg')}" alt="" width="139" height="42"><img class="lockup lockup-dark" src="${href('brand/chilpa-lockup-dark.svg')}" alt="" width="138" height="42">`
}

function header(t) {
  const current = (code) => (code === t.lang ? raw(' aria-current="true"') : '')
  return html`<header class="site-header">
<div class="container header-row">
<a class="brand" href="${href(`${t.lang}/`)}" aria-label="Chilpa">${lockup()}</a>
<nav class="header-nav" aria-label="${t.nav.label}">
<a href="#bit-perfect">${t.nav.features}</a>
<a href="#plugins">${t.nav.plugins}</a>
<a href="#platforms">${t.nav.downloads}</a>
<a href="#community">${t.nav.community}</a>
</nav>
<div class="header-tools">
<a class="icon-link" href="${site.links.source}" aria-label="${t.nav.github}" title="${t.nav.github}">${icon('brand-github')}</a>
<button type="button" class="icon-button js-only" data-theme-toggle data-label-dark="${t.nav.toDark}" data-label-light="${t.nav.toLight}" aria-label="${t.nav.toDark}" title="${t.nav.toDark}">${icon('moon', 'when-light')}${icon('sun', 'when-dark')}</button>
<div class="lang-switch" role="group" aria-label="${t.nav.language}">
${site.languages.map((code) => html`<a href="${href(`${code}/`)}" hreflang="${code}" lang="${code}" data-lang-switch="${code}"${current(code)}>${code.toUpperCase()}</a>`)}
</div>
</div>
</div>
</header>`
}

function capture(ctx, id, { eager = false } = {}) {
  const { t, lang } = ctx
  const entry = ctx.captures[id]
  const text = t.captures[id]
  const files = entry.byLanguage[lang]
  if (!files) {
    return html`<div class="ph ph-${entry.shape}">${icon('photo')}<span>${fill(t.captures.pending, { name: text.name })}</span></div>`
  }
  const loading = eager ? raw(' fetchpriority="high"') : raw(' loading="lazy"')
  const image = (file, className) =>
    html`<img class="capture ${className}" src="${href(file.file)}" width="${file.width}" height="${file.height}" alt="${text.alt}" decoding="async"${loading}>`
  if (files.light.file === files.dark.file) return image(files.light, '')
  return html`${image(files.light, 'theme-light')}${image(files.dark, 'theme-dark')}`
}

// A command in a code block with its copy button.
function commandRow({ t }, { command, className }) {
  return html`<div class="${className}"><pre class="store-command"><code>${command}</code></pre><button type="button" class="icon-button js-only" data-copy="${command}" data-label-copied="${t.platforms.copied}" aria-label="${t.platforms.copy}" title="${t.platforms.copy}">${icon('copy', 'when-idle')}${icon('check', 'when-copied')}</button></div>`
}

function heroActions(ctx) {
  const { t, downloads } = ctx
  const entries = downloads.platforms.length
    ? downloads.platforms
    : platformConfig.map((platform) => ({
        id: platform.id,
        icon: platform.icon,
        label: platform.labelArm64Only ?? platform.label,
        hero: { byArch: {}, url: site.links.latestRelease },
      }))
  return entries.map((platform, index) => {
    const archLinks = Object.entries(platform.hero.byArch).map(([arch, url]) => raw(` data-href-${arch}="${escape(url)}"`))
    return html`<a class="btn${index === 0 ? ' btn-primary' : ''}" href="${platform.hero.url}" data-platform="${platform.id}"${archLinks}>${icon('download', 'when-primary')}${icon(platform.icon, 'when-secondary')}<span class="when-primary">${fill(t.hero.downloadFor, { platform: platform.label })}</span><span class="when-secondary">${platform.label}</span></a>`
  })
}

function hero(ctx) {
  const { t, downloads } = ctx
  const release = downloads.release
  return html`<section class="hero container" aria-labelledby="hero-title">
<h1 id="hero-title">${t.hero.title}</h1>
<p class="lead">${t.hero.lead}</p>
<p class="byline">${fill(t.hero.fromCreator, { qbz: html`<a href="${site.links.qbz}">QBZ</a>` })}</p>
<div class="hero-actions" data-hero>
${heroActions(ctx)}
</div>
<div class="hero-install">
<p class="hero-install-label">${t.hero.installLabel}</p>
${commandRow(ctx, { command: site.installCommand, className: 'install-line' })}
</div>
<p class="hero-meta">${release ? html`<a href="${release.url}">${release.tag}</a> · <time datetime="${release.date}">${release.date}</time> · ` : ''}<a class="text-link" href="#platforms">${t.hero.allDownloads}</a></p>
<div class="hero-capture">${capture(ctx, 'main-window', { eager: true })}</div>
</section>`
}

const sections = ['bit-perfect', 'library', 'devices', 'lyrics', 'plugins', 'privacy', 'platforms', 'community', 'faq']
const tocKeys = {
  'bit-perfect': 'bitPerfect',
  library: 'library',
  devices: 'devices',
  lyrics: 'lyrics',
  plugins: 'plugins',
  privacy: 'privacy',
  platforms: 'platforms',
  community: 'community',
  faq: 'faq',
}

function toc(t) {
  return html`<nav class="toc" aria-label="${t.toc.title}">
<p class="toc-title">${t.toc.title}</p>
<ol>
${sections.map((id, index) => html`<li><a href="#${id}" data-toc="${id}"><span class="toc-number">${String(index + 1).padStart(2, '0')}</span> ${t.toc[tocKeys[id]]}</a></li>`)}
</ol>
</nav>`
}

function section(id, title, body) {
  const number = String(sections.indexOf(id) + 1).padStart(2, '0')
  return html`<section class="section" id="${id}" aria-labelledby="${id}-title">
<p class="section-number">${number}</p>
<h2 id="${id}-title">${title}</h2>
${body}
</section>`
}

function bitPerfect(ctx) {
  const { t } = ctx
  return section(
    'bit-perfect',
    t.bitPerfect.title,
    html`<p>${t.bitPerfect.body}</p>
<div class="pair">${capture(ctx, 'output-indicator')}${capture(ctx, 'hifi-wizard')}</div>
<p class="small"><strong>${t.bitPerfect.formatsLabel}</strong> ${t.bitPerfect.formats}</p>`,
  )
}

function library(ctx) {
  const { t } = ctx
  const chips = [
    ['server', 'Jellyfin'],
    ['server', 'Plex'],
    ['server', 'Navidrome'],
    ['server', '(Open)Subsonic'],
    ['cast', 'Chromecast'],
    ['cast', 'DLNA/UPnP'],
  ]
  return section(
    'library',
    t.library.title,
    html`<p>${t.library.body}</p>
${capture(ctx, 'artist-page')}
<ul class="chips">${chips.map(([name, label]) => html`<li class="chip">${icon(name)}${label}</li>`)}</ul>
<p class="small">${t.library.more}</p>
<div class="feature-box">
<h3>${icon('adjustments-search')}Refine</h3>
<p>${t.library.refineBody}</p>
<p class="small">${t.library.readAs}</p>
${capture(ctx, 'library-refine')}
</div>`,
  )
}

function devices(ctx) {
  const { t } = ctx
  return section(
    'devices',
    t.devices.title,
    html`<p>${t.devices.body}</p>
${capture(ctx, 'devices')}
<p class="small">${t.devices.verify}</p>`,
  )
}

function lyrics(ctx) {
  const { t } = ctx
  return section(
    'lyrics',
    t.lyrics.title,
    html`<div class="pair">
<div class="stack"><p>${t.lyrics.lyrics}</p><p>${t.lyrics.visuals}</p><p class="small">${t.lyrics.themes}</p></div>
${capture(ctx, 'immersive')}
</div>`,
  )
}

function plugins(ctx) {
  const { t } = ctx
  return section(
    'plugins',
    t.plugins.title,
    html`<p>${t.plugins.body}</p>
<ul class="plugin-list">
${site.plugins.map((plugin) => html`<li>${icon(plugin.icon)}<span class="plugin-name">${t.plugins.names[plugin.id]}</span><a class="plugin-repo" href="https://github.com/vicrodh/${plugin.repo}">${plugin.repo}</a></li>`)}
</ul>
<div class="sdk-callout">
<div><p class="sdk-title">${t.plugins.sdkTitle}</p><p class="sdk-body">${t.plugins.sdkBody}</p></div>
<a class="btn btn-inverse" href="${site.links.sdk}">${icon('code')}chilpa-plugins-sdk</a>
</div>
<p class="small"><a class="text-link" href="${site.links.catalog}">${t.plugins.catalog}</a></p>`,
  )
}

function privacy(ctx) {
  const { t } = ctx
  return section('privacy', t.privacy.title, html`<p>${t.privacy.body}</p>${capture(ctx, 'settings-privacy')}`)
}

function storeList(ctx, platform) {
  const { t } = ctx
  if (platform.stores.length === 0) return ''
  return html`<p class="stores-title">${t.platforms.stores}</p>
<ul class="stores">
${platform.stores.map((store) => html`<li class="store">${icon(store.icon)}<span class="store-name">${store.label}${store.recommended ? html` <span class="chip chip-small">${t.platforms.recommended}</span>` : ''}</span><pre class="store-command"><code>${store.command}</code></pre><button type="button" class="icon-button js-only" data-copy="${store.command}" data-label-copied="${t.platforms.copied}" aria-label="${t.platforms.copy}" title="${t.platforms.copy}">${icon('copy', 'when-idle')}${icon('check', 'when-copied')}</button></li>`)}
</ul>`
}

function quarantineList(ctx, platform) {
  const { t } = ctx
  if (platform.quarantine.length === 0) return ''
  return html`<p class="stores-title">${t.platforms.quarantineTitle}</p>
<ul class="stores">
${platform.quarantine.map((entry) => html`<li class="store">${icon('terminal-2')}<span class="store-name">${t.platforms.quarantine[entry.id]}</span><pre class="store-command"><code>${entry.command}</code></pre><button type="button" class="icon-button js-only" data-copy="${entry.command}" data-label-copied="${t.platforms.copied}" aria-label="${t.platforms.copy}" title="${t.platforms.copy}">${icon('copy', 'when-idle')}${icon('check', 'when-copied')}</button></li>`)}
</ul>`
}

function platformBlock(ctx, platform) {
  const { t, lang, downloads } = ctx
  const release = downloads.release
  return html`<div class="platform" id="download-${platform.id}">
<div class="platform-head">${icon(platform.icon)}<h3>${platform.label}</h3><span class="meta"><a href="${release.url}">${release.tag}</a> · <time datetime="${release.date}">${release.date}</time></span></div>
<ul class="packages">
${platform.formats.map((format) => html`<li class="package">
<span class="package-name">${format.label}</span>
<span class="package-description">${format.description[lang]}</span>
${format.recommended ? html`<span class="chip chip-small">${t.platforms.recommended}</span>` : ''}
<span class="package-links">${format.assets.map((asset) => html`<a class="btn btn-small" href="${asset.url}" aria-label="${fill(t.platforms.downloadArch, { format: format.label, arch: asset.arch ?? '' })}">${icon('download')}<span>${t.platforms.download}</span>${asset.arch ? html`<span class="arch">${asset.arch}</span>` : ''}</a>`)}</span>
</li>`)}
</ul>
${storeList(ctx, platform)}
${platform.notice ? html`<p class="notice">${platform.notice[lang]}</p>` : ''}
${quarantineList(ctx, platform)}
</div>`
}

function changes(ctx) {
  const { t, releases } = ctx
  const options = (selected) =>
    releases.map((release, index) => html`<option value="${index}"${index === selected ? raw(' selected') : ''}>${release.tag}</option>`)
  const select = (role, selected) =>
    html`<span class="select"><select data-changes-${role}>${options(selected)}</select>${icon('chevron-down')}</span>`
  return html`<div class="changes" data-changes>
<div class="changes-head">
<h3>${t.platforms.changes}</h3>
${releases.length > 1 ? html`<label class="js-only">${t.platforms.from} ${select('from', 1)}</label><label class="js-only">${t.platforms.to} ${select('to', 0)}</label>` : ''}
</div>
<div class="changes-body">
${releases.map((release, index) => html`<article class="release" data-index="${index}"${index === 0 ? '' : raw(' hidden')}>
<div class="release-head"><a href="${release.url}"><strong>${release.tag}</strong></a><time datetime="${release.date}">${release.date}</time></div>
${release.notes ? html`<div class="notes" lang="${site.releaseNotesLanguage}">${raw(release.notes)}</div>` : html`<p class="small muted">${t.platforms.noNotes}</p>`}
</article>`)}
<p class="small"><a class="text-link" href="${site.links.releases}">${t.platforms.allReleases}</a></p>
</div>
</div>`
}

function platformsSection(ctx) {
  const { t, downloads } = ctx
  const body = downloads.platforms.length
    ? html`<div class="downloads">${downloads.platforms.map((platform) => platformBlock(ctx, platform))}</div>`
    : html`<div class="downloads downloads-empty"><p>${t.platforms.unavailable}</p><a class="btn" href="${site.links.latestRelease}">${icon('download')}${t.platforms.toReleases}</a></div>`
  return section('platforms', t.platforms.title, html`${body}${changes(ctx)}`)
}

function community(ctx) {
  const { t } = ctx
  return section(
    'community',
    t.community.title,
    html`<div class="button-row">
<a class="btn" href="${site.links.discussions}">${icon('message-circle')}${t.community.discussions}</a>
<a class="btn" href="${site.links.issues}">${icon('bug')}${t.community.issues}</a>
<a class="btn" href="${site.links.source}">${icon('brand-github')}${t.community.source}</a>
</div>`,
  )
}

function faq(ctx) {
  const { t } = ctx
  const quote = html`<i>${t.faq.ringQuote}</i>`
  return section(
    'faq',
    t.faq.title,
    html`<p class="small muted">${t.faq.note}</p>
<div class="faq">
${t.faq.items.map((item) => html`<div class="faq-item">
<h3>${item.q}</h3>
<p>${fill(item.a, { quote })}</p>
</div>`)}
</div>`,
  )
}

function footer(t) {
  const links = [
    [site.links.source, t.footer.source],
    [site.links.releases, t.footer.releases],
    [site.links.sdk, t.footer.sdk],
    [site.links.catalog, t.footer.plugins],
  ]
  return html`<footer class="site-footer">
<div class="container footer-row">
<span>Chilpa · MIT</span>
<p class="footer-links">${links.map(([url, label], index) => html`${index ? ' · ' : ''}<a href="${url}">${label}</a>`)}</p>
</div>
</footer>`
}

export function homePage(ctx) {
  const { t, assets, csp } = ctx
  const others = site.languages.filter((code) => code !== t.lang).map((code) => ctx.locales[code].ogLocale)
  return `<!doctype html>
<html lang="${t.lang}" class="no-js" data-theme="dark">
${head({
  lang: t.lang,
  title: t.meta.title,
  description: t.meta.description,
  canonical: absolute(`${t.lang}/`),
  ogLocale: t.ogLocale,
  ogAlternates: others,
  assets,
  csp,
})}
<body>
${header(t)}
<main>
${hero(ctx)}
<div class="layout-band">
<div class="layout container">
${toc(t)}
<div class="sections">
${bitPerfect(ctx)}
${library(ctx)}
${devices(ctx)}
${lyrics(ctx)}
${plugins(ctx)}
${privacy(ctx)}
${platformsSection(ctx)}
${community(ctx)}
${faq(ctx)}
</div>
</div>
</div>
</main>
${footer(t)}
</body>
</html>
`
}

export function rootPage({ locales, assets, csp }) {
  const es = locales.es
  const en = locales.en
  return `<!doctype html>
<html lang="en" class="no-js" data-theme="dark">
${head({
  title: 'Chilpa',
  description: `${en.meta.description} · ${es.meta.description}`,
  assets,
  csp,
  extraScripts: [languageScript],
})}
<body class="center-page">
<main class="chooser">
<p class="chooser-brand">${lockup()}</p>
<h1 class="visually-hidden">Chilpa</h1>
<ul class="chooser-links">
${html`${[es, en].map((t) => html`<li lang="${t.lang}"><a class="btn" href="${href(`${t.lang}/`)}" hreflang="${t.lang}">${t.name}</a><span>${t.hero.title}</span></li>`)}`}
</ul>
</main>
</body>
</html>
`
}

export function notFoundPage({ locales, assets, csp }) {
  return `<!doctype html>
<html lang="en" class="no-js" data-theme="dark">
${head({ title: 'Chilpa · 404', description: locales.en.meta.description, assets, csp, robots: 'noindex' })}
<body class="center-page">
<main class="chooser">
<p class="chooser-brand"><a href="${href()}" aria-label="Chilpa">${lockup()}</a></p>
<h1>404</h1>
<ul class="chooser-links">
${html`${[locales.es, locales.en].map((t) => html`<li lang="${t.lang}"><a class="btn" href="${href(`${t.lang}/`)}" hreflang="${t.lang}">${t.name}</a><span>${t.notFound}</span></li>`)}`}
</ul>
</main>
</body>
</html>
`
}
