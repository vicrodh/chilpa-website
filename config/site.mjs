// Site-wide settings. SITE_URL overrides the address the pages are built for,
// for example a GitHub Pages preview before the custom domain points here.
export const site = {
  url: (process.env.SITE_URL ?? 'https://chilpa.app').replace(/\/+$/, ''),
  repo: 'vicrodh/chilpa',
  languages: ['es', 'en'],
  // Release notes are written in English; the page marks them so.
  releaseNotesLanguage: 'en',
  links: {
    source: 'https://github.com/vicrodh/chilpa',
    releases: 'https://github.com/vicrodh/chilpa/releases',
    latestRelease: 'https://github.com/vicrodh/chilpa/releases/latest',
    discussions: 'https://github.com/vicrodh/chilpa/discussions',
    issues: 'https://github.com/vicrodh/chilpa/issues',
    sdk: 'https://github.com/vicrodh/chilpa-plugins-sdk',
    catalog: 'https://github.com/vicrodh/chilpa-plugins',
    qbz: 'https://github.com/vicrodh/qbz',
  },
  // The one-line installer; chilpa.app/install.sh redirects to the latest release's script.
  installCommand: "curl -fsSL --proto '=https' https://chilpa.app/install.sh | bash",
  // Page analytics: Umami Cloud and GoatCounter. The hosts are also what the
  // Content-Security-Policy lets the page load from and report to.
  analytics: {
    umami: { script: 'https://cloud.umami.is/script.js', websiteId: 'ba484f73-eff7-435a-b162-2248a2d07c3d', connect: ['https://api-gateway.umami.dev', 'https://cloud.umami.is'] },
    goatcounter: { endpoint: 'https://blitzfc.goatcounter.com/count', script: '//gc.zgo.at/count.js', scriptOrigin: 'https://gc.zgo.at', origin: 'https://blitzfc.goatcounter.com' },
  },
  plugins: [
    { id: 'radio', repo: 'chilpa-pg-radio', icon: 'radio' },
    { id: 'podcasts', repo: 'chilpa-pg-podcasts', icon: 'microphone-2' },
    { id: 'dsp', repo: 'chilpa-pg-dsp', icon: 'adjustments' },
    { id: 'playlistImport', repo: 'chilpa-pg-playlist-import', icon: 'playlist-add' },
    { id: 'mood', repo: 'chilpa-pg-mood', icon: 'mood-smile' },
  ],
}

export const basePath = new URL(`${site.url}/`).pathname
