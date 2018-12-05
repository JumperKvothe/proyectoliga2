process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-743f335c-2e6c-4c91-b74a-ed208386c5c5'

const LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

//Funciones generales

function gotoinicio() {
    window.location.href = "../html/inicio.html"
}

function gotoindex() {
    window.location.href = "../html/index.html"
}

function gotomodojuego() {
    window.location.href = "../html/modojuego.html"
}

function goto1vs1() {
    window.location.href = "../html/1vs1.html"
    funcionesdb(2);
}

function gotoclasi() {
    window.location.href = "../html/clasi.html"
}

function gotologin() {
    window.location.href = "../html/login.html"
}

function gotoregis(){
    window.location.href = "../html/registrarse.html"
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
    $('#copia').text("Copiado!")
}

//Funciones goto1vs1

/* $(document).on('ready', function () {
    $(document).on('click', '#btn-ingresar', function () {
        var json = $("#formulario").serialize();
        $.ajax({
            type: "POST",
            url: "http://elitegamingcenter.com/servicio/checklogin",
            data: json,
            success: function (data) {}
        })
    });
}); */

/*Función que manda al usuario con cuenta de lol verificada a la siguiente página y al que no le da la
oportunidad de poder verificarla a través del cliente de lol*/
function yaverificado(boolean) {
    if (boolean) {
        gotoindex()
    } else {
        div_show();
        /* $(".modalDialog").append(function () {
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
        }); */
    }
}

//Function To Display Popup
function div_show() {
    document.getElementById('abc').style.display = "block";
    }
    //Function to Hide Popup
    function div_hide(){
    document.getElementById('abc').style.display = "none";
    }

//Función para sacar el ID de invocador a partir del nombre de invocador introducido
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
        alert("No se introdució el texto correcto en el cliente de lol")
		console.log(err);
	});
}

//Revisar
//Mostrar el nombre de lol en el index de lol
function imprimirN (){
    
    let user = JSON.parse(localStorage.getItem('currentUser'))
    console.log(user.loluser);
    leagueJs.Summoner
	.gettingByName(user.loluser)
	.then(data => {
        'use strict';        
        console.log(data);
        
        $( document ).ready(function() {
			$(".nombre").html(data.name);
        });
        
	})
	.catch(err => {
		'use strict';
		console.log(err);
    });
    funcionesdb(5)
}

//Mostrar nombre del usuario en el inicio.html
function mostrarNombre(){
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
}