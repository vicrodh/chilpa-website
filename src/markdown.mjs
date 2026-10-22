// Release notes: GitHub-flavored Markdown rendered with marked, then
// sanitized. Headings drop three levels so they sit below the page's own
// headings. Images become links: the page loads nothing from outside the site.
import { Marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const marked = new Marked({ gfm: true, breaks: false, async: false })

const shiftHeading = (level) => (tagName, attribs) => ({ tagName: `h${Math.min(level + 3, 6)}`, attribs })

const policy = {
  allowedTags: [
    'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'em', 'strong', 'del', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'details', 'summary',
  ],
  allowedAttributes: {
    a: ['href', 'rel'],
    ol: ['start'],
    th: ['align'],
    td: ['align'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowProtocolRelative: false,
  transformTags: {
    h1: shiftHeading(1),
    h2: shiftHeading(2),
    h3: shiftHeading(3),
    h4: shiftHeading(4),
    h5: shiftHeading(5),
    h6: shiftHeading(6),
    a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }),
    img: (tagName, attribs) => ({
      tagName: 'a',
      attribs: { href: attribs.src ?? '', rel: 'noopener noreferrer' },
      text: attribs.alt || attribs.src || '',
    }),
  },
  exclusiveFilter: (frame) => frame.tag === 'a' && !frame.attribs.href,
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// `version` is the release tag; a first heading that only repeats it ("# 0.1.0"
// under "v0.1.0") is dropped.
export function renderNotes(markdown, version = '') {
  if (!markdown || !markdown.trim()) return ''
  const bare = version.replace(/^v/i, '')
  const repeated = bare && new RegExp(`^\\s*#{1,6}\\s*v?${escapeRegExp(bare)}\\s*(\\n|$)`, 'i')
  const body = repeated ? markdown.replace(repeated, '') : markdown
  return sanitizeHtml(marked.parse(body), policy).trim()
}
