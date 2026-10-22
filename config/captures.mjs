// App screenshots. Drop a file in public/captures/ and the next build uses it.
// The build looks for the most specific name first, per language and theme:
//
//   <id>-<lang>-<theme>.<ext>   main-window-es-dark.webp
//   <id>-<theme>.<ext>          library-refine-light.webp
//   <id>-<lang>.<ext>           hifi-wizard-en.webp
//   <id>.<ext>                  immersive.webp
//
// with <ext> one of webp, png, jpg or avif. A capture without a file renders
// as a striped placeholder, and the build lists it as pending.
//
// `shape` sets the placeholder's proportions until the real file exists.
export const captures = {
  'main-window': { shape: 'wide' },
  'output-indicator': { shape: 'half' },
  'hifi-wizard': { shape: 'half' },
  'artist-page': { shape: 'wide' },
  'library-refine': { shape: 'wide' },
  immersive: { shape: 'half' },
  'settings-privacy': { shape: 'strip' },
}

export const captureExtensions = ['webp', 'png', 'jpg', 'avif']
