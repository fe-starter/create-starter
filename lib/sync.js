const path = require('path')
const fse = require('fs-extra')
const Git = require('simple-git')()
const Spinner = require('cli-spinner').Spinner
const { getJsonFromReadme } = require('./utils')
const { TEMPLATE_URL, tempPath, starterJsonPath } = require('./const')

async function sync () {
  fse.removeSync(tempPath)
  fse.removeSync(starterJsonPath)
  const spinner = new Spinner('Fetching starters .. %s')
  spinner.setSpinnerString('/-\\')
  spinner.start()
  await Git.clone(TEMPLATE_URL, tempPath)
  spinner.stop(true)
  const readme = await fse.readFile(path.join(tempPath, 'README.md'), 'utf8')
  const result = getJsonFromReadme(readme)
  fse.outputJsonSync(starterJsonPath, {
    syncDate: Date.now(),
    starters: result
  })
  fse.removeSync(tempPath)
  console.log('Sync Success!')
}

module.exports = sync
