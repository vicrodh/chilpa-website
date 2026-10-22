// Release data from the GitHub REST API, read once per build. The visitor's
// browser never calls GitHub.
import { archAliases, archOrder, formats, platforms, stores } from '../config/downloads.mjs'

const API = 'https://api.github.com'
const PAGE_SIZE = 100
const MAX_PAGES = 20

export async function fetchReleases(repo, { token, fetchImpl = fetch } = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'chilpa-website-build',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const all = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const response = await fetchImpl(`${API}/repos/${repo}/releases?per_page=${PAGE_SIZE}&page=${page}`, { headers })
    if (!response.ok) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      throw new Error(`GitHub answered ${response.status} for page ${page} of ${repo} releases (rate limit remaining: ${remaining ?? 'unknown'})`)
    }
    const batch = await response.json()
    all.push(...batch)
    if (batch.length < PAGE_SIZE) return all
  }
  throw new Error(`${repo} has more than ${PAGE_SIZE * MAX_PAGES} releases; raise MAX_PAGES`)
}

// Published releases with a tag, newest first. Drafts and pre-releases are out.
export function stableReleases(raw) {
  return raw
    .filter((release) => !release.draft && !release.prerelease && release.tag_name && release.published_at)
    .map((release) => ({
      tag: release.tag_name,
      date: release.published_at.slice(0, 10),
      publishedAt: release.published_at,
      url: release.html_url,
      body: release.body ?? '',
      assets: (release.assets ?? [])
        .filter((asset) => asset.state === undefined || asset.state === 'uploaded')
        .map((asset) => ({ name: asset.name, url: asset.browser_download_url, size: asset.size })),
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function classifyAsset(name) {
  for (const format of formats) {
    const match = format.pattern.exec(name)
    if (match) {
      return { format: format.id, platform: format.platform, arch: archAliases[match.groups?.arch] ?? null }
    }
  }
  return null
}

const archRank = (arch) => {
  const rank = archOrder.indexOf(arch)
  return rank === -1 ? archOrder.length : rank
}

// The download model: the newest stable release that carries at least one
// package we offer, and per platform the packages it has.
export function buildDownloads(releases) {
  const release = releases.find((candidate) => candidate.assets.some((asset) => classifyAsset(asset.name)))
  if (!release) return { release: null, platforms: [] }

  const items = release.assets
    .map((asset) => ({ ...asset, ...classifyAsset(asset.name) }))
    .filter((item) => item.format)
    .sort((a, b) => archRank(a.arch) - archRank(b.arch))

  const list = platforms
    .map((platform) => {
      const own = items.filter((item) => item.platform === platform.id)
      if (own.length === 0) return null
      const platformStores = stores.filter((store) => store.platform === platform.id && store.enabled && store.command)
      const storeRecommended = platformStores.some((store) => store.recommended)
      const groups = formats
        .filter((format) => format.platform === platform.id)
        .map((format) => ({
          id: format.id,
          label: format.label,
          description: format.description,
          isDefault: Boolean(format.recommended),
          recommended: Boolean(format.recommended) && !storeRecommended,
          assets: own.filter((item) => item.format === format.id),
        }))
        .filter((group) => group.assets.length > 0)
      // "Recommended" only means something when there is a choice.
      if (groups.length + platformStores.length < 2) for (const group of groups) group.recommended = false
      const archs = archOrder.filter((arch) => own.some((item) => item.arch === arch))
      const armOnly = archs.length === 1 && archs[0] === 'arm64'
      const main = groups.find((group) => group.isDefault) ?? groups[0]
      const byArch = Object.fromEntries(main.assets.map((asset) => [asset.arch ?? 'any', asset.url]))
      const defaultArch = platform.defaultArch in byArch ? platform.defaultArch : Object.keys(byArch)[0]
      return {
        id: platform.id,
        icon: platform.icon,
        label: armOnly && platform.labelArm64Only ? platform.labelArm64Only : platform.label,
        notice: platform.notice ?? null,
        archs,
        formats: groups,
        stores: platformStores.map((store) => ({ ...store, recommended: Boolean(store.recommended) })),
        hero: { byArch, defaultArch, url: byArch[defaultArch] },
      }
    })
    .filter(Boolean)

  return { release: { tag: release.tag, date: release.date, url: release.url }, platforms: list }
}
