// A tagged template that escapes every interpolated value unless it is
// already markup (the result of html`` or raw()).

class Markup {
  constructor(value) {
    this.value = value
  }

  toString() {
    return this.value
  }
}

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escape(value) {
  return String(value).replace(/[&<>"']/g, (c) => entities[c])
}

export function raw(value) {
  return new Markup(String(value))
}

function render(value) {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof Markup) return value.value
  if (Array.isArray(value)) return value.map(render).join('')
  return escape(value)
}

export function html(strings, ...values) {
  let out = strings[0]
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1]
  return new Markup(out)
}

// Fills `{name}` slots in a translated sentence. Text is escaped; slot values
// are rendered like any interpolation, so they may be markup.
export function fill(template, slots) {
  const parts = template.split(/(\{\w+\})/)
  return new Markup(
    parts
      .map((part) => {
        const slot = part.match(/^\{(\w+)\}$/)
        if (slot && slot[1] in slots) return render(slots[slot[1]])
        return escape(part)
      })
      .join(''),
  )
}
