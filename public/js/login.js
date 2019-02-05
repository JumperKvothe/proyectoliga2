const ipc = require('electron').ipcRenderer;
require('../../db/db/logindb');

$(document).ready(function () {

    //Evento onload (hay que arreglarlo)
    

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    inputNombre = document.getElementById('nombre')
    inputPass = document.getElementById('pass')
    btnconect = document.getElementById('btnconect')

    //Añadir los eventos
    inputNombre.addEventListener('keyup', function (e) {
        if (e.keyCode === 13)
            login()
    })
    inputPass.addEventListener('keyup', function (e) {
        if (e.keyCode === 13)
            login()
    })
    btnconect.addEventListener('click', login)

})

//No se está usando
function loginLoad() {
    ipc.send('user-deslogueado')
    console.log('pillín')
}

function login() {
    console.log('ipc')
    ipc.send('loginjs')
}