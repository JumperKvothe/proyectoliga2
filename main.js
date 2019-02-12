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

const mysql = require('mysql');

let win

let iduserLogueado

//Inicializar y crear la conexión de la BBDD de MySQL
//var conex = ["erionegro.salesianas.es", "erion_liga", "1234Mono!", "erionegro_ligaelite", true];
var conex = ["copeik.ddns.net", "phpmyadmin", "1234", "ligaelite", true];
var con = mysql.createConnection({
    host: conex[0],
    user: conex[1],
    password: conex[2],
    database: conex[3],
    multipleStatements: conex[4]
});

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
            conex,
            iduserLogueado
        }
        win.webContents.send('logoutdb', obj)
    })

    win.on('closed', function () {
        //La forma de cerrar una ventana en la app
        win = null
    })

    //Parámetros de lanzamiento de interés
    //win.setResizable(false);
    //win.setFullScreenable(false);
    //win.setMaximizable(true);
    //win.setMinimizable(false);
    win.webContents.openDevTools()
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

//Eliminamos de la bbdd el usuario conectado al cerrar la aplicación (si hay alguno)
/* function logout() {
    if (iduserLogueado != null) {
        sql = "DELETE FROM gente_online WHERE id = " + iduserLogueado;
        con.query(sql, function (err, result) {
            if (err) throw err;
            iduserLogueado = null
        })
    }
} */

//Eventos IPC de esta página
ipc.on('user-logueado', function (event, arg) {
    iduserLogueado = arg
})

ipc.on('user-deslogueado', function (event) {
    //logout()
    let obj = {
        conex,
        iduserLogueado
    }
    event.sender.send('logoutdb', obj)
})

//Eventos IPC donde el main.js media
ipc.on('loginjs-to-db', function (event) {
    event.sender.send('logindb', conex)
})
ipc.on('registrarsejs-to-db', function (event) {
    event.sender.send('registrardb', conex)
})
ipc.on('iniciojs-amigos-to-db', function (event) {
    event.sender.send('amigosdb', conex)
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

//Plain text encryption
//Encrypt y Decrypt
/* var CryptoJS = require("crypto-js");

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'my message' */

//Object encryption
/* Object encryption
var CryptoJS = require("crypto-js");

var data = [{id: 1}, {id: 2}]

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData); // [{id: 1}, {id: 2}] */