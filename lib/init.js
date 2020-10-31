const path = require('path')
const fse = require('fs-extra')
const boxen = require('boxen')
const semver = require('semver')
const Git = require('simple-git')()
const Spinner = require('cli-spinner').Spinner
const { Select, Snippet, Confirm } = require('enquirer')
const sync = require('./sync')
const { starterJsonPath } = require('./const')

async function init () {
  console.log(
    boxen('Welcome use starter to init your app.', { padding: 1, margin: 1 })
  )
  if (!fse.pathExistsSync(starterJsonPath)) {
    await sync()
  } else {
    const { syncDate } = require(starterJsonPath)
    if (Date.now() - syncDate > 1000 * 60 * 60 * 24 * 7) {
      const answer = await new Confirm({
        name: 'sync',
        message: 'Want to sync?'
      }).run()
      if (answer) {
        await sync()
      }
    }
  }
  const { starters } = fse.readJsonSync(starterJsonPath)
  const type = await new Select({
    name: 'type',
    message: 'Please pick the App type',
    choices: Object.keys(starters)
  }).run()
  const repos = starters[type]
  const temp = await new Select({
    name: 'type',
    message: 'Please pick one app',
    choices: repos.map(({ name }) => name)
  }).run()
  const repo = repos.find(({ name }) => name === temp)
  const prompt = new Snippet({
    name: 'username',
    message: 'Fill out the fields in package.json',
    required: true,
    fields: [
      {
        name: 'author_name',
        message: 'Author Name'
      },
      {
        name: 'version',
        validate (value, state, item) {
          if (item && item.name === 'version' && !semver.valid(value)) {
            return prompt.styles.danger(
              'version should be a valid semver value'
            )
          }
          return true
        }
      }
    ],
    template: `{
  "name": "\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "https://github.com/\${username}/\${name}",
  "license": "\${license:MIT}"
}`
  })
  const { result } = await prompt.run()
  const answer = JSON.parse(result)
  const spinner = new Spinner('Clone processing .. %s')
  spinner.start()
  const packageName = `./${answer.name}`
  fse.removeSync(packageName)
  await Git.clone(repo.link, packageName)
  fse.removeSync(path.resolve(packageName, './.git'))
  const packageJson = path.resolve(packageName, './package.json')
  fse.outputFileSync(
    packageJson,
    JSON.stringify({ ...require(packageJson), ...answer }, null, 2)
  )
  spinner.stop(true)
  console.log(boxen('Starter init success!', { padding: 1, margin: 1 }))
  console.log(` cd ${packageName}\n npm install \n`)
}

module.exports = init
