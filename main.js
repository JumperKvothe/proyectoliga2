const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = require('electron')

const path = require('path')
const url = require('url')

const mysql = require('mysql');

//Estaría guay cargar estos datos desde un archivo local aunque el main.js debería ser seguro
var conex = ["erionegro.salesianas.es", "erion_liga", "1234Mono!", "erionegro_ligaelite", true];
var con = mysql.createConnection({
    host: conex[0],
    user: conex[1],
    password: conex[2],
    database: conex[3],
    multipleStatements: conex[4]
});

/* //if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
    //Hay que desinstalarlo si no lo usamos
//} */

const ipc = ipcMain

let win

var userLogueado

//Crear la ventana desde electron
function createWindow() {
    win = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            devTools: true
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, './public/html/login.html'),
        protocol: 'file',
        slashes: true,
        resizable: false
    }))

    //Activar template de pestañas/subpestañas
    /* const MainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(MainMenu) */

    //Eliminar pestañas/subpestañas
    //win.setMenu(null)

    win.once('ready-to-show', () => {
        win.show();
    })

    win.on('close', () => {
        logout()
    })

    win.on('closed', () => {
        app.quit();
    });

    //Parámetros de lanzamiento de interés
    win.maximize();
    //win.setResizable(false);
    //win.setFullScreenable(false);
    //win.setMaximizable(true);
    //win.setMinimizable(false);
    //win.webContents.openDevTools()

    inicioDB();
}

app.on('ready', createWindow)

//Cargar la conexión
function inicioDB() {
    console.log('db')
}

ipc.on('user-logueado', function (event, arg) {
    userLogueado = arg
})

ipc.on('user-deslogueado', function (event) {
    logout()
    userLogueado = null
    console.log('logout123')
})

//Eliminamos de la bbdd el usuario conectado al cerrar la aplicación (si hay alguno)
function logout() {
    if (userLogueado != null) {
        sql = "DELETE FROM gente_online WHERE id = " + userLogueado;
        con.query(sql, function (err, result) {
            if (err) throw err;
        })
    }
    console.log('logout')
}

//Crear una plantilla de pestañas y subpestañas (en arrays) y sus funciones onclick    
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

/* ipc.on('a', function (event) {
    event.sender.send('b', '')
}) */

//Eventos IPC
ipc.on('loginjs', function (event, arg) {
    event.sender.send('logindb', conex)
})
ipc.on('registrarsejs', function (event) {
    event.sender.send('registrarsedb')
})
ipc.on('iniciojs', function (event) {
    event.sender.send('iniciodb')
})
ipc.on('iniciojs2', function (event) {
    event.sender.send('iniciodb2')
})
ipc.on('iniciodb3', function (event) {
    event.sender.send('iniciojs3')
})
ipc.on('iniciojs4', function (event) {
    event.sender.send('iniciodb4')
})
ipc.on('iniciojs5', function (event, arg) {
    event.sender.send('iniciodb5', arg)
})
ipc.on('iniciodb6', function (event, arg1, arg2, arg3) {
    event.sender.send('iniciojs6', arg1, arg2, arg3)
})
ipc.on('iniciojs7', function (event, arg1, arg2) {
    event.sender.send('iniciodb7', arg1, arg2)
})
ipc.on('iniciojs8', function (event, arg1, arg2) {
    event.sender.send('iniciodb8', arg1, arg2)
})
ipc.on('equiposjs', function (event) {
    event.sender.send('equiposdb')
})
ipc.on('equipos1js', function (event) {
    event.sender.send('equipos1db')
})