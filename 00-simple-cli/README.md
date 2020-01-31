### Quick Start

```bash
yarn
yarn lavamoat
yarn start
```

### Explanation

In this example the config autogeneration and build scripts use the Browserify cli and live as scripts in `package.json`: 

**Note: the whitespace in the plugin field is important**

```json
"scripts": {
  "lavamoat": "browserify index.js --plugin [ lavamoat-browserify --writeAutoConfig ] > /dev/null",
  "start": "browserify index.js --plugin [ lavamoat-browserify --config ./lavamoat/lavamoat-config.json ] > bundle.js && serve ."
},
```
#### Config Autogeneration

`lavamoat` script:

```bash
browserify index.js \
  --plugin [ \
    lavamoat-browserify \
    --writeAutoConfig \
  ] > /dev/null
```

`lavamoat` - Runs Browserify with the `lavamoat-browserify` plugin and `--writeAutoConfig` flag. This tells the plugin to parse each module and generate a config file, writing it at the default path `./lavamoat/lavamoat-config.json`. An additional `lavamoat-config-override.json` is created under the same directory. The bundle output is ignored. This task should only be run after updating dependencies.

#### Building

`start` script:

```bash
browserify index.js \
  --plugin [ \
    lavamoat-browserify \
    --config ./lavamoat/lavamoat-config.json \
  ] > bundle.js && serve .
```

`start` - Runs Browserify with the `lavamoat-browserify` plugin, using the specified `--config` at path `./lavamoat/lavamoat-config.json`. Outputs a LavaMoat protected bundle to `bundle.js`. Starts a static asset server at `http://localhost:5000`. Since `--writeAutoConfig` is not specified, it skips parsing the module content.

