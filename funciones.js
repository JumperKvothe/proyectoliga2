//Funciones generales

function gotoindex(){
    window.location.href = "index.html"
}

function gotomodojuego(){
    window.location.href = "modojuego.html"
}

function goto1vs1 (){
    window.location.href = "1vs1.html"
}

//Funciones goto1vs1

function crearSala(){

    $("#right").append('<div style="border: 1px solid white;"><p>EEE</p></div>')
    $("#left").append('<div style="border: 1px solid white;"><p>EEE</p></div><br>')
    $("#crear").hide()
}