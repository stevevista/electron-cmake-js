const { app, ipcRenderer } = require('electron')
const path = require('path')
const os = require('os')

const EXT = process.platform === 'win32' ? '.dll' : '.so'
const archName = process.platform + '-' + process.arch

// get exe path
// in renderer process
// require.resolve.paths('')
//  ["D:\dev\bella-desktop\dist\win-unpacked\resources\app.asar\node_modules", 
//   "D:\dev\bella-desktop\dist\win-unpacked\resources\node_modules"]
// require.resolve.paths('')
//  ["D:\dev\bella-desktop\node_modules",
//   "D:\dev\node_modules",
//   "D:\node_modules"]

function resolveExePath (node_modules) {
  // node_modules = D:\dev\bella-desktop\dist\win-unpacked\resources\app.asar\build\node_modules
  const i = node_modules.lastIndexOf('app.asar')
  if (i > 0) {
    return path.resolve(node_modules.slice(0, i), '..')
  } else {
    // debug mode
    // node_modules = D:\dev\bella-desktop\node_modules
    return path.resolve(node_modules, '..')
  }
}

const appRootPath = app
  ? process.env.NODE_ENV === 'development'
    ? app.getAppPath() : path.dirname(app.getPath('exe'))
  : window && typeof window.require === 'function' ? resolveExePath(window.require.resolve.paths('')[0])
    : ipcRenderer.sendSync('get-path', 'app'); // case of node disabled broswer window

const addonFilename = (name) => `${name}-${archName}.abi_${process.versions.modules}${EXT}`

//
// alias = [{ test, path }, ...]
//
function wrapRequire (originRequire, rootPath, alias) {
  if (originRequire.__injected__) {
    return originRequire
  }

  const f = function (modname, ...options) {
    if (alias) {
      for (const x of alias) {
        if (x.test.test(modname)) {
          modname = x.path
          break
        }
      }
    }

    // modname : node_sqlite3.addon
    // ext => addon
    const idx = modname.lastIndexOf('.')
    let ext = modname.slice(idx)

    if (ext === '.addon') {
      const name = modname.slice(0, idx)
      modname = path.resolve(rootPath, addonFilename(name))
      ext = EXT
    }

    if (ext === EXT) {
      const module = { exports: {} };
      process.dlopen(module, modname, os.constants.dlopen.RTLD_NOW);
      return module.exports;
    }

    return originRequire(modname, ...options)
  }

  // copy some essential properties
  f.cache = originRequire.cache
  f.extensions = originRequire.extensions
  f.resolve = originRequire.resolve
  f.__injected__ = true

  return f
}

module.exports = {
  archName,
  appRootPath,
  addonFilename,
  wrapRequire
}
