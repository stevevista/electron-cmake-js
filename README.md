# Credits
* [cmake-js] (https://github.com/cmake-js/cmake-js)
* [cmake-node-module] (https://github.com/mapbox/cmake-node-module/tree/master)

# Usage
* webpack config
```js

webpackConfig = {
  ...,
  entry: {
    'some_entry': ['./node_modules/electron-cmake-js/lib/electron-abi-require-webpack', 'some_entry']
  },

  externals: {
    'some_mod': 'commonjs2 some_mod.addon',
    bindings: '__injectedBindings__'
  }
}

```

* package.json
```json
"scripts": {
  "build_mod": "electron-cmake-js build -d src_some_mod"
}

```

* js
```js
import mod from 'some_mod'

```
