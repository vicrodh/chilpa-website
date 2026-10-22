import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderNotes } from '../src/markdown.mjs'

test('headings drop three levels below the page headings', () => {
  assert.equal(renderNotes('# 0.1.0\n\n## Fixes'), '<h4>0.1.0</h4>\n<h5>Fixes</h5>')
})

test('scripts, event handlers and inline styles are removed', () => {
  const out = renderNotes('<script>alert(1)</script>\n\n<p onclick="x()" style="color:red">text</p>\n\n<iframe src="https://example.org"></iframe>')
  assert.doesNotMatch(out, /script|onclick|style|iframe/)
  assert.match(out, /text/)
})

test('javascript links lose their target', () => {
  const out = renderNotes('[click](javascript:alert(1))')
  assert.doesNotMatch(out, /javascript/)
})

test('images become links so the page loads nothing from outside', () => {
  const out = renderNotes('![screenshot](https://example.org/shot.png)')
  assert.equal(out, '<p><a href="https://example.org/shot.png" rel="noopener noreferrer">screenshot</a></p>')
})

test('lists, code and links survive', () => {
  const out = renderNotes('- one `two` [three](https://example.org)')
  assert.equal(out, '<ul>\n<li>one <code>two</code> <a href="https://example.org" rel="noopener noreferrer">three</a></li>\n</ul>')
})

test('an empty body renders nothing', () => {
  assert.equal(renderNotes(''), '')
  assert.equal(renderNotes('  \n'), '')
})

test('a first heading that repeats the version is dropped', () => {
  assert.equal(renderNotes('# 0.1.0\n\nInitial release.', 'v0.1.0'), '<p>Initial release.</p>')
  assert.equal(renderNotes('# 0.1.0\n\nInitial release.', 'v0.2.0'), '<h4>0.1.0</h4>\n<p>Initial release.</p>')
})
