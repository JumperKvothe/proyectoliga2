//Funciones comunes para varios js

$(document).ready(function () {

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    desconectarse = document.getElementById('desconectarse')

    //Añadir los eventos
    desconectarse.addEventListener('click', logout)
})

function logout(){
    ipc.send('user-deslogueado');
    goToLogin();
}