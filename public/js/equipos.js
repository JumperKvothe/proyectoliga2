const ipc = require('electron').ipcRenderer;
require('../../db/db/equiposdb');

$(document).ready(function () {

    //Evento onload
    equiposload()

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    crearE = document.getElementById('crearE')

    //Añadir los eventos
    crearE.addEventListener('click', equipos)
})

function equiposload(){
    ipc.send('equiposjs')
}

function equipos (){
    ipc.send('equipos1js')
}