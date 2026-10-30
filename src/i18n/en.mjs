export default {
  lang: 'en',
  name: 'English',
  ogLocale: 'en_US',
  meta: {
    title: 'Chilpa · One Player to Rule Them All',
    description:
      'Open-source music player & library manager for Linux and macOS. Local-first. Bit-perfect. Built to scale.',
  },
  nav: {
    label: 'Main',
    features: 'Features',
    plugins: 'Plugins',
    downloads: 'Downloads',
    community: 'Community',
    github: 'Source on GitHub',
    toDark: 'Dark mode',
    toLight: 'Light mode',
    language: 'Language',
  },
  hero: {
    title: 'One Player to Rule Them All.',
    lead: 'Open-source music player & library manager. Local-first. Bit-perfect. Built to scale.',
    fromCreator: 'From the creator of {qbz}',
    downloadFor: 'Download for {platform}',
    allDownloads: 'View all downloads',
    installLabel: 'Or install from the terminal on Linux and macOS',
  },
  toc: {
    title: 'Contents',
    bitPerfect: 'Bit-perfect',
    library: 'Library',
    devices: 'Device Sync',
    lyrics: 'Lyrics and immersive',
    plugins: 'Plugins and SDK',
    privacy: 'Privacy',
    platforms: 'Platforms',
    community: 'Community',
    faq: 'FAQ',
  },
  bitPerfect: {
    title: 'Bit-perfect and HiFi Wizard',
    body: 'The output shows the actual format reaching the DAC and whether any processing happened. Exclusive mode, direct ALSA, PipeWire, PulseAudio and JACK. Native DSD and DoP.',
    formatsLabel: 'Formats:',
    formats: 'FLAC, ALAC, WAV, AIFF, MP3, Ogg Vorbis, DSD (DSF, DFF without DST compression, SACD ISO) and audio CD.',
  },
  library: {
    title: 'Library',
    body: 'Built from the database up for tens of thousands of tracks. Editions of the same album, multi-disc releases, classical works and composers, labels and a metadata editor.',
    more: 'Multiple queues, playlists, smart playlists and search. Listening stats with history and export. Scrobbling to Last.fm and ListenBrainz.',
    refineBody:
      'One query, three ways to edit it. In Columns, a click includes a value and − excludes it. The panel shows each condition as a readable row, with "all" or "any" groups. The console takes the same query as text. All three write the same query.',
    readAs:
      '"Read as" shows what the engine decided on its own, such as a name resolved to a composer or an alias, and you can remove it.',
  },
  devices: {
    title: 'Device Sync',
    body: "Sync your DAP, whether it's connected directly over USB or you plug in its microSD card. Quick and easy: no Android File Transfer hell on macOS, no MTP hell on Linux. Just connect and transfer, with memory and history.",
    verify: 'You can also verify your transfers, so there are no more surprises with corrupted files halfway through a listening session. A nod to the past and the good old days of iTunes.',
  },
  lyrics: {
    title: 'Lyrics and immersive view',
    lyrics: 'Lyrics synced by line and by word, translated into your language.',
    visuals: 'Visualizers that react to the audio, a background taken from the cover art, and a mini player.',
    themes: '36 themes, an automatic one and a theme editor. Eight languages. Command line and configurable shortcuts; fully usable without a mouse.',
  },
  plugins: {
    title: 'Plugins and SDK',
    body: 'Every external integration lives in its own plugin. WebAssembly plugins and sandboxed native plugins (bubblewrap on Linux, Seatbelt on macOS); each declares permissions you approve.',
    names: {
      radio: 'Radio',
      podcasts: 'Podcasts',
      dsp: 'DSP and equalizer',
      playlistImport: 'Playlist importer',
      mood: 'Local mood analysis (experimental)',
    },
    sdkTitle: 'Write a plugin',
    sdkBody: 'The public SDK documents the API and contracts, and gives access to the playback engine.',
    catalog: 'Official plugin catalog →',
  },
  privacy: {
    title: 'Privacy and offline mode',
    body: 'Zero telemetry. The Chilpa proxy, lyrics API, MusicBrainz, Last.fm and ListenBrainz are optional, each with its own switch. Offline mode blocks all network access for Chilpa and its plugins; local playback keeps working.',
  },
  platforms: {
    title: 'Platforms and downloads',
    recommended: 'Recommended',
    download: 'Download',
    downloadArch: 'Download {format} for {arch}',
    stores: 'Repositories and stores',
    quarantineTitle: 'If macOS refuses to open Chilpa, remove the quarantine flag once:',
    quarantine: { installer: 'Installed with the script', manual: 'Installed from the DMG or ZIP' },
    copy: 'Copy',
    copied: 'Copied',
    unavailable: 'The packages are on the releases page on GitHub.',
    toReleases: 'Releases on GitHub',
    changes: 'Changes between versions',
    from: 'from',
    to: 'to',
    allReleases: 'All releases on GitHub →',
    noNotes: 'This release has no notes.',
  },
  community: {
    title: 'Community',
    discussions: 'Discussions',
    issues: 'Issues',
    source: 'Source',
  },
  faq: {
    title: 'FAQ',
    note: 'Disclaimer: this section is full of references to QBZ.',
    ringQuote: 'Ash Nazg durbatulûk, ash Nazg gimbatul, ash Nazg thrakatulûk agh burzum-ishi krimpatul',
    items: [
      {
        q: 'Is Chilpa a vibe-coded app?',
        a: "Yes. When I started QBZ it was for myself: I built it because there was no Qobuz client for Linux, and although I admire Strawberry a lot (Chilpa takes several of its features as inspiration), I have a love/hate relationship with it, so I didn't want to use the web player and I didn't want to fight with Strawberry's search either. First I made a small CLI client based on the Python downloaders, then I turned it into an API, then I fell for the Rust hype (for the better) and decided to migrate the project to that language, all by hand, as a POC, as a hobby. When LLMs went mainstream I dusted the project off, and that's when it saw the light: over its 9 months of life it became the reference open-source streaming player. Its core was hand-written code; its evolution was vibe-coded. Chilpa, on the other hand, is 99% vibe-coded: it already had all the logic, the ADRs and, above all, the community's feedback. I have written no more than 200 lines of Chilpa's code, plus several unit tests; being optimistic, that's 1% of the code, and that's rounding up. So yes, Chilpa is a vibe-coded app. It's built responsibly, with good practices, ADRs, SOLID and the workflows I use in my real job, but it's still vibe code. If that's a problem for you, Chilpa is probably not for you.",
      },
      {
        q: 'Why make Chilpa?',
        a: "I could start the speech like everyone else: \"There was no app like this, so I decided to make my own\". The truth is that the music app market is huge right now; new ones show up every week, some with one feature, some with another. Chilpa exists because when QBZ died, my ADHD was left without its hyperfocus, and it's not nice when a person with ADHD has their hyperfocus taken away abruptly. That's the main reason. The second one, but no less important: QBZ didn't just show that there is a gap to fill, it also gathered a huge amount of community feedback that gave it life and made it relevant. Ignoring that feedback, that know-how and those bug reports would be almost a sin. Companies pay for the feedback QBZ received kindly from every user who used it, and there are companies (cough, cough) that simply decide to ignore their community, the one that pays. In the open-source world we do things differently. That's why Chilpa exists, and if it has half the users QBZ had, that alone will be a success.",
      },
      {
        q: "I've tried Chilpa, you should commercialize it.",
        a: 'No. Chilpa is and will always be free and open source. Even if there are sponsors or whatever, it will never have a premium tier or premium features. A comment, a donation, a PR and an issue are equally valuable.',
      },
      {
        q: "The page title is pretty pretentious, don't you think?",
        a: "Ah, yes. I didn't write it with airs of grandeur, but as a reference: {quote}.",
      },
      {
        q: 'Will there be a Windows version?',
        a: "Yes. It's just that I don't have a permanent Windows computer: I set up a temporary install for QBZ, but I deleted it and haven't made another. It will come, but once the initial version stabilizes a bit more.",
      },
      {
        q: 'What about a headless daemon?',
        a: "Of course. The idea is for Chilpa not to depend on the streaming services' *-connect protocols. Again: a single option, with usage standards, easy to use.",
      },
      {
        q: 'A mobile version?',
        a: "Yes. It will go hand in hand with the headless version.",
      },
    ],
  },
  footer: {
    source: 'Source',
    releases: 'Releases',
    sdk: 'SDK',
    plugins: 'Plugins',
  },
  notFound: 'This page does not exist.',
  captures: {
    pending: 'Screenshot pending · {name}',
    'main-window': {
      name: 'Main window',
      alt: "Chilpa's main window: Home with recently added and recently played albums, the sidebar and the player with an album playing",
    },
    'output-indicator': {
      name: 'Output indicator',
      alt: "The player's output indicator: a local DSD256 file going natively to a Fosi Audio ZH3 DAC over direct ALSA, marked bit-perfect",
    },
    'hifi-wizard': {
      name: 'HiFi Wizard',
      alt: 'HiFi Wizard at the Review & Apply step, with the PipeWire commands for the detected DAC, which Chilpa never writes on its own',
    },
    'artist-page': {
      name: 'Artist page',
      alt: 'Artist page with popular tracks, the latest release and the Network panel with labels and similar artists',
    },
    'library-refine': {
      name: 'Library with Refine open',
      alt: 'Library with Refine open: a condition on a library field and the albums that meet it',
    },
    devices: {
      name: 'Device Sync',
      alt: 'Device Sync page with a saved FiiO M21 microSD profile, the Music, Synced music and Changes tabs, and a list of playlists selected to sync',
    },
    immersive: {
      name: 'Immersive view',
      alt: 'Immersive view: the current lyric line beside the cover, over a background taken from it',
    },
    'settings-privacy': {
      name: 'Settings › Integrations',
      alt: 'Settings with offline mode on: the Chilpa proxy and scrobbling are disabled',
    },
  },
}
