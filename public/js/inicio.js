const ipc = require('electron').ipcRenderer;
require('../../db/db/iniciodb');

$(document).ready(function () {

    //Evento onload
    mostrarNombre()
    
    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    popup = document.getElementById('popup')
    verificar = document.getElementById('verificar')
    lol = document.getElementById('lol')
    chat = document.getElementById('chat-sidebar')
    addAmigo = document.getElementById('addAmigo')

    //Añadir los eventos
    popup.addEventListener('click', div_hide)
    verificar.addEventListener('click', sacarid)
    lol.addEventListener('click', inicio)
   /*  chat.addEventListener('mouseenter', function(){
        showFriends(true)
    })
    chat.addEventListener('mouseleave', function(){
        showFriends(false)
    }) */
    addAmigo.addEventListener('click', inicio2)
})


//onload function
function mostrarNombre() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
    ipc.send('iniciojs4')
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

//Function To Display Popup (se usa desde db.js, hay que arreglarlo)
//Función para mostrar cómo verificar la cuenta de lol desde el cliente
function div_show() {
    document.getElementById('abc').style.display = "block";
    document.getElementById('bienvenido').style.display = "none";
    document.getElementById('eliteuser').style.display = "none";
}

function inicio(){
    ipc.send('iniciojs')
}

function inicio2(){
    ipc.send('iniciojs2')
}

ipc.on('iniciojs3', function(event){
    div_show()
})