### Quick Start

```bash
yarn
yarn lavamoat
yarn start
```

### Explanation

In this example, the config autogeneration and build scripts use the Browserify JS API and live in `build.js`. For convenience, the npm scripts `"lavamoat"` and `"start"` call `build.js`, using an environment variable to specify when to automatically generate the config:

**Note: the whitespace in the plugin field is important**

```json
"scripts": {
  "lavamoat": "AUTOCONFIG=1 node ./build.js",
  "start": "node ./build.js && serve ."
},
```

#### Config Autogeneration

**`lavamoat` script:**

When using the config autogeneration, `lavamoat-browserify` options are specified as:

```js
const lavamoatOpts = {
  writeAutoConfig: true,
}
```

which is used as a plugin option for running the Browserify build:

```js
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})
```

Here we are specifying the `lavamoat-browserify` plugin and providing it with the option `writeAutoConfig: true`. This tells the plugin to parse each module and generate a config file, writing it at the default path `./lavamoat/lavamoat-config.json`. An additional `lavamoat-config-override.json` is created under the same directory. The bundle output is ignored. 

#### Building

**`start` script:**

When building based on a specified existing config file, `lavamoat-browserify` options are specified as:

```js
const lavamoatOpts = {
  config: './lavamoat/lavamoat-config.json',
}
```

which is used as a plugin option for running the Browserify build and saving it to a file:

```js
const bundler = browserify(['./index.js'], {
  plugin: [
    ['lavamoat-browserify', lavamoatOpts]
  ]
})

bundler.bundle()
  .pipe(fs.createWriteStream('./bundle.js'))
```

Here we are specifying the `lavamoat-browserify` plugin and providing it with the option `config`. This tells the plugin to build, using the config at `./lavamoat/lavamoat-config.json`. Outputs and saves the bundle to `bundle.js`. Since `writeAutoConfig` is not specified, it skips parsing the module content. the script also starts a static asset server at `http://localhost:5000`.


