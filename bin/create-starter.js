#!/usr/bin/env node

const cli = require('cac')()
const init = require('../lib/init')
const sync = require('../lib/sync')

cli
  .command('init', 'init an app')
  .option('--type [type]', 'choose a project type')
  .action(init)

cli.command('sync', 'sync starters').action(sync)

cli.help().parse()
