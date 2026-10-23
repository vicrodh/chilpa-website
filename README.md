# chilpa-website

The website of [Chilpa](https://github.com/vicrodh/chilpa): one page in Spanish
(`/es/`) and English (`/en/`), light and dark, with downloads and release notes
taken from the GitHub releases of `vicrodh/chilpa`.

It is a static site. A Node script renders the HTML at build time; the visitor's
browser loads only files from the site itself. There is no analytics, no
cookies and no third-party script, font or image, and a Content Security Policy
in every page enforces it.

## Develop

Node 22 or later.

```sh
npm ci
npm test
npm run build            # reads the releases from the GitHub API
npm run build:fixture    # uses test/fixtures/releases.json instead
npm run serve            # http://localhost:8080
```

`npm run build -- --strict` fails when the GitHub API does not answer; without
`--strict` the site is built without release data and every download button
points to the releases page. Set `GITHUB_TOKEN` to raise the API rate limit.
`SITE_URL` changes the address the pages are built for (default
`https://chilpa.app`), for example `https://vicrodh.github.io/chilpa-website`
for a preview before the domain points here.

## How the release data is used

`src/releases.mjs` reads every release of `vicrodh/chilpa` (100 per page) and
keeps the published ones with a tag, newest first; drafts and pre-releases are
left out.

- **Downloads** come from the newest of those releases that carries at least one
  package. `config/downloads.mjs` maps asset names to a platform, a package
  format and an architecture; the patterns follow
  `scripts/release_platform.py` in the app repository. A platform appears only
  when the release has packages for it, so a new platform needs only a new
  entry there. Assets that match no pattern (checksums, manifests, the AppImage
  zsync file, the macOS ZIP used by the updater, `install.sh`) are not offered.
- **Repositories and stores** (Flathub, Snap, AUR, APT, DNF, Homebrew) are in the
  same file, each with `enabled: false`. Set `enabled: true` and the `command`
  to copy once a channel is published; `recommended: true` moves the
  "Recommended" label from the AppImage to that channel.
- **Changes between versions** renders each release body with `marked` and
  sanitizes it with `sanitize-html`. Images in release notes become links, so
  the page still loads nothing from outside. The notes are shown in the
  language they are written in.

The hero's main button follows the visitor's system (Client Hints, else the
user agent) and its architecture when the browser reports it; Linux leads when
the system is unknown.

## Screenshots

Screenshots go in `public/captures/` and are picked up by the next build. For
each capture the build looks for the most specific file first:
`<id>-<lang>-<theme>`, `<id>-<theme>`, `<id>-<lang>`, then `<id>`, with the
extension `webp`, `png`, `jpg` or `avif`. A file for one theme stands in for
the other. Until a capture exists the page shows a striped placeholder and the
build lists it as pending.

The files are taken from full-window captures at 1440×900. The two captures
shown side by side, `output-indicator` and `hifi-wizard`, are cropped to the same
4:3 ratio so their row lines up.

| id | What it shows |
| --- | --- |
| `main-window` | Home with the sidebar and the player with an album playing; one per theme, and optionally per language (`main-window-es-dark`) |
| `output-indicator` | The player's output popover: source, format, output, device and route, marked bit-perfect |
| `hifi-wizard` | HiFi Wizard on Linux, the Review & Apply step with the detected DAC |
| `artist-page` | Artist page with its popular tracks and the Network panel |
| `library-refine` | Library with Refine open; one per theme: `library-refine-light`, `library-refine-dark` |
| `immersive` | Immersive view: synced lyrics beside the cover, over a background taken from it |
| `settings-privacy` | Settings › Integrations with offline mode on and the integrations it turns off |

## Deploy

`.github/workflows/deploy.yml` builds with `--strict` and deploys `dist/` to
GitHub Pages. It runs on:

- a push to `main`;
- a manual run (`workflow_dispatch`);
- a `chilpa-release` repository dispatch, sent when a release is published;
- every hour, as a fallback. The build output is deterministic, so an hourly
  run whose output matches the last deployment does not deploy.

GitHub disables scheduled workflows in a public repository after 60 days
without commits, which is why the release dispatch is the trigger to rely on.
To send it, add this workflow to `vicrodh/chilpa` with a fine-grained token
that has "Contents: read and write" on this repository, stored as the secret
`WEBSITE_DISPATCH_TOKEN`:

```yaml
name: Website
on:
  release:
    types: [published]
jobs:
  notify:
    runs-on: ubuntu-24.04
    steps:
      - run: gh api repos/vicrodh/chilpa-website/dispatches -f event_type=chilpa-release
        env:
          GH_TOKEN: ${{ secrets.WEBSITE_DISPATCH_TOKEN }}
```

### First setup

1. In the repository settings, Pages › Source: "GitHub Actions", and Custom
   domain: `chilpa.app`.
2. The `chilpa.app` zone is on Cloudflare. One proxied `CNAME` at the apex
   (`@`) to `vicrodh.github.io`, which Cloudflare flattens, and a proxied
   `CNAME` `www` to `chilpa.app`; GitHub redirects `www` to the apex.
3. Cloudflare SSL/TLS mode "Full" and "Always Use HTTPS". Behind the proxy the
   visitor gets Cloudflare's certificate and GitHub issues none, so "Enforce
   HTTPS" in the Pages settings stays off; "Full (strict)" would fail for the
   same reason.
4. Verify `chilpa.app` in the account's Pages settings (a `TXT` record), so no
   other repository can claim it.

The output is plain static files with absolute paths under `SITE_URL`, so any
other static host works with the same `dist/`.

## Layout

| Path | What |
| --- | --- |
| `config/site.mjs` | address, links, the official plugins |
| `config/downloads.mjs` | asset patterns, platforms, stores |
| `config/captures.mjs` | screenshot ids and placeholder shapes |
| `src/i18n/` | every visible text, in Spanish and English |
| `src/pages.mjs` | the language pages, the language chooser at `/` and `404.html` |
| `src/assets/` | the stylesheet and the one script (theme, language, download buttons, contents, changelog range, copy) |
| `public/brand/` | lockups, icon and Open Graph image, from the Chilpa brand files |
| `scripts/build.mjs` | the build |

Inter and Tabler Icons come from npm and are served by the site: the font as a
file, the icons inlined as SVG.
