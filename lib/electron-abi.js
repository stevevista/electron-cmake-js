const {app} = require('electron')

// surpress warning
app.allowRendererProcessReuse = false;
console.log(process.versions.modules, ',', process.versions.electron)
app.quit()
