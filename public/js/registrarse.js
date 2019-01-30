const ipc = require('electron').ipcRenderer;
require('../../db/db/registrarsedb');

$(document).ready(function () {

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    btnconect = document.getElementById('btnconect')    

    //Añadir los eventos
    btnconect.addEventListener('click', register)
})

function register(){
    console.log('regis')
    ipc.send('registrarsejs')
}