const fs = require('fs')
const budo = require('budo')
const lavamoat = require('lavamoat-browserify')

let lavamoatOpts = {
    config: './lavamoat/lavamoat-config.json'
}

budo('./index.js', {
    live: true,
    stream: process.stdout,
    port: 8000,
    browserify: {
        plugin: [
            [lavamoat, lavamoatOpts],
            [bundler => bundler.bundle().pipe(fs.createWriteStream('./bundle.js'))]
        ]
    }
})