const ipc = require('electron').ipcRenderer;
require('../../db/db/registrarsedb');

$(document).ready(function () {

    //Evento onload
    //Ninguno

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    btnregis = document.getElementById('registrarUsuario')    

    //Añadir los eventos
    btnregis.addEventListener('click', register)
})

//Valido que los campos no estén vacíos y mando ejecutar el registrarse
function register(){
    if (document.getElementById('nombre').value == "") {
        if (document.getElementById('pass').value == "") {
            alert("Introduzca un nombre y una contraseña")
        } else {
            alert("Introduzca un nombre")
        }
    } else if (document.getElementById('pass').value == "") {
        alert("Introduzca una contraseña")
    } else {
        ipc.send('registrarsejs-to-db')
    }
}
