export default {
  lang: 'es',
  name: 'Español',
  ogLocale: 'es_MX',
  meta: {
    title: 'Chilpa · Un reproductor para gobernarlos a todos',
    description:
      'Reproductor de música y gestor de biblioteca de código abierto para Linux y macOS. Lo local primero. Bit-perfect. Hecho para escalar.',
  },
  nav: {
    label: 'Principal',
    features: 'Funciones',
    plugins: 'Plugins',
    downloads: 'Descargas',
    community: 'Comunidad',
    github: 'Código en GitHub',
    toDark: 'Modo oscuro',
    toLight: 'Modo claro',
    language: 'Idioma',
  },
  hero: {
    title: 'Un reproductor para gobernarlos a todos.',
    lead: 'Reproductor de música y gestor de biblioteca de código abierto. Lo local primero. Bit-perfect. Hecho para escalar.',
    fromCreator: 'Del creador de {qbz}',
    downloadFor: 'Descargar para {platform}',
    allDownloads: 'Ver todas las descargas',
    installLabel: 'O instala desde la terminal en Linux y macOS',
  },
  toc: {
    title: 'Índice',
    bitPerfect: 'Bit-perfect',
    library: 'Biblioteca',
    devices: 'Device Sync',
    lyrics: 'Letras e inmersiva',
    plugins: 'Plugins y SDK',
    privacy: 'Privacidad',
    platforms: 'Plataformas',
    community: 'Comunidad',
    faq: 'Preguntas frecuentes',
  },
  bitPerfect: {
    title: 'Bit-perfect y HiFi Wizard',
    body: 'La salida muestra el formato real que llega al DAC y si hubo procesamiento. Modo exclusivo, ALSA directo, PipeWire, PulseAudio y JACK. DSD nativo y DoP.',
    formatsLabel: 'Formatos:',
    formats: 'FLAC, ALAC, WAV, AIFF, MP3, Ogg Vorbis, DSD (DSF, DFF sin compresión DST, ISO de SACD) y CD de audio.',
  },
  library: {
    title: 'Biblioteca',
    body: 'Diseñada desde la base de datos para decenas de miles de pistas. Ediciones de un mismo álbum, discos múltiples, obras clásicas y compositores, sellos y editor de metadatos.',
    more: 'Varias colas, playlists, playlists inteligentes y búsqueda. Estadísticas con historial y exportación. Scrobbling a Last.fm y ListenBrainz.',
    refineBody:
      'Una consulta, tres formas de editarla. En Columnas, un clic incluye un valor y − lo excluye. El panel muestra cada condición como una fila legible, con grupos de "todas" o "cualquiera". La consola acepta la misma consulta como texto. Las tres escriben la misma consulta.',
    readAs:
      '"Leído como" muestra lo que el motor decidió por su cuenta, como un nombre resuelto a compositor o un alias, y puedes quitarlo.',
  },
  devices: {
    title: 'Device Sync',
    body: 'Sincroniza tu DAP, ya sea con el dispositivo conectado directo por USB o conectando su microSD. Fácil y rápido, sin el infierno de Android File Transfer en macOS ni el infierno del MTP en Linux: solo conectas y transfieres, con memoria e historial.',
    verify: 'También puedes verificar tus transferencias, para que no haya más sorpresas de archivos corruptos a media sesión de escucha. Un guiño al pasado y a los buenos tiempos de iTunes.',
  },
  lyrics: {
    title: 'Letras y vista inmersiva',
    lyrics: 'Letras sincronizadas por línea y por palabra, con traducción a tu idioma.',
    visuals: 'Visualizadores que reaccionan al audio, fondo tomado de la portada y mini reproductor.',
    themes: '36 temas, uno automático y editor de temas. Ocho idiomas. Línea de comandos y atajos configurables; se usa entera sin mouse.',
  },
  plugins: {
    title: 'Plugins y SDK',
    body: 'Cada integración externa vive en su propio plugin. Plugins WebAssembly y nativos en sandbox (bubblewrap en Linux, Seatbelt en macOS); cada uno declara permisos que apruebas.',
    names: {
      radio: 'Radio',
      podcasts: 'Podcasts',
      dsp: 'DSP y ecualizador',
      playlistImport: 'Importador de playlists',
      mood: 'Análisis de mood local (experimental)',
    },
    sdkTitle: 'Escribe un plugin',
    sdkBody: 'El SDK público documenta la API y los contratos, y da acceso al motor de reproducción.',
    catalog: 'Catálogo oficial de plugins →',
  },
  privacy: {
    title: 'Privacidad y modo offline',
    body: 'Cero telemetría. Proxy de Chilpa, API de letras, MusicBrainz, Last.fm y ListenBrainz son opcionales, cada uno con su interruptor. El modo offline bloquea toda la red de Chilpa y de sus plugins; lo local sigue funcionando.',
  },
  platforms: {
    title: 'Plataformas y descargas',
    recommended: 'Recomendado',
    download: 'Descargar',
    downloadArch: 'Descargar {format} para {arch}',
    stores: 'Repositorios y tiendas',
    quarantineTitle: 'Si macOS no deja abrir Chilpa, quita la marca de cuarentena una sola vez:',
    quarantine: { installer: 'Instalaste con el script', manual: 'Instalaste desde el DMG o el ZIP' },
    copy: 'Copiar',
    copied: 'Copiado',
    unavailable: 'Los paquetes están en la página de releases en GitHub.',
    toReleases: 'Releases en GitHub',
    changes: 'Cambios entre versiones',
    from: 'de',
    to: 'a',
    allReleases: 'Ver todos los releases en GitHub →',
    noNotes: 'Este release no tiene notas.',
  },
  community: {
    title: 'Comunidad',
    discussions: 'Discussions',
    issues: 'Issues',
    source: 'Código',
  },
  faq: {
    title: 'Preguntas frecuentes',
    note: 'Aviso: esta sección está llena de referencias a QBZ.',
    yes: "Sí, lo es",
    ringQuote: 'Ash Nazg durbatulûk, ash Nazg gimbatul, ash Nazg thrakatulûk agh burzum-ishi krimpatul',
    items: [
      {
        q: '¿Chilpa es una aplicación vibe-codeada?',
        a: [
          "{yes}. Cuando empecé {qbz} era para mí: lo hice porque no había un cliente de Qobuz para Linux, y aunque admiro mucho a Strawberry (Chilpa toma varias de sus funciones como inspiración), tengo una relación de amor/odio con él, así que ni quería usar el reproductor web ni quería pelear con el buscador de Strawberry. Primero hice un cliente pequeño de CLI basado en los downloaders de Python, luego lo convertí en una API, después caí en el hype de Rust —para bien— y decidí migrar el proyecto a ese lenguaje, todo a mano, como POC, como hobby. Cuando los LLMs llegaron al mainstream, desempolvé el proyecto y entonces vio la luz: durante sus 9 meses de vida se convirtió en el reproductor de streaming open source de referencia. Su core era código escrito a mano; su evolución fue vibe-codeada.",
          "Chilpa, en cambio, está 99% vibe-codeada: ya tenía toda la lógica, los ADR y, sobre todo, el feedback de la comunidad. Solo he escrito no más de 200 líneas de código de Chilpa y varias pruebas unitarias; siendo optimista, es el 1% del código, y eso redondeando hacia arriba. Así que sí, Chilpa es una app vibe-codeada. Está hecha con responsabilidad, con buenas prácticas, ADR, SOLID y los workflows que uso en mi trabajo real.",
          "No es un proyecto de fin de semana. Pude haberles dado el código de QBZ a los agentes y tener todo listo en un par de días, pero el primer release tomó no menos de un mes, porque todo está escrito de forma modular y cada módulo se revisó con pruebas unitarias, con Sonar y por un humano antes de integrarse a la app. Aun así, por transparencia tengo que decirlo: sigue siendo vibe-code.",
          "Si eso te causa problemas, probablemente Chilpa no sea para ti.",
        ],
      },
      {
        q: '¿Por qué hacer Chilpa?',
        a: 'Podría empezar el discurso como todos: "No había una aplicación así y decidí hacer la mía". Lo cierto es que hoy el mercado de apps de música es muy amplio; cada semana aparecen nuevas, unas con una función, otras con otra. Chilpa existe porque cuando murió QBZ, mi TDAH se quedó sin hiperfoco, y no es bonito que a una persona con TDAH le quiten su hiperfoco de forma abrupta. Esa es la razón principal. La segunda, pero no menos importante: QBZ no solo evidenció que hay un vacío que llenar, también recolectó muchísimo feedback de la comunidad, que le dio vida y la hizo relevante. Ignorar esa retroalimentación, el know-how y los reportes de bugs sería casi un pecado. Las empresas pagan por la retroalimentación que QBZ recibió amablemente de cada usuario que la utilizó, y hay empresas (cof, cof) que deciden simplemente ignorar a su comunidad, la que paga. En el mundo open source hacemos las cosas distinto. Por eso existe Chilpa, y si tiene la mitad de los usuarios que tuvo QBZ, con eso ya será un éxito.',
      },
      {
        q: 'Ya probé Chilpa, deberías comercializarla.',
        a: 'No. Chilpa es y será siempre libre y de código abierto. Aunque haya sponsors o lo que sea, jamás tendrá un tier ni funciones premium. Un comentario, un donativo, un PR o un issue son igual de valiosos.',
      },
      {
        q: 'El título de la página es muy pretencioso, ¿no crees?',
        a: 'Ah, sí. No lo escribí con aires de grandeza, sino como una referencia: {quote}.',
      },
      {
        q: '¿Habrá versión para Windows?',
        a: 'Sí. Solo que no tengo una computadora con Windows de planta: monté una instalación temporal para QBZ, pero la borré y no la he vuelto a hacer. Vendrá, pero una vez que la versión inicial se estabilice un poco más.',
      },
      {
        q: '¿Qué hay del demonio headless?',
        a: 'Por supuesto. La idea es que Chilpa no dependa de los *-connect de los servicios de streaming. De nuevo: una sola opción, con estándares de uso, fácil de usar.',
      },
      {
        q: '¿Habrá versión para móvil?',
        a: 'Sí. Irá de la mano con la versión headless.',
      },
    ],
  },
  footer: {
    source: 'Código',
    releases: 'Releases',
    sdk: 'SDK',
    plugins: 'Plugins',
  },
  notFound: 'Esta página no existe.',
  captures: {
    pending: 'Captura pendiente · {name}',
    'main-window': {
      name: 'Ventana principal',
      alt: 'Ventana principal de Chilpa: inicio con los discos agregados y escuchados hace poco, la barra lateral y el reproductor con un disco sonando',
    },
    'output-indicator': {
      name: 'Indicador de salida',
      alt: 'Indicador de salida del reproductor: un archivo DSD256 local sale nativo a un DAC Fosi Audio ZH3 por ALSA directo, marcado bit-perfect',
    },
    'hifi-wizard': {
      name: 'HiFi Wizard',
      alt: 'HiFi Wizard en el paso Review & Apply, con los comandos de PipeWire para el DAC detectado, que Chilpa nunca escribe por su cuenta',
    },
    'artist-page': {
      name: 'Página de artista',
      alt: 'Página de artista con sus pistas populares, el último lanzamiento y el panel Network con sellos y artistas similares',
    },
    'library-refine': {
      name: 'Biblioteca con Refine abierto',
      alt: 'Biblioteca con Refine abierto: una condición sobre un campo de la biblioteca y los discos que la cumplen',
    },
    devices: {
      name: 'Device Sync',
      alt: 'Página de Device Sync con un perfil guardado de microSD de un FiiO M21, las pestañas Music, Synced music y Changes, y una lista de playlists seleccionadas para sincronizar',
    },
    immersive: {
      name: 'Vista inmersiva',
      alt: 'Vista inmersiva: la línea actual de la letra junto a la portada, sobre un fondo tomado de ella',
    },
    'settings-privacy': {
      name: 'Ajustes › Integraciones',
      alt: 'Ajustes con el modo offline encendido: el proxy de Chilpa y el scrobbling quedan deshabilitados',
    },
  },
}
