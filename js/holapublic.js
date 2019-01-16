const { foo } = require('./script.js')
const { ipcRenderer } = require('electron')

function r(){
    ipcRenderer.on('call-foo', (event/*, arg*/) => {
        hola()
    })
}
    