const ipc = require('electron').ipcRenderer;
require('../../db/db/clasidb');
require('../../db/indexdb');

$(document).ready(function () {

    //Evento onload
    ipc.send('clasijs-load-to-db')
    ipc.send('panel-to-indexdb')

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    izq = document.getElementById('flecha_izq')
    der = document.getElementById('flecha_der')

    //Añadir los eventos
    izq.addEventListener('click', function () {
        arrow(false)
    })
    der.addEventListener('click', function () {
        arrow(true)
    })
})


//Cambiar páginas clasificación
function arrow(bool){
    if (bool){
        document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) +1
    }else{
        if (parseInt(document.getElementById('tablita').value) != 1) {
            document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) -1
        }
    }
    ipc.send('clasijs-load-to-db')
}