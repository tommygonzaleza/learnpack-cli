import Console from '../utils/console'
import * as shell from 'shelljs'
import socket from './socket'
import * as fs from 'fs'

export default {
  socket: null,
  config: null,
  initialized: false,
  init: function (config = null) {
    if (this.initialized) return

    this.initialized = true

    if (config) this.config = config

    if (shell.exec('gp -h', {silent: true}).code === 0) {
      this.hasGPCommand = true
      config.address = shell
      .exec('gp url', {silent: true})
      .stdout.replace(/(\r\n|\n|\r)/gm, '')
    } else {
      Console.debug('Gitpod command line tool not found')
    }
  },
  openFile: async function (files: any) {
    Console.debug('Attempting to open files in gitpod mode', files)
    this.init() // initilize gitpod config

    // gitpod will open files only on isolated mode
    if (!this.config || this.config.grading !== 'isolated') {
      Console.debug(
        'Files cannot be automatically opened because we are not on isolated grading (only for isolated)',
      )
      socket.log('ready', ['Ready to compile or test...'])
      return true
    }

    if (this.hasGPCommand)
      for (const f of files.reverse()) {
        if (shell.exec(`gp open ${f}`).code > 0) {
          Console.debug(`Error opening file ${f} on gitpod`)
        }
      }

    socket.log('ready', ['Ready to compile or test...'])
  },
  setup(config) {
    this.init(config) // initilize gitpod config
    this.autosave('on')
  },
  autosave: async function (value = 'on') {
    this.init() // initilize gitpod config

    if (this.hasGPCommand) {
      if (!fs.existsSync('./.theia')) fs.mkdirSync('./.theia')
      if (!fs.existsSync('./.theia/settings.json')) {
        fs.writeFileSync(
          './.theia/settings.json',
          JSON.stringify(
            {
              'editor.autoSave': value,
            },
            null,
            4,
          ),
        )
      }
    }
  },
}
