const fs = require('fs')
const browserify = require('browserify')
const budo = require('budo')
const lavamoat = require('lavamoat-browserify')

// Autoconfig option
let autoConfigEnabled = process.env.AUTOCONFIG
// Initialize LavaMoat configuration object
let lavamoatOpts = {}

// Configure Browserify
// Enable config autogen if specified, otherwise set the config to the default path

if (autoConfigEnabled) {
  lavamoatOpts.writeAutoConfig = true
  bundle()

} else {
  lavamoatOpts.config = './lavamoat/lavamoat-config.json'
  
  // If 'watch' option is passed through, enable hot reloading when the override config file changes 
  if (2 in process.argv) {
    budo('./index.js', {
      live: true,
      stream: process.stdout,
      port: 8000,
      browserify: {
        plugin: [
          [lavamoat, lavamoatOpts]
        ]
      }
    })
  } else {
    budo('./index.js', {
      stream: process.stdout,
      port: 8000,
      browserify: {
        plugin: [
          [lavamoat, lavamoatOpts]
        ]
      }
    })
  }
}

//Helper bundle function
async function bundle() {
  const requireOverrideConfig = "require('./lavamoat/lavamoat-config-override.json')"
  const bundler = browserify(['./index.js'], {
    plugin: [
      ['lavamoat-browserify', lavamoatOpts]
    ]
  })

  bundler.bundle()
  .on('end', () => {
    const indexFile = fs.readFileSync('./index.js', { encoding: 'utf-8' })
    if (!indexFile.includes(requireOverrideConfig)) {
      fs.appendFileSync('./index.js', "\n\n" + requireOverrideConfig)
    }
  })
  .pipe(fs.createWriteStream('./bundle.js'))
}


