const { appRootPath, wrapRequire } = require('./electron-abi-require')
window['require'] = wrapRequire(window['require'], appRootPath)
