const {app, BrowserWindow, Menu, ipcMain} = require('electron')

const path = require('path')
const url = require('url')

/* //if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
    //Hay que desinstalarlo si no lo usamos
//} */

const ipc = ipcMain

let win

let userLogueado

//Crear la ventana desde electron
function createWindow()
    {
        win = new BrowserWindow ({show:false, width: 800, height: 600, webPreferences: {devTools: true}})
        win.loadURL(url.format({
            pathname: path.join(__dirname,'./public/html/login.html'),
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
            //logout()
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
    }


app.on('ready', createWindow)

ipc.on('user-logueado', function (event, arg) {
    userLogueado = arg
})

ipc.on('user-deslogueado', function (event) {
    logout()
    userLogueado = null
})

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

function logout(){
    if (userLogueado != null){
        sql = "DELETE FROM gente_online WHERE id = " + userLogueado;
        con.query(sql, function (err, result) {
        if (err) throw err;
        })
    }
}

//Crear una plantilla de pestañas y subpestañas (en arrays) y sus funciones onclick    
const templateMenu = [
    {
        label: 'Pestaña',
        submenu: [
            {
                label: 'Subpestaña1',
                accelerator: 'Ctrl+N', //Atajo de teclado
                click(){ //click izquierdo y atajo
                    //Hacer x
                }
            }
        ]
    }
]

/* ipc.on('a', function (event) {
    event.sender.send('b', '')
}) */

//Eventos IPC
ipc.on('loginjs', function (event, arg) {
    event.sender.send('logindb', con)
})
ipc.on('registrarsejs', function(event){
    event.sender.send('registrarsedb')
})
ipc.on('iniciojs', function (event){
    event.sender.send('iniciodb')
})