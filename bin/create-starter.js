#!/usr/bin/env node

const path = require('path')
const cli = require('cac')()
const fse = require('fs-extra')
const inquirer = require('inquirer')
const Git = require('simple-git')()
const Spinner = require('cli-spinner').Spinner
const marked = require('marked')
const boxen = require('boxen')
const { TEMPLATE_URL } = require('../lib/const')

cli
  .command('init', 'init an app')
  .option('--type [type]', 'choose a project type')
  .action(async (options) => {
    console.log(
      boxen('Welcome use starter to init your app.', { padding: 1, margin: 1 })
    )
    const spinner = new Spinner('Fetching starters .. %s')
    spinner.setSpinnerString('/-\\')
    spinner.start()
    const tempPath = path.join(__dirname, '.temp')
    await fse.remove(tempPath)
    await Git.clone(
      TEMPLATE_URL,
      tempPath
    )
    spinner.stop(true)
    const readme = await fse.readFile(path.join(tempPath, 'README.md'), 'utf8')
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
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        choices: Object.keys(result),
        message: 'Please select the app type'
      }
    ])
    const repos = result[type]
    const { temp } = await inquirer.prompt([
      {
        type: 'list',
        name: 'temp',
        choices: repos.map(({ name }) => name),
        message: 'Please select an app'
      }
    ])
    const repo = repos.find(({ name }) => name === temp)
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        default: repo.name,
        message: 'Please input the app name'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please input the app description'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Please input the app version'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Please input the app author'
      }
    ])
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

cli.help().parse()
