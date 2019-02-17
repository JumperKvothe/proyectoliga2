const ipc = require('electron').ipcRenderer;
require('../../db/db/paneldb');

$(document).ready(function () {

    //Evento onload
    ipc.send('paneljs-show-to-db')
})