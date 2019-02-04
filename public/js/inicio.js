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

//CHATBOX
$(document).ready(function () {

    var arr = []; // List of users 

    $(document).on('click', '.msg_head', function () {
        var chatbox = $(this).parents().attr("rel");
        $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
        return false;
    });


    $(document).on('click', '.close', function () {
        var chatbox = $(this).parents().parents().attr("rel");
        $('[rel="' + chatbox + '"]').hide();
        arr.splice($.inArray(chatbox, arr), 1);
        displayChatBox();
        return false;
    });

    var interval = true
    var m, d

    $(document).on('click', '#sidebar-user-box', function () {

        var userID = $(this).attr("class");
        var username = $(this).children().text();

        if ($.inArray(userID, arr) != -1) {
            arr.splice($.inArray(userID, arr), 1);
        }

        arr.unshift(userID);
        chatPopup = '<div class="msg_box" style="right:270px" rel="' + userID + '">' +
            '<div class="msg_head">' + username +
            '<div class="close">x</div> </div>' +
            '<div class="msg_wrap"> <div class="msg_body"> <div class="msg_push"></div> </div>' +
            '<div class="msg_footer"><input type="text" class="msg_input"></div></div></div>';
        $("body").append(chatPopup);
        displayChatBox();
        ipc.send('iniciojs5', userID)

        d = new Date()
        d = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() +
            " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        console.log(d)
        clearInterval(m)
        m = setInterval(recibir, 1000, d, userID)

        function recibir(){
            ipc.send('iniciojs7', d, userID)
        }

        /* let i = new Interval(recibirMensajes2, 1000, Date.now());
        if (i.isRunning()){
            console.log(i.isRunning() + "off y on")
            i.stop()
            i.start()
        }else{
            console.log(i.isRunning() + "actívate")
            i.start()
        } */
    });

    //Hay que descomentarlo para chatear
    $(document).on('keypress', 'input', function (e) {
        if (e.keyCode == 13) {
            var msg = $(this).val();
            $(this).val('');
            if (msg.trim().length != 0) {
                var chatbox = $(this).parents().parents().parents().attr("rel");
                $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
                $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
            }
            ipc.send('iniciojs8', chatbox, msg)
            //mandarMensajes(chatbox, msg)
        }
    });

    function displayChatBox() {
        i = 270; // start position
        j = 260; //next position

        $.each(arr, function (index, value) {
            if (index < 4) {
                $('[rel="' + value + '"]').css("right", i);
                $('[rel="' + value + '"]').show();
                i = i + j;
            } else {
                $('[rel="' + value + '"]').hide();
            }
        });
    }

});
//FIN CHATBOX

function mensaje(msg, chatbox, boolean) {
    if (boolean) {
        $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    } else {
        $('<div class="msg-left">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
}

var on = false

/* function Interval(fn, time, parameter) {
    var timer = false;
    this.start = function () {
        timer = setInterval(fn, time, parameter);
        on = true
        console.log(on + "onfire")
    };
    this.stop = function () {
        clearInterval(timer);
        on = false;
    };
    this.isRunning = function () {
        console.log(on + "r")
        return on
    }; 
}*/

function inicio(){
    ipc.send('iniciojs')
}

function inicio2(){
    ipc.send('iniciojs2')
}

ipc.on('iniciojs3', function(event){
    div_show()
})

ipc.on('iniciojs6', function(event, arg1, arg2, arg3){
    mensaje(arg1, arg2, arg3)
})