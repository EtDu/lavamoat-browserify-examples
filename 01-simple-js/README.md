### Quick Start

```bash
yarn
yarn lavamoat
yarn start
```

### Explanation

In this example, the config autogeneration and build scripts use the Browserify JS API & Budo dev server in `build.js` and `live.js`.

#### Scripts:

```js
{
  "lavamoat": "AUTOCONFIG=1 node ./build.js",
  "start": "node ./build.js",
  "start-live": "node ./live.js"
}
```

#### Config Autogeneration

**`yarn lavamoat`**

Start by having Lavamoat automatically build and generate a configuration file. 

In `build.js`, Lavamoat options are specified:

```js
const lavamoatOpts = {
  writeAutoConfig: true,
}
```

This is passed in as a plugin option for running the Browserify build:

```js
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})

const requireOverrideConfig = "require('./lavamoat/lavamoat-config-override.json')"

bundler.bundle()
.on('end', () => {
  const indexFile = fs.readFileSync('./index.js', { encoding: 'utf-8' })
  if (!indexFile.includes(requireOverrideConfig)) {
    fs.appendFileSync('./index.js', "\n\n" + requireOverrideConfig)
  }
})
.pipe(fs.createWriteStream('./bundle.js'))
```

Here we specify the `lavamoat-browserify` plugin and provide it with the option `writeAutoConfig: true`. This tells the plugin to parse each module and generate a config file, writing it at the default path `./lavamoat/lavamoat-config.json`. An additional `lavamoat-config-override.json` is created under the same directory. The bundle output is ignored. 

`requireOverrideConfig` is a `require` statement wrapped in a string used to require the override config file. After the bundle is created, this line is added to the entry file `index.js` so that `lavamoat-config-override.json` becomes a part of the Browserify dependency graph. This is necessary to ensure our Budo live reload server properly watches the file for changes and reloads accordingly. More information on live reload below. 

#### Building

**`yarn start`**

Next, create a new Browserify build with Lavamoat using the config generated from before.

In `build.js`, Lavamoat options are specified:

```js
const lavamoatOpts = {
  config: './lavamoat/lavamoat-config.json',
}
```

This is passed in as a plugin option for running the Browserify build:

```js
budo('./index.js', {
    stream: process.stdout,
    port: 8000,
    browserify: {
      plugin: [
        [lavamoat, lavamoatOpts],
        [bundler => bundler.bundle().pipe(fs.createWriteStream('./bundle.js'))]
      ]
    }
  })
```

Here we specify the `lavamoat-browserify` plugin and provide it with the option `config`. This tells the plugin to build using the config `lavamoat-config.json` in the `./lavamoat` directory. The bundle output is saved to `bundle.js` and is used to start a Budo development server.   

#### Building With Live Reload

**`yarn start-live`**

Alternatively, create a new Browserify build with Lavamoat using the config generated from before with live reload enabled.

In `live.js`:

```javascript
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
```

The process is the same as `yarn-start`, except we pass in the `live` option to Budo. When we generated the config file, we added `require("./lavamoat/lavamoat-config-override.json")` to the entry file `index.js` to add it to the dependency graph. Budo now quickly responds to any changes made in `./lavamoat/lavamoat-config-override.json`.

