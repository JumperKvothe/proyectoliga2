const {app, BrowserWindow, Menu} = require('electron')

const path = require('path')
const url = require('url')

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
    //Hay que desinstalarlo si no lo usamos
}

let win

app.on('ready', createWindow)

//Crear la ventana desde electron
function createWindow()
    {
        win = new BrowserWindow ({width: 800, height: 600, webPreferences: {devTools: true}})
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
