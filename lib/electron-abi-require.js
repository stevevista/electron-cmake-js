const { app, remote, ipcRenderer } = require('electron')
const path = require('path')
const os = require('os')

const EXT = process.platform === 'win32' ? '.dll' : '.so'
const archName = process.platform + '-' + process.arch

// app.getAppPath()
// release -- "D:\dev\bella-desktop\dist\win-unpacked\resources\app.asar"
// debug -- "D:\dev\bella-desktop"
const appPath = app ? app.getAppPath() : (remote ? remote.app.getAppPath() : ipcRenderer.sendSync('get-path', 'app'))
const appRootPath = process.env.NODE_ENV === 'development' ? appPath : path.resolve(appPath, '../..')

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
