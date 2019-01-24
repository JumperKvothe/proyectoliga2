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

const db = require('./db')

let win

//Crear la ventana desde electron
function createWindow()
    {
        win = new BrowserWindow ({show:false, width: 800, height: 600, webPreferences: {devTools: true}})
        win.loadURL(url.format({
            pathname: path.join(__dirname,'../html/login.html'),
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
            console.log('asfasda')
            adios()
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

ipc.on('quit', function (event, arg) {
    console.log(arg)
})

function adios(){
    console.log('adio5')
    console.log()
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
