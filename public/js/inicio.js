const ipc = require('electron').ipcRenderer;
require('../../db/db/iniciodb');
require('../../db/indexdb');

//Variables globales para el chat
var arr = []; // List of users 
var interval = true
var m, d
var on = false

$(document).ready(function () {

    //Eventos onload
    mostrarNombre()
    mostrarAmigos()
    ipc.send('panel-to-indexdb')
    document.getElementById('popupSup').style.display = "none"

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    popup = document.getElementById('popup')
    verificar = document.getElementById('verificar')
    lol = document.getElementById('lol')
    chat = document.getElementById('chat-sidebar')

    //Añadir los eventos
    popup.addEventListener('click', div_hide)
    //verificar.addEventListener('click', sacarid)
    lol.addEventListener('click', function () {
        ipc.send('iniciojs-lol-to-db')
    })
    chat.addEventListener('mouseenter', function () {
        showFriends(true)
    })
    chat.addEventListener('mouseleave', function () {
        showFriends(false)
    })
})

ipc.on('notlol', function (event) {
    div_show()
})

ipc.on('chatlisteners', function (event) {
    chatlisteners()
})

ipc.on('generatemessages', function (event, arg1, arg2, arg3) {
    generaMensajes(arg1, arg2, arg3)
})

//Mostrar tu nombre de usuario en la pantalla
function mostrarNombre() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
}

//Ejecutar la función de mostrar tus amigos conectados en el chat
function mostrarAmigos() {
    ipc.send('iniciojs-amigos-to-db')
}

//Function to Hide Popup con la "X"
function div_hide() {
    document.getElementById('popupSup').style.display = "none";
}

//Mostrar/Ocultar lista amigos con eventos onmouseover/onmouseleave
function showFriends(bool) {
    let elem = document.getElementById('chat-sidebar')
    if (bool) {
        let value = window.getComputedStyle(elem)
        value = parseInt(value.getPropertyValue('right'));
        let id1 = setInterval(suma, 1);

        function suma() {
            if (value > -1) {
                clearInterval(id1)
            } else {
                value += 2
                elem.style.right = value + "px"
            }
        }
    } else {
        let value2 = window.getComputedStyle(elem)
        value2 = parseInt(value2.getPropertyValue('right'));
        let id2 = setInterval(resta, 1);

        function resta() {
            if (value2 < -179) {
                clearInterval(id2)
            } else {
                value2 -= 2
                elem.style.right = value2 + "px"
            }
        }
    }
}

//Función para mostrar cómo verificar la cuenta de lol desde el cliente
function div_show() {
    document.getElementById('popupSup').style.display = "block";
    document.getElementById('bienvenido').style.display = "none";
    document.getElementById('eliteuser').style.display = "none";
}

//FUNCIONES CHATBOX

function chatlisteners() {

    //Desliza abajo/arriba un chat presionando en su cabecera
    $(document).on('click', '.msg_head', function () {
        var chatbox = $(this).parents().attr("rel");
        $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
        return false;
    });

    //Cierra un chat presionando la X de la esquina
    $(document).on('click', '.close', function () {
        var chatbox = $(this).parents().parents().attr("rel");
        $('[rel="' + chatbox + '"]').remove();
        arr.splice($.inArray(chatbox, arr), 1);
        displayChatBox();
        return false;
    });

    //Crea un chat presionando el amigo en la barra lateral
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
        ipc.send('iniciojs-loadmessages-to-db', userID)

        clearInterval(m)
        m = setInterval(recibir, 1000, userID)

        function recibir() {
            ipc.send('iniciojs-actualizarmsg-to-db', userID)
        }
    });

    //Crea los mensajes que mandas para que los veas aparecer y avisa a la función que los inserta en la bd
    $(document).on('keypress', '.msg_input', function (e) {
        if (e.keyCode == 13) {
            var msg = $(this).val();
            $(this).val('');
            if (msg.trim().length != 0) {
                var chatbox = $(this).parents().parents().parents().attr("rel");
                $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
                $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
                ipc.send('iniciojs-sendmessages-to-db', chatbox, msg)
            }
        }
    });

    //Ajusta el chat en la posición que toque (de derecha a izquierda)
    function displayChatBox() {
        i = 270; //start position
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
}
//FIN FUNCIONES CHATBOX

//Genera los mensajes del chat cargados
function generaMensajes(msg, chatbox, boolean) {
    if (boolean) {
        $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    } else {
        $('<div class="msg-left">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
}