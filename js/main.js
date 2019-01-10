const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url = require('url')

let win

//let dbjs = require("./db.js");

function createWindow()
    {
        win = new BrowserWindow ({width: 800, height: 600, webPreferences: {devTools: true}})
        win.loadURL(url.format({
            pathname: path.join(__dirname,'../html/login.html'),
            protocol: 'file',
            slashes: true,
            resizable: false
        }))
        win.maximize();
        //win.setResizable(false);
        //win.setFullScreenable(false);
        //win.setMaximizable(true);
        //win.setMinimizable(false);
        //win.setMenu(null)
        //win.webContents.openDevTools()
        win.on('closed', () => {
            //dbjs.;
            //dbjs.alCerrar();
            app.quit();
          });
    }

app.on('ready', createWindow)