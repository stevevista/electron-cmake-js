# Credits
* [cmake-js] (https://github.com/cmake-js/cmake-js)
* [cmake-node-module] (https://github.com/mapbox/cmake-node-module/tree/master)

# Usage
* CMakeLists.txt
```cmake
include("${ELECTRON_CMAKE_SUBMODULE_PATH}")
add_node_module(some_mod 
  CACHE_DIR "${ELECTRON_APP_ROOT_PATH}/node_cache"
  RUNTIME "electron"
  ELECTRON_VERSION ${ELECTRON_VERSION}
  NODE_ABIS ${NODE_ABI})
target_sources(some_mod INTERFACE
    ...
)

# electron-cmake-js configure -d <dir contains CMakeLists.txt>
# electron-cmake-js build -d <dir contains CMakeLists.txt>
```

* webpack config
```js

webpackConfig = {
  ...,
  entry: {
    'some_entry': ['./node_modules/electron-cmake-js/lib/electron-abi-require-webpack', 'some_entry']
  },

  externals: {
    bindings: '__injectedBindings__'
  }
}

```

* js
```js
import mod from 'some_mod.addon'

```
