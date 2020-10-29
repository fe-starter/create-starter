#!/usr/bin/env node

const path = require('path')
const cli = require('cac')()
const fse = require('fs-extra')
const Git = require('simple-git')()
const Spinner = require('cli-spinner').Spinner
const marked = require('marked')
const boxen = require('boxen')
const semver = require('semver')
const { Select, Snippet } = require('enquirer')
const { TEMPLATE_URL } = require('../lib/const')
const tempPath = path.join(__dirname, '.temp')
const starterJsonPath = path.join(__dirname, '.starter.json')

cli
  .command('init', 'init an app')
  .option('--type [type]', 'choose a project type')
  .action(async (options) => {
    console.log(
      boxen('Welcome use starter to init your app.', { padding: 1, margin: 1 })
    )
    const spinner = new Spinner('Fetching starters .. %s')
    spinner.setSpinnerString('/-\\')
    if (!fse.pathExistsSync(starterJsonPath)) {
      spinner.start()
      await Git.clone(TEMPLATE_URL, tempPath)
      spinner.stop(true)
      const readme = await fse.readFile(
        path.join(tempPath, 'README.md'),
        'utf8'
      )
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
      fse.outputJsonSync(starterJsonPath, {
        syncDate: Date.now(),
        starters: result
      })
      fse.removeSync(tempPath)
    } else {
      console.log('starters exists.')
      // 如果同步时间过长，2 day，提示是否更新
    }
    const { starters } = fse.readJsonSync(starterJsonPath)
    const type = await new Select({
      name: 'type',
      message: 'Please pick an app type',
      choices: Object.keys(starters)
    }).run()
    const repos = starters[type]
    const temp = await new Select({
      name: 'type',
      message: 'Please pick an app',
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
          validate (value, state, item, index) {
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
      "repository": "\${username}/\${name}",
      "license": "\${license:MIT}"
    }
    `
    })
    const { values: answer } = await prompt.run()
    spinner.setSpinnerTitle('clone processing .. %s')
    spinner.start()
    const packageName = `./${answer.name}`
    await fse.remove(packageName)
    await Git.clone(repo.link, packageName)
    await fse.remove(path.resolve(packageName, './.git'))
    const file = await fse.readFile(
      path.resolve(packageName, './package.json'),
      'utf8'
    )
    const pkg = file ? JSON.parse(file) : {}
    let tempStr = JSON.stringify(Object.assign(pkg, answer), null, 2)
    if (!file) {
      tempStr = JSON.stringify(answer, null, 2)
    }
    await fse.writeFile(
      path.resolve(packageName, './package.json'),
      tempStr,
      'utf8'
    )
    spinner.stop(true)
    console.log(boxen('Starter init success!', { padding: 1, margin: 1 }))
    console.log(` cd ${packageName}\n npm install \n`)
  })

  cli
  .command('sync', 'sync starters')
  .action(async (options) => {
    fse.removeSync(tempPath)
    fse.removeSync(starterJsonPath)
    const spinner = new Spinner('Fetching starters .. %s')
    spinner.setSpinnerString('/-\\')
    spinner.start()
    await Git.clone(TEMPLATE_URL, tempPath)
    spinner.stop(true)
    const readme = await fse.readFile(
      path.join(tempPath, 'README.md'),
      'utf8'
    )
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
            const [name, link, description] = text.match(/\[.+\]|\(.+\)|.+/g)
            return {
              name: name.replace(/\[|\]/g, '').trim(),
              link: link.replace(/\(|\)/g, '').trim() + '.git',
              description: description.replace(/-/g, '').trim()
            }
          })
          result[current] = items
        }
      }
      if (token === 'heading' && token.depth !== 4) {
        start = false
      }
    })
    fse.outputJsonSync(starterJsonPath, {
      syncDate: Date.now(),
      starters: result
    })
    fse.removeSync(tempPath)
  })

cli.help().parse()
