;(() => {
  const root = document.documentElement
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value)
      } catch {
        // Private windows may refuse storage; the choice then lasts one page.
      }
    },
  }

  // Theme: dark unless the visitor picked light, which the inline script in
  // <head> already applied; this keeps the toggle's label and the browser's
  // theme color in step.
  const toggle = document.querySelector('[data-theme-toggle]')
  const themeColor = document.querySelector('meta[name="theme-color"]')
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme)
    themeColor?.setAttribute('content', theme === 'dark' ? '#140A0B' : '#ffffff')
    if (!toggle) return
    const label = theme === 'dark' ? toggle.dataset.labelLight : toggle.dataset.labelDark
    toggle.setAttribute('aria-label', label)
    toggle.title = label
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    storage.set('chilpa-theme', next)
    applyTheme(next)
  })

  // Language: remember the choice and keep the section in view.
  for (const link of document.querySelectorAll('[data-lang-switch]')) {
    link.addEventListener('click', () => {
      storage.set('chilpa-lang', link.dataset.langSwitch)
      if (location.hash) link.hash = location.hash
    })
  }

  // Download buttons: the visitor's system goes first, with its architecture.
  const detectPlatform = () => {
    const agent = navigator.userAgent
    if (/Android|iPhone|iPad|iPod/i.test(agent)) return null
    const name = `${navigator.userAgentData?.platform ?? ''} ${navigator.platform ?? ''} ${agent}`
    if (/Mac/i.test(name)) return navigator.maxTouchPoints > 1 ? null : 'macos'
    if (/Win/i.test(name)) return 'windows'
    if (/Linux|X11|CrOS/i.test(name)) return 'linux'
    return null
  }

  const detectArch = async () => {
    const data = navigator.userAgentData
    if (data?.getHighEntropyValues) {
      try {
        const { architecture } = await data.getHighEntropyValues(['architecture'])
        if (architecture === 'arm') return 'arm64'
        if (architecture === 'x86') return 'x86_64'
      } catch {
        // Fall through to the user agent string.
      }
    }
    return /aarch64|arm64|armv8/i.test(navigator.userAgent) ? 'arm64' : null
  }

  const hero = document.querySelector('[data-hero]')
  if (hero) {
    const buttons = [...hero.querySelectorAll('[data-platform]')]
    const match = buttons.find((button) => button.dataset.platform === detectPlatform())
    if (match) {
      if (!match.classList.contains('btn-primary')) {
        for (const button of buttons) button.classList.remove('btn-primary')
        match.classList.add('btn-primary')
        hero.prepend(match)
      }
      detectArch().then((arch) => {
        const url = arch && match.getAttribute(`data-href-${arch}`)
        if (url) match.href = url
      })
    }
  }

  // Contents: mark the section being read.
  const tocLinks = new Map([...document.querySelectorAll('[data-toc]')].map((link) => [link.dataset.toc, link]))
  const sections = [...tocLinks.keys()].map((id) => document.getElementById(id)).filter(Boolean)
  let active = null
  let pending = false
  const markActive = () => {
    pending = false
    const line = window.innerHeight * 0.3
    let current = sections[0]?.id
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section.id
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections.at(-1)?.id
    }
    if (current === active) return
    active = current
    for (const [id, link] of tocLinks) {
      if (id === current) {
        link.setAttribute('aria-current', 'true')
        const strip = link.closest('.toc')
        if (strip && strip.scrollWidth > strip.clientWidth) {
          strip.scrollTo({ left: link.offsetLeft - strip.clientWidth / 3 })
        }
      } else {
        link.removeAttribute('aria-current')
      }
    }
  }
  if (sections.length) {
    window.addEventListener(
      'scroll',
      () => {
        if (pending) return
        pending = true
        requestAnimationFrame(markActive)
      },
      { passive: true },
    )
    window.addEventListener('resize', markActive)
    markActive()
  }

  // Changes between versions: the releases after "from", up to and including "to".
  const changes = document.querySelector('[data-changes]')
  const from = changes?.querySelector('[data-changes-from]')
  const to = changes?.querySelector('[data-changes-to]')
  if (from && to) {
    const releases = [...changes.querySelectorAll('.release')]
    const showRange = () => {
      const a = Number(from.value)
      const b = Number(to.value)
      const newest = Math.min(a, b)
      const oldest = Math.max(a, b)
      for (const release of releases) {
        const index = Number(release.dataset.index)
        release.hidden = a === b ? index !== a : index < newest || index >= oldest
      }
    }
    from.addEventListener('change', showRange)
    to.addEventListener('change', showRange)
    showRange()
  }

  // Copy buttons for install commands.
  for (const button of document.querySelectorAll('[data-copy]')) {
    const label = button.getAttribute('aria-label')
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy)
      } catch {
        return
      }
      button.classList.add('is-copied')
      button.setAttribute('aria-label', button.dataset.labelCopied)
      setTimeout(() => {
        button.classList.remove('is-copied')
        button.setAttribute('aria-label', label)
      }, 2000)
    })
  }
})()
