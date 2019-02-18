const ipc = require('electron').ipcRenderer;
require('../../db/db/perfildb');
require('../../db/indexdb');

$(document).ready(function () {

    //Eventos onload
    mostrarNombre()
    ocultarEle()
    ipc.send('perfiljs-imagen-to-db')
    ipc.send('panel-to-indexdb')

    //Declaración de variables de los elementos de html en los cuáles añadir un evento
    oldpass = document.getElementById('oldpass')
    newpass1 = document.getElementById('newpass1')
    newpass2 = document.getElementById('newpass2')
    l1 = document.getElementById('l1')
    l2 = document.getElementById('l2')
    l3 = document.getElementById('l3')
    centro = document.getElementById('centro')
    changepass = document.getElementById('changepass')
    changecentro = document.getElementById('changecentro')
    btneditar = document.getElementById('btneditar')
    fileimg = document.getElementById('fileimg');

    //Añadir los eventos
    btneditar.addEventListener('click', mostrarEle)
    changepass.addEventListener('click', cambiarPass)
    changecentro.addEventListener('click', function () {
        ipc.send('perfiljs-centro-to-db')
    })
    fileimg.addEventListener('change', cambiarImagen)

    function ocultarEle() {
        l1.style.display = 'none'
        l2.style.display = 'none'
        l3.style.display = 'none'
        changepass.style.display = 'none'
        changecentro.style.display = 'none'
        centro.style.display = 'none'
    }

    function mostrarEle() {
        if (l1.style.display == 'none') {
            l1.style.display = 'block'
            l2.style.display = 'block'
            l3.style.display = 'block'
            changepass.style.display = 'block'
            changecentro.style.display = 'block'
            centro.style.display = 'block'
            oldpass.type = 'password'
            newpass1.type = 'password'
            newpass2.type = 'password'
        } else {
            ocultarEle()
            oldpass.type = 'hidden'
            newpass1.type = 'hidden'
            newpass2.type = 'hidden'
        }
    }
})

//Mostrar tu nombre de usuario en inicio del perfil
function mostrarNombre() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
}

function cambiarPass() {
    if (document.getElementById('oldpass').value == "" ||
        document.getElementById('newpass1').value == "" ||
        document.getElementById('newpass2').value == "") {
        alert("Rellene los campos de contraseña")
    } else {
        if (document.getElementById('oldpass').value == document.getElementById('newpass1').value) {
            alert('La nueva contraseña es igual a la antigua')
        } else {
            if (document.getElementById('newpass1').value == document.getElementById('newpass2').value) {
                ipc.send('perfiljs-pass-to-db')
            } else {
                alert('No coinciden las contraseñas')
            }
        }
    }
}

//Cambiar la imagen de perfil
//Falta acabar
function cambiarImagen() {
    console.log('onchange imagen')
    
}