const {appRootPath, wrapRequire} = require('./electron-abi-require')

/* eslint-disable no-undef */
__non_webpack_require__ = wrapRequire(__non_webpack_require__, appRootPath)

global.__injectedBindings__ = function (m) {
  return __non_webpack_require__(m.replace(/(.*\/)*([^.]+).*/ig, '$2') + '.addon')
}

/*
 *  in webpack:
 *  externals: {
 *   'mod-node': 'commonjs2 mod-node.addon',
 *   bindings: '__injectedBindings__'
 *  }
 *
 * 
 *  in entry js:
 *  import '.../electron-abi-require-webapck'
 *  import {...} from 'mod-node'
 * 
 */
