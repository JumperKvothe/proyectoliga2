const ipc = require('electron').ipcRenderer;
require('../../db/db/logindb');

$(document).ready(function () {

    //Evento onload
    //Limpio el almacenamiento del usuario actual
    localStorage.setItem("currentUser", null);

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    inputNombre = document.getElementById('nombre')
    inputPass = document.getElementById('pass')
    btncon = document.getElementById('btnconectarse')

    //Añadir los eventos
    inputNombre.addEventListener('keyup', function (e) {
        if (e.keyCode === 13)
            login()
    })
    inputPass.addEventListener('keyup', function (e) {
        if (e.keyCode === 13)
            login()
    })
    btncon.addEventListener('click', login)

})

//Valido que los campos no estén vacíos y mando ejecutar el login
function login() {
    if (document.getElementById('nombre').value == "") {
        if (document.getElementById('pass').value == "") {
            alert("Introduzca un nombre y una contraseña")
        } else {
            alert("Introduzca un nombre")
        }
    } else if (document.getElementById('pass').value == "") {
        alert("Introduzca una contraseña")
    } else {
        ipc.send('loginjs-to-db')
    }
}