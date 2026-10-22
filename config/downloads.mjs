// Which release assets the site offers, and under which platform.
//
// The patterns follow the published asset contract in vicrodh/chilpa,
// scripts/release_platform.py (linux_assets and macos_assets). An asset that
// matches no pattern is not offered: checksums, manifests, the AppImage zsync
// file, the macOS ZIP the updater uses and install.sh stay out.
//
// A platform is listed only when the latest release has at least one asset for
// it, so a new platform shows up by adding it here with its formats; the page
// code does not change. Each pattern captures the architecture as `arch`.

export const platforms = [
  {
    id: 'linux',
    icon: 'device-desktop',
    label: 'Linux',
    // The architecture the download buttons offer when the visitor's is unknown.
    defaultArch: 'x86_64',
  },
  {
    id: 'macos',
    icon: 'brand-apple',
    label: 'macOS',
    defaultArch: 'arm64',
    // Used while every macOS asset of the release is arm64.
    labelArm64Only: 'macOS (Apple Silicon)',
    notice: {
      es: 'Sin notarizar por Apple: la primera vez, macOS bloquea la apertura. Ve a Ajustes del Sistema › Privacidad y seguridad y elige "Abrir de todos modos".',
      en: 'Not notarized by Apple: macOS blocks the first launch. Go to System Settings › Privacy & Security and choose "Open Anyway".',
    },
  },
]

export const formats = [
  {
    id: 'appimage',
    platform: 'linux',
    label: 'AppImage',
    recommended: true,
    pattern: /^Chilpa-.+-(?<arch>x86_64|aarch64)\.AppImage$/,
    description: { es: 'Un archivo, cualquier distribución', en: 'One file, any distribution' },
  },
  {
    id: 'deb',
    platform: 'linux',
    label: '.deb',
    pattern: /^chilpa_.+_(?<arch>amd64|arm64)\.deb$/,
    description: { es: 'Debian, Ubuntu', en: 'Debian, Ubuntu' },
  },
  {
    id: 'rpm',
    platform: 'linux',
    label: '.rpm',
    pattern: /^chilpa-.+-\d+\.(?<arch>x86_64|aarch64)\.rpm$/,
    description: { es: 'Fedora, openSUSE', en: 'Fedora, openSUSE' },
  },
  {
    id: 'tarball',
    platform: 'linux',
    label: '.tar.gz',
    pattern: /^chilpa-.+-linux-(?<arch>x86_64|aarch64)\.tar\.gz$/,
    description: { es: 'Binario genérico', en: 'Generic binary' },
  },
  {
    id: 'dmg',
    platform: 'macos',
    label: '.dmg',
    recommended: true,
    pattern: /^Chilpa-.+-macos-(?<arch>x86_64|aarch64)\.dmg$/,
    description: { es: 'Firma propia (self-signed)', en: 'Self-signed' },
  },
]

// Repositories and stores. An entry is shown only with `enabled: true` and a
// `command` to copy. `recommended: true` moves the "Recommended" label from the
// platform's recommended package to the store.
export const stores = [
  { id: 'flathub', platform: 'linux', label: 'Flathub', icon: 'package', command: null, enabled: false },
  { id: 'snap', platform: 'linux', label: 'Snap', icon: 'box', command: null, enabled: false },
  { id: 'aur', platform: 'linux', label: 'AUR', icon: 'terminal-2', command: null, enabled: false },
  { id: 'apt', platform: 'linux', label: 'APT', icon: 'server', command: null, enabled: false },
  { id: 'dnf', platform: 'linux', label: 'DNF', icon: 'server', command: null, enabled: false },
  { id: 'homebrew', platform: 'macos', label: 'Homebrew', icon: 'terminal-2', command: null, enabled: false },
]

export const archAliases = { x86_64: 'x86_64', amd64: 'x86_64', aarch64: 'arm64', arm64: 'arm64' }
export const archOrder = ['x86_64', 'arm64']
