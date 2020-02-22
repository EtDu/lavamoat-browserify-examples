### Quick Start

```bash
yarn
yarn lavamoat
yarn start
```

### Explanation

In this example, the config autogeneration and build setup relies on the scripts in `package.json`. The scripts use [Browserify](https://github.com/browserify/browserify) CLI, [Watchify](https://www.npmjs.com/package/watchify) CLI & [Serve](https://www.npmjs.com/package/serve) development server.

#### Scripts

**Note: the whitespace in the plugin field is important**

```json
"scripts": {
    "lavamoat": "browserify index.js --plugin [ lavamoat-browserify --writeAutoConfig ] > /dev/null",
    "start": "browserify index.js --plugin [ lavamoat-browserify --config ./lavamoat/lavamoat-config.json ] > bundle.js && serve",
    "start-live": "concurrently \"watchify index.js --outfile bundle.js --plugin [ lavamoat-browserify --config ./lavamoat/lavamoat-config.json ]\" \"serve\""
},
```

#### Config Autogeneration

**`yarn lavamoat`**

Start by having Lavamoat automatically build and generate a configuration file. 

```bash
browserify index.js \
  --plugin [ \
    lavamoat-browserify \
    --writeAutoConfig \
  ] > /dev/null
```

`lavamoat` - Runs Browserify with the `lavamoat-browserify` plugin and `--writeAutoConfig` flag. This tells the plugin to parse each module and generate a config file, writing it at the default path `./lavamoat/lavamoat-config.json`. An additional `lavamoat-config-override.json` is created under the same directory. The bundle output is ignored. This task should only be run after updating dependencies.

#### Building

**`yarn start`**

Next, create a new Browserify build with Lavamoat using the config generated from before.

```bash
browserify index.js \
  --plugin [ \
    lavamoat-browserify \
    --config ./lavamoat/lavamoat-config.json \
  ] > bundle.js && serve .
```

`start` - Runs Browserify with the `lavamoat-browserify` plugin with the `--config` flag, used to specify the config at path `./lavamoat/lavamoat-config.json`. Outputs a LavaMoat protected bundle to `bundle.js`. Since `--writeAutoConfig` is not specified, it skips parsing the module content. Launches a static asset server that includes the bundle.

#### Building With Live Reload

**`yarn start-live`**

Alternatively, create a new Browserify build with Lavamoat using the config generated from before with live reload enabled.

```bash
concurrently \
  \"watchify index.js \
  --outfile bundle.js \
  --plugin [ \
    lavamoat-browserify \
    --config ./lavamoat/lavamoat-config.json \
  ]\" \"serve\" 
```

`concurrently` runs two processes concurrently, as per the name. The first process runs Watchify with Lavamoat and outputs the bundle to `bundle.js`. This triggers a re-bundle everytime `lavamoat-config-override.json` is modified. The next process simply runs a development server that requires the outputted bundle. 

**IMPORTANT**

`require("./lavamoat/lavamoat-config-override.json")` exists in `index.js` so that Watchify watches the override config and rebundles on changes accordingly. Watchify only considers files which are apart of the `require` tree in `index.js`. 