const {
    //Módulo para controlar la aplicación
    app,
    //Módulo que representa el proceso de renderizado
    //BrowserWindow crea una instancia de Chromium que permite crear la UI de la app
    BrowserWindow,
    //Módulo para crear y personalizar el menú de la aplicación y el menú contextual
    Menu,
    //Módulo que se utiliza en el proceso principal para manejar mensajes asincrónicos y
    //sincrónicos enviados desde el proceso de renderizado
    ipcMain
} = require('electron')

const path = require('path')
const url = require('url')
const ipc = ipcMain

let win
let iduserLogueado

function createWindow() {
    //Crea la ventana desde electron
    win = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            devTools: true
        }
    })
    //Y carga el arhivo html inicial de la app
    win.loadURL(url.format({
        pathname: path.join(__dirname, './public/html/login.html'),
        protocol: 'file',
        slashes: true,
        resizable: false
    }))

    //Activar template del Menú
    /* const MainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(MainMenu) */

    //Desactivar cualquier Menú (incluido el que viene por defecto)
    //win.setMenu(null)

    //Junto a la propiedad show: false evita crear la ventana antes de que todo el contenido esté renderizado
    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
    })

    win.on('close', (event) => {
        let obj = {
            iduserLogueado,
            bool: true
        }
        //Prevengo que se ejecute el evento de cerrar la ventana hasta que me asegure que se remueve al usuario de la gente_online
        if (iduserLogueado != null) {
            event.preventDefault();
            event.sender.send('logoutdb', obj)
        }
    })

    win.on('closed', function () {
        //La forma de cerrar una ventana en la app
        win = null;
    })
    //win.webContents.openDevTools()
}

//Cuando la aplicación esté lista para ejecutarse se crea la ventana que va a renderizarse
app.on('ready', createWindow)

// Específico para OS X
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Específico para OS X
app.on('activate', function () {
    if (win === null) {
        createWindow()
    }
})

//Crear una plantilla de Menú de pestañas y subpestañas (en arrays) y sus funciones onclick
//No se está usando    
const templateMenu = [{
    label: 'Pestaña',
    submenu: [{
        label: 'Subpestaña1',
        accelerator: 'Ctrl+N', //Atajo de teclado
        click() { //click izquierdo y atajo
            //Hacer x
        }
    }]
}]

//EVENTOS IPC DE ESTA PÁGINA
//Al loguear guardo la id del usuario en una variable y la compruebo al cerrar la aplicación para desconectarlo
ipc.on('user-logueado', function (event, arg) {
    iduserLogueado = arg
})
ipc.on('user-deslogueado', function (event) {
    let obj = {
        iduserLogueado,
        bool: false
    }
    event.sender.send('logoutdb', obj)
})
ipc.on('desconectado', function (event) {
    //Recibo la confirmación de que el usuario se ha desconectado y permitimos cerrar la ventana
    win.removeAllListeners('close');
    win.close();
})

//EVENTOS IPC DONDE EL MAIN.JS MEDIA
ipc.on('loginjs-to-db', function (event) {
    event.sender.send('logindb')
})
ipc.on('registrarsejs-to-db', function (event) {
    event.sender.send('registrardb')
})
ipc.on('iniciojs-amigos-to-db', function (event) {
    event.sender.send('amigosdb')
})
ipc.on('iniciojs-lol-to-db', function (event) {
    event.sender.send('loldb')
})
ipc.on('iniciodb-notlol-to-js', function (event) {
    event.sender.send('notlol')
})
ipc.on('iniciodb-chatlisteners-to-js', function (event) {
    event.sender.send('chatlisteners')
})
ipc.on('iniciojs-sendmessages-to-db', function (event, arg1, arg2) {
    event.sender.send('sendmessages', arg1, arg2)
})
ipc.on('iniciojs-loadmessages-to-db', function (event, arg) {
    event.sender.send('loadmessages', arg)
})
ipc.on('iniciodb-mensajes-to-js', function (event, arg1, arg2, arg3) {
    event.sender.send('generatemessages', arg1, arg2, arg3)
})
ipc.on('iniciojs-actualizarmsg-to-db', function (event, arg1) {
    event.sender.send('actualizarmsg', arg1)
})
ipc.on('clasijs-load-to-db', function (event) {
    event.sender.send('loadclasi')
})
ipc.on('perfiljs-pass-to-db', function (event) {
    event.sender.send('changepass')
})
ipc.on('perfiljs-centro-to-db', function(event){
    event.sender.send('changecentro')
})
ipc.on('perfiljs-imagen-to-db', function(event){
    event.sender.send('cambiarimagen')
})
ipc.on('panel-to-indexdb', function(event){
    event.sender.send('mostrarPanel')
})
ipc.on('paneljs-show-to-db', function(event){
    event.sender.send('showPage')
})

ipc.on('iniciojs-addfriend-to-db', function (event) {
    event.sender.send('addamigo')
})