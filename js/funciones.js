process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-789b13dd-3997-4784-8ce4-94710c9ccc19'

const LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

//Variables Globales
nombre = "paco"
var puntos = 1000
var datos = Array()
var loluser

//Funciones generales

function gotoinicio() {
    window.location.href = "../html/inicio.html"
}

function gotoindex() {
    window.location.href = "../html/index.html"
}

function gotomodojuego() {
    window.location.href = "../html/modojuego.html"
    //guardarDatos()
}

function goto1vs1() {
    window.location.href = "../html/1vs1.html"
    funcionesdb(2);
}

function gotoclasi() {
    window.location.href = "../html/clasi.html"
}

function copyToClipboard(element) {
    try {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).val()).select();
        var retVal = document.execCommand("copy");
        console.log('Copy to clipboard returns: ' + retVal);
        $temp.remove();
    } catch (err) {
        console.log('Error while copying to clipboard: ' + err);
    }
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

/* function crearPartidaLoL() {

    $(".colas").append('<option value="0" selected disabled>Elige una cola</option>')
    $(".colas").append('<option class="1" value="1"> 1 contra 1</option>')
    $(".colas").append('<option class="2" value="2"> 5 contra 5</option>')
} */

$(document).on('ready', function () {
    $(document).on('click', '#btn-ingresar', function () {
        var json = $("#formulario").serialize();
        $.ajax({
            type: "POST",
            url: "http://elitegamingcenter.com/servicio/checklogin",
            data: json,
            success: function (data) {}
        })
    });
});

//Función para que el programa haga una u otra cosa en función de si el usuario ya está verificado o no
function yaverificado(boolean) {
    if (boolean) {
        gotoindex()
    } else {
        $(".modalDialog").append(function () {
            return '<div class="container"><a href="#close" title="Close" class="close">X</a>' +
                '<h3 style="color: #e90606;">Verificación de cuenta de LoL</h3><br>' +
                '<div class="row"><div class="center"><label>Nombre en League of legends</label>' +
                '<input type="text" name="loluser" title="Introduzca su nombre del LoL" autofocus required><br><br>' +
                '<label>Para vincular su cuenta siga estos pasos: <br>' +
                '1. Acceda a su cuenta de League of Legends. <br>' +
                '2. Acceda a la configuración de su cuenta (La ruedita de arriba a la derecha). <br>' +
                '3. Busque la opción de VERIFICACIÓN. <br>' +
                '4. Introduzca "VivaElite" en el recuadro y pulse el botón GUARDAR. <br>' +
                '5. Pulse el botón Verificar y espere. <br></label>' +
                '<input type="submit" onclick=sacarid() name="verificarboton" value="Verificar"></div>' +
                '</div></div>';
        });
        $(function() {
            $("form").submit(function() { return false; });
        });
    }
}

//Función para sacar el ID de invocador a partir del nombre de invocador introducido
//Hay que controlar que el nombre de invocador exista
function sacarid (){
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

//Función que lleva a cabo la verificación de la cuenta mediante la opción del cliente del LOL
//Hay que controlar si no introducen bien el texto en el LOL
function verificarlol(id, loluser){
    leagueJs.ThirdPartyCode
	.verifying('VivaElite', id, 'euw')
	.then(data => {
		'use strict';
		if (data){
			addnom(loluser);
		}
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});
}

function imprimirN (){
        
    var nombrelol = sessionStorage.getItem('loluser');
    console.log(nombrelol);
    leagueJs.Summoner
	.gettingByName(nombrelol)
	.then(data => {
        'use strict';        
        console.log(data);
        
        $( document ).ready(function() {
			$(".nombre").html(data.name);
			loluser = data.name;
        });
        
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});
}