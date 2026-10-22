// Tabler icons, inlined as SVG at build time so the page loads no icon font.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { raw } from './html.mjs'

// The package exports no entry for its SVG files, so they are read from disk.
const root = fileURLToPath(new URL('../node_modules/@tabler/icons/icons/outline/', import.meta.url))
const cache = new Map()

export function icon(name, className = '') {
  if (!cache.has(name)) {
    const source = readFileSync(`${root}${name}.svg`, 'utf8')
    const inner = source
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/, '')
      .replace(/\s*\n\s*/g, '')
    cache.set(name, inner)
  }
  const classes = ['ti', className].filter(Boolean).join(' ')
  return raw(
    `<svg class="${classes}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${cache.get(name)}</svg>`,
  )
}
