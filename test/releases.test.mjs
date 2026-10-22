import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { buildDownloads, classifyAsset, fetchReleases, stableReleases } from '../src/releases.mjs'

const fixture = JSON.parse(readFileSync(new URL('./fixtures/releases.json', import.meta.url), 'utf8'))

test('assets from the release contract map to platform, format and architecture', () => {
  const cases = {
    'Chilpa-0.1.0-x86_64.AppImage': ['linux', 'appimage', 'x86_64'],
    'Chilpa-0.1.0-aarch64.AppImage': ['linux', 'appimage', 'arm64'],
    'chilpa_0.1.0_amd64.deb': ['linux', 'deb', 'x86_64'],
    'chilpa_0.1.0_arm64.deb': ['linux', 'deb', 'arm64'],
    'chilpa-0.1.0-1.x86_64.rpm': ['linux', 'rpm', 'x86_64'],
    'chilpa-0.1.0-1.aarch64.rpm': ['linux', 'rpm', 'arm64'],
    'chilpa-0.1.0-linux-x86_64.tar.gz': ['linux', 'tarball', 'x86_64'],
    'Chilpa-0.1.0-macos-aarch64.dmg': ['macos', 'dmg', 'arm64'],
    'Chilpa-0.1.0-macos-x86_64.dmg': ['macos', 'dmg', 'x86_64'],
  }
  for (const [name, [platform, format, arch]] of Object.entries(cases)) {
    assert.deepEqual(classifyAsset(name), { platform, format, arch }, name)
  }
})

test('updater files, manifests, checksums and the installer are not offered', () => {
  for (const name of [
    'Chilpa-0.1.0-x86_64.AppImage.zsync',
    'Chilpa-0.1.0-macos-aarch64.zip',
    'MANIFEST-linux-x86_64.json',
    'MANIFEST-macos-aarch64.json',
    'SHA256SUMS',
    'SHA256SUMS-linux-x86_64',
    'install.sh',
    'RELEASE-NOTES.md',
  ]) {
    assert.equal(classifyAsset(name), null, name)
  }
})

test('drafts and pre-releases are left out, newest first', () => {
  const releases = stableReleases(fixture)
  assert.deepEqual(
    releases.map((release) => release.tag),
    ['v0.2.0', 'v0.1.0'],
  )
  assert.equal(releases[0].date, '2026-11-02')
})

test('downloads come from the newest stable release, per platform and architecture', () => {
  const downloads = buildDownloads(stableReleases(fixture))
  assert.equal(downloads.release.tag, 'v0.2.0')
  assert.deepEqual(
    downloads.platforms.map((platform) => platform.id),
    ['linux', 'macos'],
  )
  const [linux, macos] = downloads.platforms
  assert.deepEqual(
    linux.formats.map((format) => format.id),
    ['appimage', 'deb', 'rpm', 'tarball'],
  )
  assert.deepEqual(
    linux.formats[0].assets.map((asset) => asset.arch),
    ['x86_64', 'arm64'],
  )
  assert.equal(linux.hero.url, 'https://github.com/vicrodh/chilpa/releases/download/v0.2.0/Chilpa-0.2.0-x86_64.AppImage')
  assert.equal(macos.hero.url, 'https://github.com/vicrodh/chilpa/releases/download/v0.2.0/Chilpa-0.2.0-macos-aarch64.dmg')
  assert.equal(macos.label, 'macOS')
  assert.equal(linux.formats[0].recommended, true)
  assert.equal(macos.formats[0].recommended, false, 'a single package is not labeled as recommended')
})

test('macOS reads "Apple Silicon" while every macOS package is arm64', () => {
  const releases = stableReleases(fixture).map((release) => ({
    ...release,
    assets: release.assets.filter((asset) => !asset.name.includes('macos-x86_64')),
  }))
  const macos = buildDownloads(releases).platforms.find((platform) => platform.id === 'macos')
  assert.equal(macos.label, 'macOS (Apple Silicon)')
})

test('a platform without packages in the release is not listed', () => {
  const releases = stableReleases(fixture).map((release) => ({
    ...release,
    assets: release.assets.filter((asset) => !asset.name.includes('macos')),
  }))
  assert.deepEqual(
    buildDownloads(releases).platforms.map((platform) => platform.id),
    ['linux'],
  )
})

test('no stable release with packages gives no downloads', () => {
  assert.deepEqual(buildDownloads([]), { release: null, platforms: [] })
})

test('the API is read page by page until a short page', async () => {
  const pages = [Array.from({ length: 100 }, (_, i) => ({ id: i })), [{ id: 100 }]]
  const seen = []
  const fetchImpl = async (url) => {
    seen.push(new URL(url).searchParams.get('page'))
    return { ok: true, json: async () => pages[seen.length - 1] }
  }
  const all = await fetchReleases('vicrodh/chilpa', { fetchImpl })
  assert.equal(all.length, 101)
  assert.deepEqual(seen, ['1', '2'])
})

test('an API error stops the read', async () => {
  const fetchImpl = async () => ({ ok: false, status: 403, headers: new Headers({ 'x-ratelimit-remaining': '0' }) })
  await assert.rejects(fetchReleases('vicrodh/chilpa', { fetchImpl }), /403.*remaining: 0/)
})
