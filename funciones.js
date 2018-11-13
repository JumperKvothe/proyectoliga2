//Variables Globales
nombre = "paco"
var puntos = 1000
var datos = Array()

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
    //nombre = ("#name").html
    //puntos = ("#points").html
    puntos = 700
    datos[0] = nombre
    datos[1] = puntos
    localStorage.setItem("datos", JSON.stringify(datos));
}

//Funciones goto1vs1

function crearSala() {

    $("#right").append('<div style="border: 1px solid white;"><p>EEE</p></div>')
    $("#left").append('<div style="border: 1px solid white;"><p>EEE</p></div><br>')
    $("#crear").hide()
    //console.log(nombre, puntos)
    var datosA = JSON.parse(localStorage.getItem("datos"));
    console.log(datosA[0], datosA[1], datosA)
}

function crearPartidaLoL() {
        
        $(".colas").append('<option value="0" selected disabled>Elige una cola</option>')
        $(".colas").append('<option class="1" value="1"> 1 contra 1</option>')
        $(".colas").append('<option class="2" value="2"> 5 contra 5</option>')
}