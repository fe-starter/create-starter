const marked = require('marked')

function getJsonFromReadme (readme) {
  const tokens = marked.lexer(readme)
  let start = false
  const result = {}
  let current
  tokens.forEach((token) => {
    if (token.type === 'heading' && token.text === 'Templates') {
      start = true
      return
    }
    if (start) {
      if (token.type === 'heading' && token.depth === 4) {
        current = token.text
      }
      if (token.type === 'list') {
        const items = token.items.map(({ text }) => {
          const [name, link, description] = text.match(/\[.+?\]|\(.+?\)|.+/g)
          return {
            name: name.replace(/\[|\]/g, '').trim(),
            link: link.replace(/\(|\)/g, '').trim() + '.git',
            description: description.replace(/-/, '').trim()
          }
        })
        result[current] = items
      }
    }
    if (token === 'heading' && token.depth !== 4) {
      start = false
    }
  })
  return result
}

module.exports = {
  getJsonFromReadme
}
