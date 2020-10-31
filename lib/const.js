const path = require('path')
const TEMPLATE_URL = 'https://github.com/fe-starter/awesome-starter.git'
const tempPath = path.join(__dirname, '.temp')
const starterJsonPath = path.join(__dirname, '.starter.json')

module.exports = {
  TEMPLATE_URL,
  tempPath,
  starterJsonPath
}
