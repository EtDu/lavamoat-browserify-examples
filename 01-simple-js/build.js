const fs = require('fs')
const browserify = require('browserify')

// Autoconfig option
let autoConfigEnabled = process.env.AUTOCONFIG
// Initialize LavaMoat configuration object
let lavamoatOpts = {}

// Enable config autogen if specified, otherwise set the config to the default path
if (autoConfigEnabled) {
  lavamoatOpts.writeAutoConfig = true
} else {
  lavamoatOpts.config = './lavamoat/lavamoat-config.json'
}

// Configure Browserify
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})

// If running without writeAutoConfig, bundle and write to disk
bundler.bundle()
  .pipe(fs.createWriteStream('./bundle.js'))