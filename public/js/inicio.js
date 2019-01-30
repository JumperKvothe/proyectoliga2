const ipc = require('electron').ipcRenderer;
require('../../db/db/logindb');

$(document).ready(function () {

    //Evento onload
    mostrarNombre()
    
    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    popup = document.getElementById('popup')
    verificar = document.getElementById('verificar')

    //Añadir los eventos
    popup.addEventListener('click', inicio)
    verificar.addEventListener('click', sacarid)

})


//onload function
function mostrarNombre() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
    checkOnline()
}

//Function to Hide Popup
function div_hide() {
    document.getElementById('abc').style.display = "none";
}

//Función para sacar el ID de invocador a partir del nombre de invocador introducido
function sacarid() {
    loluser = document.getElementsByName("loluser")[0].value;
    leagueJs.Summoner
        .gettingByName(loluser)
        .then(data => {
            'use strict';
            //Prueba de coger un dato (Funciona). Para probar todo usar ' node server.js '
            const id = data.id;
            verificarlol(id, loluser);
        })
        .catch(err => {
            'use strict';
            alert("El nombre introducido no existe");
            console.log(err);
        });
}

//Mostrar/Ocultar lista amigos
function showFriends(bool){
    let elem = document.getElementById('chat-sidebar')
    if(bool){
        let value = window.getComputedStyle(elem)
        value = parseInt(value.getPropertyValue('right'));
        let id1 = setInterval(suma, 1);
        function suma(){
            if(value > -1){
                clearInterval(id1)
            }else{
                value += 2
                elem.style.right = value + "px"
            }
        }
    }else{
        let value2 = window.getComputedStyle(elem)
        value2 = parseInt(value2.getPropertyValue('right'));
        let id2 = setInterval(resta, 1);
        function resta(){
            if(value2 < -179){
                clearInterval(id2)
            }else{
                value2 -= 2
                elem.style.right = value2 + "px"
            }
        }
    }
    
}

//No se puede llamar a funcionesdb(4) en el html (hay que arreglar)

function inicio(){
    console.log('inicio')
    ipc.send('iniciojs')
}