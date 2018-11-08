//Variables Globales
nombre = "paco"
let puntos = 500

//Funciones generales

function gotoindex() {
    window.location.href = "index.html"
}

function gotomodojuego() {
    window.location.href = "modojuego.html"
    guardarDatos()
}

function goto1vs1() {
    window.location.href = "1vs1.html"
}

//Funciones index

function guardarDatos() {
    nombre = ("#name").html
    //puntos = ("#points").html
    puntos = 700
    console.log(puntos)
}

//Funciones goto1vs1

function crearSala() {

    $("#right").append('<div style="border: 1px solid white;"><p>EEE</p></div>')
    $("#left").append('<div style="border: 1px solid white;"><p>EEE</p></div><br>')
    $("#crear").hide()
    console.log(nombre, puntos)
}

function openDialog() {

    $('#overlay').fadeIn('fast', function () {
        $('#popup').css('display', 'block');
        $('#popup').animate({
            'left': '30%'
        }, 500);
    });
}

function closeDialog(id) {

    $('#' + id).css('position', 'absolute');
    $('#' + id).animate({
        'left': '-100%'
    }, 500, function () {
        $('#' + id).css('position', 'fixed');
        $('#' + id).css('left', '100%');
        $('#overlay').fadeOut('fast');
    });
}