const fs = require('fs')
const browserify = require('browserify')

// configure LavaMoat
const lavamoatOpts = {}

// enable config autogen if specified
if (process.env.AUTOCONFIG) {
  lavamoatOpts.writeAutoConfig = './lavamoat-config.json'
} else {
  lavamoatOpts.config = './lavamoat-config.json'
}

// configure browserify
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})

// bundle and write to disk
bundler.bundle()
  .pipe(fs.createWriteStream('./bundle.js'))