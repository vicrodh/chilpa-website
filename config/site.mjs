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
  plugins: [
    { id: 'radio', repo: 'chilpa-pg-radio', icon: 'radio' },
    { id: 'podcasts', repo: 'chilpa-pg-podcasts', icon: 'microphone-2' },
    { id: 'dsp', repo: 'chilpa-pg-dsp', icon: 'adjustments' },
    { id: 'playlistImport', repo: 'chilpa-pg-playlist-import', icon: 'playlist-add' },
    { id: 'mood', repo: 'chilpa-pg-mood', icon: 'mood-smile' },
  ],
}

export const basePath = new URL(`${site.url}/`).pathname
