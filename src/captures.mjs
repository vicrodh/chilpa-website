// Resolves each screenshot to the files present in public/captures/.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { imageSize } from 'image-size'
import { captureExtensions, captures } from '../config/captures.mjs'

const themes = ['light', 'dark']

function find(dir, stem) {
  for (const ext of captureExtensions) {
    const name = `${stem}.${ext}`
    if (existsSync(join(dir, name))) return name
  }
  return null
}

function describe(dir, name) {
  const { width, height } = imageSize(readFileSync(join(dir, name)))
  return { file: `captures/${name}`, width, height }
}

// For every capture and language: one image per theme, or null for a pending
// capture.
export function resolveCaptures(dir, languages) {
  const resolved = {}
  const pending = []
  for (const [id, options] of Object.entries(captures)) {
    resolved[id] = { shape: options.shape, byLanguage: {} }
    for (const lang of languages) {
      const byTheme = {}
      for (const theme of themes) {
        const name =
          find(dir, `${id}-${lang}-${theme}`) ?? find(dir, `${id}-${theme}`) ?? find(dir, `${id}-${lang}`) ?? find(dir, id)
        byTheme[theme] = name ? describe(dir, name) : null
      }
      // A capture taken in one theme stands in for the other.
      byTheme.light ??= byTheme.dark
      byTheme.dark ??= byTheme.light
      resolved[id].byLanguage[lang] = byTheme.light ? byTheme : null
      if (!byTheme.light) pending.push(`${id} (${lang})`)
    }
  }
  return { resolved, pending }
}
